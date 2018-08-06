const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Companies = sequelize.define(
    'companies', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: Sequelize.STRING,
    },
    {
      tableNme: 'companies',
      underscored: true,
    },
  );
  return Companies;
};
