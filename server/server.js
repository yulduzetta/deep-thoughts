const express = require("express");
const db = require("./config/connection");
const path = require("path");

// import ApolloServer
const { ApolloServer } = require("apollo-server-express");

// import typeDefinitions and resolvers
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleWare } = require("./utils/auth");

const PORT = process.env.PORT || 3001;
const app = express();

// create a new Apollo server and pass in schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,

  // By default, the headers aren't available to a resolver.
  // Even though you can add a third parameter, commonly called context, to the method—e.g.,
  // (parent, args, context)—you must define what that context is.
  // This would see the incoming request and return only the headers.
  // On the resolver side, those headers would become the context parameter.
  // context: ({ req }) => req.headers,

  // This ensures that every request performs an authentication check, and the updated request object will be passed to the resolvers as the context.
  context: authMiddleWare,
});

// integrate our Apollo server with the Express application as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// We just added two important pieces of code that will only come into effect when we go into production.

// Serve up static assets
// we check to see if the Node environment is in production.
// If it is, we instruct the Express.js server to serve any files in the React application's build directory in the client folder.
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// wildcard GET route for the server.
// In other words, if we make a GET request to any location on the server that doesn't have an explicit route defined,
// respond with the production-ready React front-end code.
app.get("*", (req, res) => {
  res.sendFilePath(path.join(__dirname, "../client/build/index.html"));
});

// any route that hasn't been defined would be treated as a 404 and respond with your custom 404.html file.
app.get("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "./public/404.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
