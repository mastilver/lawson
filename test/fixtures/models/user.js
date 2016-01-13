import {model} from '../orm';

export default model('user', {
    username: 'string',
    email: 'string',
    password: 'string'
});
