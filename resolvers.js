const bcrypt = require("bcrypt");

module.exports = {
  Query: {
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({})
        .sort({ createDate: "desc" })
        .populate({
          path: "createdBy", // property "createdBy" in PostSchema
          model: "User" // ref in property "createdBy" in PostSchema
        });

      return posts;
    }
  },
  Mutation: {
    addPost: async (_, { title, imageUrl, categories, description, createdBy }, { Post }) => {
      const newPost = new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy
      });

      await newPost.save();

      return newPost;
    },
    // signupUser: async (root, args, context)
    signupUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });

      if (user) {
        throw new Error("User already exists!");
      }

      const newUser = new User({
        username,
        email,
        password
      });

      await newUser.save();

      return newUser;
    },
    signinUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new Error("User not found!");
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new Error("Invalid username or password!");
      }

      // login
      return user;
    }
  }
};
