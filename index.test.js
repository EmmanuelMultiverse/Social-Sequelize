const { User, Profile, Post, Comment, Like } = require("./index");
const userSeed = require("./seed/users.json");
const profileSeed = require("./seed/profiles.json");
const postSeed = require("./seed/posts.json");
const commentSeed = require("./seed/comments.json");
const likeSeed = require("./seed/likes.json");

const { db } = require('./db/connection.js');

describe('Social Media Models and Associations Test', () => {
  beforeAll(async () => {
    await db.sync({ force: true });
    await User.bulkCreate(userSeed);
    await Profile.bulkCreate(profileSeed);
    await Post.bulkCreate(postSeed);
    await Comment.bulkCreate(commentSeed);
    await Like.bulkCreate(likeSeed);
  });

  describe('User and Profile Associations', () => {
    test('User can have one Profile and Profile belongs to User', async () => {
      const user = await User.findByPk(1);
      const profile = await Profile.findByPk(1);

      await user.createProfile(profile);
      await profile.setUser(user);

      const profileToUser = await user.getProfile();
      console.log(profileToUser.dataValues)
      expect(profileToUser.dataValues).toEqual(expect.objectContaining({
      "bio": "I'm a software engineer",
      "profilePicture": "https://example.com/profile1.jpg",
      "birthday": "1990-06-15"
    }));
    });
  });

  describe('User and Post Associations', () => {
    test('User can have many Posts and Post belongs to User', async () => {
      const user = await User.findOne({ where: { name: userSeed[1].name } });
      const posts = await Post.findAll({ where: { userId: user.id } });

      expect(user).toBeDefined();
      expect(posts.length).toBeGreaterThan(0);
      posts.forEach(post => {
        expect(post.userId).toBe(user.id);
      });

      const userPosts = await user.getPosts();
      expect(userPosts.length).toBe(posts.length);
      userPosts.forEach((post, index) => {
        expect(post).toEqual(expect.objectContaining({
          title: postSeed[index].title,
          content: postSeed[index].content,
          userId: user.id,
        }));
      });

      const postUser = await Post.findOne({ where: { title: postSeed[0].title } });
      const author = await postUser.getUser();
      expect(author).toEqual(expect.objectContaining({
        name: userSeed[1].name,
        password: userSeed[1].password,
      }));
    });
  });

  describe('Post and Comment Associations', () => {
    test('Post can have many Comments and Comment belongs to Post', async () => {
      const post = await Post.findOne({ where: { title: postSeed[0].title } });
      const comments = await Comment.findAll({ where: { postId: post.id } });

      expect(post).toBeDefined();
      expect(comments.length).toBeGreaterThan(0);
      comments.forEach(comment => {
        expect(comment.postId).toBe(post.id);
      });

      const postComments = await post.getComments();
      expect(postComments.length).toBe(comments.length);
      postComments.forEach((comment, index) => {
        expect(comment).toEqual(expect.objectContaining({
          text: commentSeed[index].text,
          postId: post.id,
        }));
      });

      const commentPost = await Comment.findOne({ where: { text: commentSeed[0].text } });
      const parentPost = await commentPost.getPost();
      expect(parentPost).toEqual(expect.objectContaining({
        title: postSeed[0].title,
        content: postSeed[0].content,
      }));
    });
  });

  describe('User and Like Associations (Many-to-Many)', () => {
    test('User can belong to many Likes and Like can belong to many Users', async () => {
      const user1 = await User.findOne({ where: { name: userSeed[0].name } });
      const user2 = await User.findOne({ where: { name: userSeed[1].name } });
      const like1 = await Like.findOne({ where: { name: likeSeed[0].name } });
      const like2 = await Like.findOne({ where: { name: likeSeed[1].name } });

      expect(user1).toBeDefined();
      expect(user2).toBeDefined();
      expect(like1).toBeDefined();
      expect(like2).toBeDefined();

      await user1.addLike(like1);
      await user1.addLike(like2);
      await user2.addLike(like1);

      const user1Likes = await user1.getLikes();
      expect(user1Likes.length).toBe(2);
      expect(user1Likes.some(like => like.name === likeSeed[0].name)).toBe(true);
      expect(user1Likes.some(like => like.name === likeSeed[1].name)).toBe(true);

      const user2Likes = await user2.getLikes();
      expect(user2Likes.length).toBe(1);
      expect(user2Likes.some(like => like.name === likeSeed[0].name)).toBe(true);

      const like1Users = await like1.getUsers();
      expect(like1Users.length).toBe(2);
      expect(like1Users.some(user => user.name === userSeed[0].name)).toBe(true);
      expect(like1Users.some(user => user.name === userSeed[1].name)).toBe(true);

      const like2Users = await like2.getUsers();
      expect(like2Users.length).toBe(1);
      expect(like2Users.some(user => user.name === userSeed[0].name)).toBe(true);
    });
  });
});