const db = require('../models');
const Handler = require('./handler');

const HandlerInstance = new Handler(db);

module.exports = {
  Query: {
    users: () => HandlerInstance.getAllUsers(),
    user: (root, { email }) => HandlerInstance.getUserByEmail(email),
    me: (root, args, ctx) => HandlerInstance.getUserById(ctx),
    companies: () => HandlerInstance.getAllCompanies(),
  },
  Mutation: {
    addUser: (root, args) => HandlerInstance.addUser(args),
    updateUser: (root, args) => HandlerInstance.updateUser(args),
    deleteUser: (root, args) => HandlerInstance.deleteUser(args),
  },
};
