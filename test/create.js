import test from 'ava';

import user from './fixtures/models/user';

test('create an item', async t => {
    const createdUser = await user.create({
        username: 'user',
        password: 'pass',
        email: 'test@test.com'
    });

    t.is('user', createdUser.username);
    t.is('pass', createdUser.password);
    t.is('test@test.com', createdUser.email);

    t.true(typeof createdUser.id === 'string');
});

test('should not change original object', async t => {
    const originalObject = {
        username: 'user',
        password: 'pass',
        email: 'test@test.com'
    };

    await user.create(originalObject);

    t.is(3, Object.keys(originalObject).length);
});

test('should be inserted in the database', async t => {
    const {id} = await user.create({
        username: 'user',
        password: 'pass',
        email: 'test@test.com'
    });

    const createdUser = await user.get(id);

    t.is(id, createdUser.id);
    t.is('user', createdUser.username);
    t.is('pass', createdUser.password);
    t.is('test@test.com', createdUser.email);
});

test('create an item which doesn\'t match the schema', t => {
    t.throws(user.create({
        username: 'user'
    }), TypeError);
});
