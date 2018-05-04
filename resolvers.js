const Sequelize = require('sequelize');
const Handler = require('./handler');

let HandlerInstance = null;

const sequelize = new Sequelize('graphql', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
  logging: false,
});

const dataSql = 'SELECT users.*, companies.id AS cid, companies.name AS compname FROM users LEFT JOIN companies ON users.company = companies.id;';
sequelize.query(dataSql, { type: sequelize.QueryTypes.SELECT }).then((results) => {
  HandlerInstance = new Handler(sequelize, results);
});

module.exports = {
  Query: {
    users: () => HandlerInstance.getAllUsers(),
    user: (root, { email }) => HandlerInstance.getUserByEmail(email),
    me: (root, args, ctx) => HandlerInstance.getUserById(ctx.req.tokenId),
    company: () => {},
  },
  Mutation: {
    addUser: (root, args) => HandlerInstance.addUser(args),
    updateUser: (root, args) => HandlerInstance.updateUser(args),
    deleteUser: (root, args) => HandlerInstance.deleteUser(args),
  },
};
