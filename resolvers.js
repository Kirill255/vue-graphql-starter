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
    getUserPosts: async (_, { userId }, { Post }) => {
      const posts = await Post.find({ createdBy: userId });

      return posts;
    },
    searchPosts: async (_, { searchTerm }, { Post }) => {
      if (searchTerm) {
        const searchResult = await Post.find(
          // perform text search for search value of "searchTerm"
          { $text: { $search: searchTerm } },
          // assign "searchTerm" a text score to provide best match
          { score: { $meta: "textScore" } }
          // sort results according to that textScore (as well as by likes in descending order)
        )
          .sort({
            score: { $meta: "textScore" },
            likes: "desc"
          })
          .limit(5);

        return searchResult;
      }
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
    updateUserPost: async (
      _,
      { postId, userId, title, imageUrl, categories, description },
      { Post }
    ) => {
      const post = await Post.findOneAndUpdate(
        { _id: postId, createdBy: userId },
        { $set: { title, imageUrl, categories, description } },
        { new: true }
      );

      return post;
    },
    deleteUserPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOneAndRemove({ _id: postId });

      return post;
    },
    addPostMessage: async (_, { messageBody, userId, postId }, { Post }) => {
      const newMessage = {
        messageBody,
        messageUser: userId
      };

      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { messages: { $each: [newMessage], $position: 0 } } },
        { new: true }
      ).populate({
        path: "messages.messageUser", // property
        model: "User" // ref in property
      });

      return post.messages[0];
    },
    likePost: async (_, { postId, username }, { Post, User }) => {
      // find post and add +1 to it's "like" value
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1 } },
        { new: true }
      );
      // find user and add id of post to it's favorites array (witch will be populated as Posts)
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: postId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Post"
      });
      // return only likes from "post" and favorites from "user"
      return { likes: post.likes, favorites: user.favorites };
    },
    // does the opposite of above, inc with -1 and pull instead of addToSet
    unlikePost: async (_, { postId, username }, { Post, User }) => {
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: postId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Post"
      });
      return { likes: post.likes, favorites: user.favorites };
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
