const { Comment, Like, Post, Profile, User } = require("./models/index");

User.hasOne(Profile);
Profile.belongsTo(User);

User.hasMany(Post);
Post.belongsTo(User);

Post.hasMany(Comment);
Comment.belongsTo(Post);

User.belongsToMany(Like, { through: "userLike" });
Like.belongsToMany(User, { through: "userLike" });

module.exports = {
  Comment,
  Like,
  Post,
  Profile,
  User,
};
