import test from 'ava';
import pify from 'pify';

import {bucket} from './fixtures/orm';

import user from './fixtures/models/user';

test('should delete item', async t => {
    const {id} = await user.create({
        username: 'user',
        password: 'pass',
        email: 'test@test.com'
    });

    await user.delete(id);
    t.throws(pify(bucket.get.bind(bucket))(id));
});
