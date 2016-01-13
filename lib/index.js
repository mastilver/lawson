import 'babel-polyfill';

import cuid from 'cuid';
import pify from 'pify';

export default function (bucket) {
    return {
        defineModel: (modelName, modelDefinition) => defineModel(bucket, modelName, modelDefinition)
    };
}

function defineModel(bucket, modelName, modelDefinition) {
    console.log(modelDefinition);

    const getAsync = pify(bucket.get.bind(bucket));
    const insertAsync = pify(bucket.insert.bind(bucket));
    const updateAsync = pify(bucket.upsert.bind(bucket));
    const deleteAsync = pify(bucket.remove.bind(bucket));

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
        }
    };
}

function addProps(item, type, id) {
    return Object.assign({
        id,
        type
    }, item);
}
