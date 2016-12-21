import test from 'ava';

import user from './fixtures/models/user';

test('insert item', async t => {
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
