import test from 'ava';

import user from './fixtures/models/user';

test.before(async () => {
    for (let i = 0, len = 100; i < len; i++) {
        await user.create({
            username: `user-${ i }`,
            password: 'secret',
            email: `user-${ i }@test.com`
        });
    }
});

test('query first 10 documents', async t => {
    const users = await user.query({
        limit: 10
    });

    t.is(10, users.length);

    t.is('user-0', users[0].username);
    t.is('user-9', users[9].username);
});

test('query 20 documents skiping the first 10', async t => {
    const users = await user.query({
        limit: 20,
        offset: 10
    });

    t.is(20, users.length);

    t.is('user-10', users[0].username);
    t.is('user-29', users[19].username);
});

test('skipping more documents than there is', async t => {
    const users = await user.query({
        limit: 10,
        offset: 100
    });

    t.is(0, users.length);
});
