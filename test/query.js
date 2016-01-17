import test from 'ava';

import user from './fixtures/models/user';

test.before(async () => {
    await user.create({
        username: 'user-1',
        password: 'secret',
        email: 'user-1@test.com'
    });

    await user.create({
        username: 'user-2',
        password: 'secret',
        email: 'user-2@test.com'
    });
});

test('querying all document', async t => {
    const users = await user.query();

    t.is(2, users.length);

    t.is('user-1', users[0].username);
    t.is('user-2', users[1].username);
});

test('querying using a where clause', async t => {
    const users = await user.query({
        where: {
            username: 'user-1'
        }
    });

    t.is(1, users.length);

    t.is('user-1', users[0].username);
});

test('querying using several where clause', async t => {
    const users = await user.query({
        where: {
            username: 'user-1',
            email: 'user-2@test.com'
        }
    });

    t.is(0, users.length);
});
