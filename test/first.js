import test from 'ava';

import userRepo from './fixtures/models/user';

test.before(async () => {
    await userRepo.create({
        username: 'user-1',
        password: 'secret',
        email: 'user-1@test.com',
        nbFollowers: 4
    });

    await userRepo.create({
        username: 'user-2',
        password: 'secret',
        email: 'user-2@test.com',
        nbFollowers: 2
    });

    await userRepo.create({
        username: 'user-3',
        password: 'secret',
        email: 'user-3@test.com',
        nbFollowers: 4
    });
});

test('when there is only one ducument to match', async t => {
    const user = await userRepo.first({
        username: 'user-1'
    });

    t.is('user-1', user.username);
});

test('when there is no ducument to match', async t => {
    const user = await userRepo.first({
        username: 'user-1',
        email: 'user-2@test.com'
    });

    t.is(user, null);
});

test('when there is several ducuments to match', async t => {
    const user = await userRepo.first({
        nbFollowers: 4
    });

    t.truthy(['user-1', 'user-3'].includes(user.username));
});
