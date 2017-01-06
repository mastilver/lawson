// eslint-disable-next-line import/no-unassigned-import
import 'babel-polyfill';

import schemaValidator from 'db-schema-validator';

export default function (nosqwalInstance) {
    return {
        defineCollection: (type, modelDefinition) => defineCollection(nosqwalInstance, type, modelDefinition)
    };
}

function defineCollection(nosqwalInstance, type, modelDefinition) {
    const validate = schemaValidator(modelDefinition);
    const collection = nosqwalInstance.defineCollection(type);

    return {
        get: async function (itemId) {
            const item = await collection.get(itemId);
            // validate(item);
            return item;
        },
        create: async function (item) {
            validate(item);

            return await collection.create(item);
        },
        update: async function (item) {
            validate(item);

            return await collection.update(item);
        },
        delete: async function (itemId) {
            await collection.delete(itemId);
        },
        query: async function ({where = {}, limit, offset} = {}) {
            where = Object.keys(where).reduce((prev, key) => {
                let value = where[key];

                if (Object.prototype.toString.call(value) !== '[object Object]') {
                    value = {$eq: value};
                }

                return {
                    ...prev,
                    [key]: value
                };
            }, {});

            return await collection.query({
                where,
                limit,
                offset
            });
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
