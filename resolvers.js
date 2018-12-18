const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (user, secret, expiresIn) => {
  // return jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: expiresIn })
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
  Query: {
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null;
      }

      const user = await User.findOne({ username: currentUser.username }).populate({
        path: "favorites",
        model: "Post"
      });

      return user;
    },
    getPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOne({ _id: postId }).populate({
        path: "messages.messageUser", // property
        model: "User" // ref in property
      });

      return post;
    },
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({})
        .sort({ createDate: "desc" })
        .populate({
          path: "createdBy", // property "createdBy" in PostSchema
          model: "User" // ref in property "createdBy" in PostSchema
        });

      return posts;
    },
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts;

      if (pageNum === 1) {
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .limit(pageSize);
      } else {
        // when we are not on first page, we skip the posts already grabbed
        const skips = pageSize * (pageNum - 1);

        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .skip(skips)
          .limit(pageSize);
      }

      const totalPosts = await Post.countDocuments();
      const hasMore = totalPosts > pageSize * pageNum;

      return { posts, hasMore };
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

      // token
      return { token: createToken(newUser, process.env.SECRET, "1h") };
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

      // token
      return { token: createToken(user, process.env.SECRET, "1h") };
    }
  }
};
