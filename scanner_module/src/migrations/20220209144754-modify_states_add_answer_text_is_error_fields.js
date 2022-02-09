'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          'website_states',
          'answer_text',
          {
            type: Sequelize.STRING,
            after: 'answer_code',
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'website_states',
          'is_error',
          {
            type: Sequelize.BOOLEAN,
            after: 'answer_time',
            allowNull: false,
            defaultValue: false,
          },
          { transaction: t },
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('website_states', 'answer_text', { transaction: t }),
        queryInterface.removeColumn('website_states', 'is_error', { transaction: t }),
      ]);
    });
  },
};
