const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'user', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      email: Sequelize.STRING,
      age: Sequelize.STRING,
      companyid: Sequelize.INTEGER,
    },
    {
      tableNme: 'users',
      underscored: true,
    },
  );
  return User;
};
