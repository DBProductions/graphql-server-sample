const mysql = require('mysql');
const Handler = require('./handler');

let HandlerInstance = null;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'graphql',
});
connection.connect();

const dataSql = 'SELECT users.*, companies.id AS cid, companies.name AS compname FROM users LEFT JOIN companies ON users.company = companies.id;';
connection.query(dataSql, (err, results) => {
  if (err) throw err;
  HandlerInstance = new Handler(connection, results);
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
