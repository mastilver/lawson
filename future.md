### This is not implemted yet

```js
import user from './models/user';
import post from './models/post';

function createPost(userId, content){
    const addPostToUser = post.addTo('user', userId, 'posts');

    post.create({
        content: content
    })
    .then(createdPost => {
        return addPostToUser(createdPost.id);
    })
    .then(() => {
        return user.get(userId, {
            populate: 'posts'
        });

        /*  OR  */

        return user.get(userId, {
            populate: {
                field: 'posts',
                where: {
                    /* ... */
                }
            }
        });
    })
    .then(user => {
        console.log(user.posts.length);
        // => 1
    });
}
```
