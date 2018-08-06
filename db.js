const config = require('config');
const fp = require('fastify-plugin');
const Sequelize = require('sequelize');

module.exports = fp((fastify, opts, next) => {
  const sequelize = new Sequelize(config.get('db.name'), config.get('db.user'), config.get('db.pass'), {
    host: config.get('db.host'),
    dialect: config.get('db.dialect'),
    logging: config.get('db.logging'),
    operatorsAliases: false,
    define: {
      createdAt: 'createdat',
      updatedAt: 'updatedat',
    },
  });

  // eslint-disable-next-line global-require
  const User = require('./models/user')(sequelize);
  // eslint-disable-next-line global-require
  const Company = require('./models/companies')(sequelize);

  const models = {
    User,
    Company,
  };

  // models.User.belongsTo(models.Company, { foreignKey: 'companyId', targetKey: 'id' });

  fastify.decorate('db', { models });

  next();
});
