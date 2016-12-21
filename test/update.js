import test from 'ava';

import user from './fixtures/models/user';

test('update an item', async t => {
    const {id} = await user.create({
        username: 'user',
        password: 'pass',
        email: 'test@test.com'
    });

    const updatedUser = await user.update({
        id,
        username: 'user-updated',
        password: 'pass-updated',
        email: 'test-updated@test.com'
    });

    t.is(id, updatedUser.id);
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
        id,
        username: 'user',
        password: 'pass',
        email: 'test@test.com'
    };

    await user.update(originalObject);

    t.is(4, Object.keys(originalObject).length);
});

test('should be inserted in the database', async t => {
    const {id} = await user.create({
        username: 'user',
        password: 'pass',
        email: 'test@test.com'
    });

    await user.update({
        id,
        username: 'user-updated',
        password: 'pass-updated',
        email: 'test-updated@test.com'
    });

    const updatedUser = await user.get(id);

    t.is(id, updatedUser.id);
    t.is('user-updated', updatedUser.username);
    t.is('pass-updated', updatedUser.password);
    t.is('test-updated@test.com', updatedUser.email);
});

test('update an item which doesn\'t match the schema', async t => {
    const {id} = await user.create({
        username: 'user',
        password: 'pass',
        email: 'test@test.com'
    });

    t.throws(user.update({
        id,
        username: 'user-updated'
    }));
});
