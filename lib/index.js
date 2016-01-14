import 'babel-polyfill';

import cuid from 'cuid';
import pify from 'pify';

import {ViewQuery} from 'couchbase';

export default function (bucket) {
    return {
        defineModel: (modelName, modelDefinition) => defineModel(bucket, modelName, modelDefinition)
    };
}

function defineModel(bucket, modelName, modelDefinition) {
    console.log(modelDefinition);

    const viewCreationPromise = createViews(bucket.manager(), modelName, modelDefinition);

    const getAsync = pify(bucket.get.bind(bucket));
    const insertAsync = pify(bucket.insert.bind(bucket));
    const updateAsync = pify(bucket.upsert.bind(bucket));
    const deleteAsync = pify(bucket.remove.bind(bucket));
    const queryAsync = pify(bucket.query.bind(bucket));
    const getMultiAsync = pify(bucket.getMulti.bind(bucket));

    return {
        get: async function (itemId) {
            const result = await getAsync(itemId);
            return result.value;
        },
        create: async function (item) {
            const itemId = cuid();
            let itemToInsert = addProps(item, modelName, itemId);

            await insertAsync(itemId, itemToInsert);
            return itemToInsert;
        },
        update: async function (itemId, item) {
            let itemToUpdate = addProps(item, modelName, itemId);

            await updateAsync(itemId, itemToUpdate);
            return itemToUpdate;
        },
        delete: async function (itemId) {
            await deleteAsync(itemId);
        },
        query: async function () {
            await viewCreationPromise;

            const q = ViewQuery.from(`lawson_${ modelName }`, 'by_id');
            const queryResult = await queryAsync(q);

            const ids = queryResult.map(x => x.id);
            const multiResult = await getMultiAsync(ids);

            const documents = Object.keys(multiResult).map(id => multiResult[id].value);
            return documents;
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
        views[`by_${ fieldName }`] = {
            map: `
                function (doc, meta) {
                    if (doc.type && doc.type == '${ modelName }') {
                        emit(doc.${ fieldName }, null);
                    }
                }
            `
        };
    });

    return pify(bucketManager.upsertDesignDocument.bind(bucketManager))(`lawson_${ modelName }`, {views});
}
