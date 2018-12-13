module.exports = {
  Query: {
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({}).sort({ createDate: "desc" }).populate({
        path: "createdBy", // property "createdBy" in PostSchema
        model: "User" // ref in property "createdBy" in PostSchema
      });

      return posts;
    }
  },
  Mutation: {
    addPost: async (_, { title, imageUrl, categories, description, createdBy }, { Post }) => {
      const newPost = await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy
      });

      newPost.save();

      return newPost;
    },
    signupUser: async (_, { username, email, password }, { User }) => { // async (root, args, context)
      const user = await User.findOne({ username });

      if (user) {
        throw new Error("User already exists!");
      }

      const newUser = await new User({
        username,
        email,
        password
      });

      newUser.save();

      return newUser;
    }
  }
};
