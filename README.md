![logo](https://user-images.githubusercontent.com/44912347/202296600-c5f247d6-9616-49db-88f0-38433429d781.jpg)

# Social Sequelize

You have created a brand new social media network called Social Sequelize. The front end of the application has been created, but we have no way of saving user data so that their information can persist when they come to the page.

**GOAL**: Construct a database that does the following:

- Connect to sequelize
- Create four models `User`, `Post`, `Comment`, and `Like`
- Define appropriate associations between the models
- Create unit tests to ensure connection works, models function properly, and association are set up correctly.

## Tasks

1. In `db/connection.js`, create a sequelize connection to a database.
2. In `models/User.js`, define a `User` model with the following properties:
   - `username`: A string
   - `email`: A string
3. In `models/Profile.js`, create a `Profile` model with the following properties:
   - `bio`: A string
   - `profilePicture`: A string
   - `birthday`: A date formatted as a string
4. In `models/Post.js`, create a `Post` model with the following properties:
   - `title`: A string
   - `body`: A string
   - `createdAt`: A date formatted as a string
5. In `models/Comment.js`, create a `Comment`
   - `body`: A string
   - `createdAt`: A date formatted as a string
6. In `models/Like.js`, create a `Like` model with the following properties:
   - `reactionType`: A string
   - `createdAt`: A date formatted as a string
7. In `index.js`, define the following associations:
   - A `User` can have one `Profile` and vice versa.
   - A `User` can have many `Post` instances, but a `Post` can only have one `User`.
   - A `Post` can have many `Comment` instances, but a `Comment` can only have one `Post`.
   - A `User` can have many `Like` instances and vice versa.
8. Write unit tests to ensure that the connection works and the associations are set up correctly.
   - Seed data has been created in the `seed` directory. Feel free to use this in your test creation!
