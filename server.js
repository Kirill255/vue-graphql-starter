const { ApolloServer, gql } = require("apollo-server");

const todos = [
  { task: "Wash car", completed: false },
  { task: "Clean room", completed: true }
];

const typeDefs = gql`
  type Todo {
    task: String
    completed: Boolean
  }

  type Query {
    getTodos: [Todo]
  }

  type Mutation {
    addTodo(task: String, completed: Boolean): Todo
  }
`;

const resolvers = {
  Query: {
    getTodos: () => todos
  },
  Mutation: {
    // addTodo: (_, args) => {
    //   const todo = { task: args.task, completed: args.completed };
    //   todos.push(todo);
    //   return todo;
    // }

    // rewrite
    addTodo: (_, { task, completed }) => {
      const todo = { task, completed };
      todos.push(todo);
      return todo;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

// default port 4000
server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});

// change port
// server.listen(4500).then(({ url }) => {
//   console.log(`Server listening on ${url}`);
// });

// -------------------------------------------------
// query example

// query{
//   getTodos{
//     task
//     completed
//   }
// }

// or without keyword query

// {
//   getTodos{
//     task
//     completed
//   }
// }

// mutation example

// mutation{
//   addTodo(task: "Eat lunch", completed: false) {
//     task
//     completed
//   }
// }
