require("dotenv").config();

const fs = require("fs");
const path = require("path");

const jwt = require("jsonwebtoken");

const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");

const resolvers = require("./resolvers");

const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");

const User = require("./models/User");
const Post = require("./models/Post");

mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);

mongoose
  .connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true,
      reconnectTries: Number.MAX_VALUE
    }
  )
  .then(() => console.log("DB connected!"))
  .catch(err => console.log("DB error connection: ", err));

// Verify JWT Token pass from client
const getUser = async token => {
  if (token) {
    try {
      const user = await jwt.verify(token, process.env.SECRET);
      // console.log(user);
      return user;
    } catch (err) {
      console.error(err);
      // throw new Error(err);
      throw new AuthenticationError("Your session has ended. Please sign in again");
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // console.log(req.headers["authorization"]);
    const token = req.headers["authorization"];

    return {
      User,
      Post,
      currentUser: await getUser(token)
    };
  }
});

// default port 4000
server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});

// query example

// query{
//   getPosts {
//     title
//     imageUrl
//     categories
//     description
//     createDate
//     likes
//     createdBy {
//       _id
//       username
//       email
//       password
//       joinDate
//     }
//   }
// }

// mutation example

// mutation{
//   signupUser(username: "John", email: "john@mail.ru", password: "john") {
//     username
//     email
//     password
//     avatar
//     joinDate
//   }
// }

// mutation{
//   addPost(title: "Mona lisa", imageUrl: "google.com", categories: ["Art"], description: "A painting", createdBy: "5c12771f794ec50a188b5b9d") {
//     title
//     imageUrl
//     categories
//     description
//     createDate
//     likes
//   }
// }

// mutation{
//   signinUser(username: "Jack", password: "jack") {
//     _id
//     username
//     email
//     password
//     avatar
//     joinDate
//   }
// }

// mutation{
//   signupUser(username: "Jeff", email: "jeff@mail.ru", password: "jeff") {
//     token
//   }
// }

// mutation{
//   signinUser(username: "Jeff", password: "jeff") {
//     token
//   }
// }
