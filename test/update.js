import test from 'ava';
import pify from 'pify';

import {bucket} from './fixtures/orm';

import user from './fixtures/models/user';

test('update an item', async t => {
    const {id} = await user.create({
        username: 'user',
        password: 'pass',
        email: 'test@test.com'
    });

    const updatedUser = await user.update(id, {
        username: 'user-updated',
        password: 'pass-updated',
        email: 'test-updated@test.com'
    });

    t.is(id, updatedUser.id);
    t.is('user', updatedUser.type);
    t.is(updatedUser.username, 'user-updated');
    t.is(updatedUser.password, 'pass-updated');
    t.is(updatedUser.email, 'test-updated@test.com');
});

test('should not change original object', async t => {
    const {id} = await user.create({
        username: 'user',
        password: 'pass',
        email: 'test@test.com'
    });

    const originalObject = {
        username: 'user',
        password: 'pass',
        email: 'test@test.com'
    };

    await user.update(id, originalObject);

    t.is(3, Object.keys(originalObject).length);
});

test('should be inserted in the database', async t => {
    const {id} = await user.create({
        username: 'user',
        password: 'pass',
        email: 'test@test.com'
    });

    await user.update(id, {
        username: 'user-updated',
        password: 'pass-updated',
        email: 'test-updated@test.com'
    });

    const {value: updatedUser} = await pify(bucket.get.bind(bucket))(id);

    t.is(id, updatedUser.id);
    t.is('user-updated', updatedUser.username);
    t.is('pass-updated', updatedUser.password);
    t.is('test-updated@test.com', updatedUser.email);
    t.is('user', updatedUser.type);
});
