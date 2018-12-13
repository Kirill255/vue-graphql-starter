require("dotenv").config();

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");

const resolvers = require("./resolvers");

const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const User = require("./models/User");
const Post = require("./models/Post");

mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE
})
  .then(() => console.log("DB connected!"))
  .catch((err) => console.log("DB error connection: ", err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    User,
    Post
  }
});

// default port 4000
server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});

// query example
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
