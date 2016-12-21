# lawson [![Build Status](https://travis-ci.org/mastilver/lawson.svg?branch=master)](https://travis-ci.org/mastilver/lawson)

> Database agnostic ODM


## Install

```
$ npm install --save lawson nosqwal-memory
```


## Setup

`orm.js`
```js
import nosqwal from 'nosqwal-memory';
import lawson from 'lawson';

const noSqwalInstance = noSqwal();

export const collection = lawson(noSqwalInstance).defineCollection;
```

`models/user.js`
```js
import {collection} from '../orm';

export default collection('user', {
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

### lawsonInstance = lawson(noSqwalInstance)

Create a new instance of lawson

#### noSqwalInstance

Type: [Nosqwal instance](https://github.com/mastilver/nosqwal)  
*required*

### collection = lawsonInstance.defineCollection(collectionName, modelDefinition)

Define a new collection

#### collectionName

Type: `string`  
*required*

the name of the collection

#### modelDefinition

Type: `object`
*required*

The schema of the document, see its definition [here](https://github.com/mastilver/db-schema-validator#schema-definition)

### collection.get(documentId)

Returns a Promise, that resolve to the requested document

#### documentId

Type: `string`  
*required*

### collection.update(document)

Returns a Promise, that resolve when the document is updated

#### document

Type: `object`
*required*

the new version of the document that will be updated

##### document.id

Type: `string`
*required*

the id of the document to update

### collection.create(document)

Returns a Promise, that resolve to the created document

#### document

Type: `object`
*required*

The document that will be created

### collection.delete(documentId)

Returns a Promise when the document is deleted

#### documentId

Type: `string`
*required*

The id of the document that will be deleted

### collection.query(options)

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

### collection.first(where)

Like query(), but return a promise for only one document

#### where

Type: `object`

Used to filter out results of the query

### collection.single(where)

Like first(), but throws an error if there is more that one document that matches the where clause

#### where

Type: `object`

Used to filter out results of the query

## License

MIT © [Thomas Sileghem](http://mastilver.com)
