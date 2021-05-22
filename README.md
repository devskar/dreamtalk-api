# DREAMTALK API

Simple twitter-like backend API.

## DEPENDENCIES

It was build with

- TypeScript
- TypeORM
- Express
- pg
- JWT
- bcryptjs
- Joi

[(complete list)](https://github.com/devskar/dreamtalk-api/network/dependencies)

and is using `PostgreSQL` as database.

## ENTITIES

DreamtalkAPI is working with 4 basic entities:

- Dreamer (User)
- Dreams (Posts)
- Comments (on Posts)
- Replies (to comments)

## EXAMPLE JSON OBJECTS (PUBLIC)

### Dreamer

```json
{
  "id": "63daa685-0791-4370-8bea-fa8d1cfad4b3",
  "dateJoined": "2021-05-17T19:17:13.242Z",
  "username": "oskar",
  "nickname": "oskar"
}
```

### Dream

```json
{
  "id": "60d660df-2edb-4985-bcce-09fc12b7a633",
  "dateCreated": "2021-05-22T22:28:44.604Z",
  "dateEdited": "2021-05-22T22:28:44.604Z",
  "title": "example dream",
  "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam egestas arcu gravida dui imperdiet egestas. Mauris euismod sollicitudin turpis, sit.",
  "author": {
    "id": "c34b180b-16ff-4274-ab85-e8d32b28e712",
    "dateJoined": "2021-05-22T22:26:36.181Z",
    "username": "devskar",
    "nickname": "devskar"
  }
}
```

### Comment

```json
{
  "message": "Successfully added comment.",
  "comment": {
    "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam egestas arcu gravida dui imperdiet egestas. Mauris euismod sollicitudin turpis, sit.",
    "author": {
      "id": "c34b180b-16ff-4274-ab85-e8d32b28e712",
      "dateJoined": "2021-05-22T22:26:36.181Z",
      "username": "devskar",
      "nickname": "devskar"
    },
    "dream": {
      "id": "60d660df-2edb-4985-bcce-09fc12b7a633",
      "dateCreated": "2021-05-22T22:28:44.604Z",
      "dateEdited": "2021-05-22T22:28:44.604Z",
      "title": "example dream",
      "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam egestas arcu gravida dui imperdiet egestas. Mauris euismod sollicitudin turpis, sit."
    },
    "id": "4a1f4231-810f-4e20-9432-63d89164bf5d",
    "dateCreated": "2021-05-22T22:29:56.066Z",
    "dateEdited": "2021-05-22T22:29:56.066Z"
  }
}
```

### Replies

```json
{
  "id": "a8d533db-fd61-4f94-957a-814af38901a1",
  "dateCreated": "2021-05-22T22:36:22.186Z",
  "dateEdited": "2021-05-22T22:36:22.186Z",
  "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam egestas arcu gravida dui imperdiet egestas. Mauris euismod sollicitudin turpis, sit.",
  "author": {
    "id": "c34b180b-16ff-4274-ab85-e8d32b28e712",
    "dateJoined": "2021-05-22T22:26:36.181Z",
    "username": "devskar",
    "nickname": "devskar"
  },
  "parent": {
    "id": "4a1f4231-810f-4e20-9432-63d89164bf5d",
    "dateCreated": "2021-05-22T22:29:56.066Z",
    "dateEdited": "2021-05-22T22:29:56.066Z",
    "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam egestas arcu gravida dui imperdiet egestas. Mauris euismod sollicitudin turpis, sit.",
    "dream": {
      "id": "60d660df-2edb-4985-bcce-09fc12b7a633",
      "dateCreated": "2021-05-22T22:28:44.604Z",
      "dateEdited": "2021-05-22T22:28:44.604Z",
      "title": "example dream",
      "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam egestas arcu gravida dui imperdiet egestas. Mauris euismod sollicitudin turpis, sit."
    }
  }
}
```

## API ENDPOINTS

### Dreamer endpoints

| Endpoint                       | Function                                  |
| ------------------------------ | ----------------------------------------- |
| POST dreamer/signup            | lets the user signup                      |
| POST dreamer/login             | lets the user login                       |
| POST dreamer/logout            | lets the user logout                      |
| GET /dreamer/me                | gets the currently logged in user         |
| GET /dreamer                   | gets all existing dreamer                 |
| GET /dreamer/`username`        | gets the user with the specified username |
| GET /dreamer/`username`/dreams | gets all dreams by the specified user     |
| \*\*PUT /dreamer/`username`    | updates the specified user                |
| \*\*DELETE /dreamer/`username` | deletes the specified user                |

### Dream endpoints

| Endpoint                     | Function                                     |
| ---------------------------- | -------------------------------------------- |
| \*POST /dreams/create        | lets a user post a dream                     |
| GET /dreams                  | gets all existing dreams                     |
| GET /dreams/`id`             | gets the dream with the specified id         |
| GET /dreams/`id`/comments    | gets all the comments to the specified dream |
| \*POST /dreams/`id`/comments | post a comment to the specified dream        |
| \*\*PUT /dreams/`id`         | updates the specified dream                  |
| \*\*DELETE /dreams/`id`      | deletes the specified dream                  |

### Comment endpoints

| Endpoint                      | Function                                      |
| ----------------------------- | --------------------------------------------- |
| GET /comments                 | gets all existing comments                    |
| GET /comments/`id`            | gets the comment with the specified id        |
| GET /comments/`id`/replies    | gets all the replies to the specified comment |
| \*POST /comments/`id`/replies | post a reply to the specified comment         |
| \*\*PUT /comments/`id`        | updates the specified comment                 |
| \*\*DELETE /comments/`id`     | deletes the specified comment                 |

### Reply endpoints

| Endpoint               | Function                             |
| ---------------------- | ------------------------------------ |
| GET /replies           | gets all existing replies            |
| GET /replies/`id`      | gets the reply with the specified id |
| \*\*PUT /reply/`id`    | updates the specified reply          |
| \*\*DELETE /reply/`id` | deletes the specified reply          |

\* -> Route is only accessible to logged in users.
\*\* -> Route is only accessible for the specific author/user or an account with staff role.
