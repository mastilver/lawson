import {collection} from '../orm';

export default collection('user', {
    username: 'string',
    email: 'string',
    password: 'string',
    nbFollowers: 'number?'
});
