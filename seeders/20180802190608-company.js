module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('companies', [{
      name: 'Company A',
      created_at: Sequelize.literal('NOW()'),
      updated_at: Sequelize.literal('NOW()'),
    },
    {
      name: 'Company B',
      created_at: Sequelize.literal('NOW()'),
      updated_at: Sequelize.literal('NOW()'),
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('companies', null, {});
  },
};
