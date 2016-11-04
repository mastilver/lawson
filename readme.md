# lawson [![Build Status](https://travis-ci.org/mastilver/lawson.svg?branch=master)](https://travis-ci.org/mastilver/lawson)

> Yet another [Couchbase](http://www.couchbase.com/) Odm


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

export default model('user', {
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
    return user.query({
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

### lawsonInstance = lawson(couchbaseBucket)

Create a new instance of lawson

#### couchbaseBucket

Type: `Bucket`  
*required*

The bucket the library is storing documents

### model = lawsonInstance.defineModel(modelName, modelDefinition)

Define a new model

#### modelName

Type: `string`  
*required*

the type of the document

#### modelDefinition

Type: `object`
*required*

The schema of the document, see its definition [here](https://github.com/mastilver/db-schema-validator#schema-definition)

### model.get(documentId)

Returns a Promise, that resolve to the requested document

#### documentId

Type: `string`  
*required*

### model.update(documentId, document)

Returns a Promise, that resolve when the document is updated

#### documentId

Type: `string`
*required*

the id of the document to update

#### document

Type: `object`
*required*

the new version of the document that will be updated

### model.create(document)

Returns a Promise, that resolve to the created document

#### document

Type: `object`
*required*

The document that will be created

### model.delete(documentId)

Returns a Promise when the document is deleted

#### documentId

Type: `string`
*required*

The id of the document that will be deleted

### model.query(options)

Returns a Promise, that resolve to all the documents

#### options.where

Type: `object`

Used to filter out results of the query

#### options.limit

Type: `number`

The number of documents to return

#### options.offset

Type: `number`  
default: 0

The number of documents to skip

### model.first(where)

Like query(), but return a promise for only one document

#### where

Type: `object`

Used to filter out results of the query

### model.single(where)

Like first(), but throws an error if there is more that one document that matches the where clause

#### where

Type: `object`

Used to filter out results of the query


## Difference between lawson and [ottoman](https://github.com/couchbaselabs/node-ottoman)

|                       | Lawson        | Ottoman       |
| :-------------------- | :-----------: | :-----------: |
| Mock-able             |      Yes      |      No       |
| Use N1-Ql (faster)    |      No       |      Yes      |


## License

MIT © [Thomas Sileghem](http://mastilver.com)
