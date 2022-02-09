'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn('websites', 'is_hidden', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn('websites', 'is_hidden');
  },
};
