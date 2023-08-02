'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addColumn('Users', 'ticker_value', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        })
    },

    async down(queryInterface, Sequelize) {
        queryInterface.removeColumn('Users', 'ticker_value')
    },
}
