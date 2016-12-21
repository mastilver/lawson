import test from 'ava';

import user from './fixtures/models/user';

test('should delete item', async t => {
    const {id} = await user.create({
        username: 'user',
        password: 'pass',
        email: 'test@test.com'
    });

    await user.delete(id);
    await t.throws(user.get(id));
});
