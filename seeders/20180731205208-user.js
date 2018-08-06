module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      email: 'user1@graphql.com',
      age: '28',
      companyid: '1',
      created_at: Sequelize.literal('NOW()'),
      updated_at: Sequelize.literal('NOW()'),
    },
    {
      email: 'user2@graphql.com',
      age: '34',
      companyid: '1',
      created_at: Sequelize.literal('NOW()'),
      updated_at: Sequelize.literal('NOW()'),
    },
    {
      email: 'user3@graphql.com',
      age: '42',
      companyid: '1',
      created_at: Sequelize.literal('NOW()'),
      updated_at: Sequelize.literal('NOW()'),
    },
    {
      email: 'user4@graphql.com',
      age: '22',
      companyid: '2',
      created_at: Sequelize.literal('NOW()'),
      updated_at: Sequelize.literal('NOW()'),
    },
    {
      email: 'user5@graphql.com',
      age: '26',
      companyid: '2',
      created_at: Sequelize.literal('NOW()'),
      updated_at: Sequelize.literal('NOW()'),
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
