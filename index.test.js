const { User, Profile, Post, Comment, Like } = require("./index");
const userSeed = require("./seed/users.json");
const profileSeed = require("./seed/profiles.json");
const postSeed = require("./seed/posts.json");
const commentSeed = require("./seed/comments.json");
const likeSeed = require("./seed/likes.json");

const { db } = require("./db/connection.js");

describe("Social Media Models and Associations Test", () => {
  beforeAll(async () => {
    await db.sync({ force: true });
    await User.bulkCreate(userSeed);
    await Profile.bulkCreate(profileSeed);
    await Post.bulkCreate(postSeed);
    await Comment.bulkCreate(commentSeed);
    await Like.bulkCreate(likeSeed);
  });

  describe("User and Profile Associations", () => {
    test("User can have one Profile and Profile belongs to User", async () => {
      const user = await User.findByPk(1);
      const profile = await Profile.findByPk(1);

      await user.createProfile(profile);
      await profile.setUser(user);

      const profileToUser = await user.getProfile();
      const userToProfile = await profile.getUser();
      expect(profileToUser.dataValues).toEqual(
        expect.objectContaining({
          bio: "I'm a software engineer",
          profilePicture: "https://example.com/profile1.jpg",
          birthday: "1990-06-15",
        }),
      );

      expect(userToProfile.dataValues).toEqual(
        expect.objectContaining({
          username: "john_doe",
          email: "john_doe@example.com",
        }),
      );
    });
  });

  describe("User and Post Associations", () => {
    test("User can have many Posts and Post belongs to User", async () => {
      const user = await User.findByPk(1);
      const post = await Post.findByPk(1);
      const postTwo = await Post.findByPk(2);

      //   await user.addPost(post);
      //   await user.addPost(postTwo);

      await post.setUser(user);
      await postTwo.setUser(user);

      const posts = await user.getPosts();
      console.log(posts);
      expect(posts[0].dataValues).toMatchObject({
        title: "Hiking in Yosemite",
        body: "I had an amazing time hiking in Yosemite National Park!",
        createdAt: "2022-03-15T10:30:00.000Z",
      });
      expect(posts[1].dataValues).toMatchObject({
        title: "London Street Photography",
        body: "Here are some of my recent street photography shots from London.",
        createdAt: "2022-03-18T14:15:00.000Z",
      });
    });
  });

  describe("Post and Comment Association", () => {
    test("Should have one to many association between post and comment", async () => {
      const post = await Post.findByPk(1);
      const comment = await Comment.findByPk(1);
      const commentTwo = await Comment.findByPk(2);

      await post.addComment(comment);
      await post.addComment(commentTwo);

      const comments = await post.getComments();
      console.log(comments);
      expect(comments[0].dataValues).toMatchObject({
        body: "This is a great post!",
        createdAt: "2022-01-01T12:00:00Z",
      });
      expect(comments[1].dataValues).toMatchObject({
        body: "I completely agree with you.",
        createdAt: "2022-01-02T08:30:00Z",
      });
    });
  });

  describe("Testing User and Like Associations", () => {
    test("Should have many-to-many user association between User and Like", async () => {
      const user = await User.findByPk(1);
      const userTwo = await User.findByPk(2);

      const like = await Like.findByPk(1);
      const likeTwo = await Like.findByPk(2);

      await user.addLike(like);
      await user.addLike(likeTwo);

      await like.addUser(userTwo);
      await likeTwo.addUser(userTwo);

      const likeUsers = await like.getUsers();
      const userLikes = await user.getLikes();

      expect(userLikes[0].dataValues).toMatchObject({
        reactionType: "👍",
      });

      expect(userLikes[1].dataValues).toMatchObject({
        reactionType: "❤️",
      });

      expect(likeUsers[0].dataValues).toMatchObject({
        username: "john_doe",
        email: "john_doe@example.com",
      });
    });

    expect(likeUsers[1].dataValues).toMatchObject({
      username: "jane_doe",
      email: "jane_doe@example.com",
    });
  });
});
