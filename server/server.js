const express = require('express');
const path = require('path');

//import Apollo server 
const{ ApolloServer } = require('apollo-server-express');
//Import typeDefs and reesolvers
const {typeDefs, resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth');

//db connection
const db = require('./config/connection');
const routes = require('./routes');

//express server
const app = express();
const PORT = process.env.PORT || 3001;

//apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:authMiddleware
});

server.applyMiddleware({app});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

//Get 
app.get('*', (req, res) => {
  res.sendFile(path.join(_dirname, '../client/public/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 API listening on localhost:${PORT}!`);
    console.log('Use GraphQL @ http://localhost:${PORT}$(server.graphqlPath}');
  });
});
