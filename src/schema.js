const fs = require('fs');
const path = require('path');
const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const schemaFile = path.join(`${process.cwd()}/config/schema.graphql`);
const typeDefs = fs.readFileSync(schemaFile, 'utf8');
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  printErrors: true,
  allowUndefinedInResolve: false,
  resolverValidationOptions: {},
});

module.exports = {
  schema,
};
