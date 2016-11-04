import 'babel-polyfill';

import cuid from 'cuid';
import pify from 'pify';
import schemaValidator from 'db-schema-validator';

import {ViewQuery} from 'couchbase';

export default function (bucket) {
    return {
        defineModel: (modelName, modelDefinition) => defineModel(bucket, modelName, modelDefinition)
    };
}

function defineModel(bucket, modelName, modelDefinition) {
    const viewCreationPromise = createViews(bucket.manager(), modelName, modelDefinition);

    const getAsync = pify(bucket.get.bind(bucket));
    const insertAsync = pify(bucket.insert.bind(bucket));
    const updateAsync = pify(bucket.upsert.bind(bucket));
    const deleteAsync = pify(bucket.remove.bind(bucket));
    const getMultiAsync = pify(bucket.getMulti.bind(bucket));

    const validate = schemaValidator(modelDefinition);

    return {
        get: async function (itemId) {
            const result = await getAsync(itemId);
            return result.value;
        },
        create: async function (item) {
            validate(item);

            const itemId = cuid();
            let itemToInsert = addProps(item, modelName, itemId);

            await insertAsync(itemId, itemToInsert);
            return itemToInsert;
        },
        update: async function (itemId, item) {
            validate(item);

            let itemToUpdate = addProps(item, modelName, itemId);

            await updateAsync(itemId, itemToUpdate);
            return itemToUpdate;
        },
        delete: async function (itemId) {
            await deleteAsync(itemId);
        },
        query: async function ({where = {}, limit, offset} = {}) {
            await viewCreationPromise;

            var fieldNames = Object.keys(where);

            if (fieldNames.length === 0) {
                fieldNames.push('id');
            }

            const queryResults = await Promise.all(fieldNames.map(x => {
                return executeQuery(bucket, modelName, x, where[x]);
            }));

            let ids = applyWhereClause(queryResults);

            if (typeof limit === 'number') {
                if (typeof offset !== 'number') {
                    offset = 0;
                }

                ids = ids.slice(offset, offset + limit);
            }

            if (ids.length === 0) {
                return [];
            }

            const multiResult = await getMultiAsync(ids);

            const documents = Object.keys(multiResult).map(id => multiResult[id].value);
            return documents;
        },
        first: async function (where) {
            const result = await this.query({
                where,
                limit: 1
            });

            return result.length > 0 ? result[0] : null;
        },
        single: async function (where) {
            const result = await this.query({
                where,
                limit: 2
            });

            switch (result.length) {
                case 0: return null;
                case 1: return result[0];
                default: throw new Error('Found more than one item matching the query');
            }
        }
    };
}

function addProps(item, type, id) {
    return Object.assign({
        id,
        type
    }, item);
}

function createViews(bucketManager, modelName, modelDefinition) {
    const views = {};

    const fieldNames = Object.keys(modelDefinition);
    fieldNames.push('id');

    fieldNames.forEach(fieldName => {
        views[`by_${fieldName}`] = {
            map: `
                function (doc, meta) {
                    if (doc.type && doc.type == '${modelName}') {
                        emit(doc.${fieldName}, null);
                    }
                }
            `
        };
    });

    return pify(bucketManager.upsertDesignDocument.bind(bucketManager))(`lawson_${modelName}`, {views});
}

async function executeQuery(bucket, modelName, fieldName, params) {
    const queryAsync = pify(bucket.query.bind(bucket));

    let q = ViewQuery.from(`lawson_${modelName}`, `by_${fieldName}`);

    if (params != null) {
        q = q.key(params);
    }

    const queryResult = await queryAsync(q);

    const result = {};
    queryResult.forEach(x => {
        result[x.id] = x.key;
    });
    return result;
}

function applyWhereClause(arr) {
    return Object.keys(arr[0]).filter(id => {
        return arr.every(x => {
            return Object.keys(x).includes(id);
        });
    });
}

/*
function applyOrClause(arr) {
    const mergedObject = Object.assign({}, ...arr);
    const ids = Object.keys(mergedObject);

    return ids;
}
*/
