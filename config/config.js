module.exports = {
  develop: {
    username: 'postgres',
    password: 'postgres',
    database: 'graphql',
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
    logging: false,
  },
  test: {
    username: 'postgres',
    password: 'postgres',
    database: 'graphql',
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
    logging: false,
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    dialect: 'postgres',
    operatorsAliases: false,
    logging: false,
  },
};
