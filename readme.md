# lawson [![Build Status](https://travis-ci.org/mastilver/lawson.svg?branch=master)](https://travis-ci.org/mastilver/lawson)

> Yet another [Couchbase](http://www.couchbase.com/) Orm


## Install

```
$ npm install --save lawson
```


## Setup

`orm.js`
```js
import couchbase from 'couchbase';
import lawson from 'lawson';

const cluster = new couchbase.Cluster();
const bucket = cluster.openBucket();

const lawsonInstance = lawson(bucket);

export const model = lawsonInstance.defineModel;
```

`models/user.js`
```js
import {model} from '../orm';

export const default = model('user', {
    username: 'string',
    email: 'string',
    password: 'string'
});
```

## Usage

```js
import user from './models/user';

/*   create   */
user.create({
    username: 'test',
    email: 'test@test.com',
    password: 'secret'
})
/*   get   */
.then(createdUser => {
    return user.get(createdUser.id);
})
/*   update   */
.then(newUser => {
    newUser.username = 'bobby';

    return user.update(newUser.id, newUser);
})
.then(updatedUser => {
    console.log('user updated');
})
.then(() => {
    return user.findAll({
        where: {
            username: 'bobby'
        }
    });
})
.then(users => {
    console.log(user.length);
    // => 1

    return user.delete(users[0].id);
})
.catch(e => {
    console.warn(e);
});
```


## API

### lawson(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`  
Default: `false`

Lorem ipsum.


## License

MIT © [Thomas Sileghem](http://mastilver.com)
