'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.renameColumn(
            'Users',
            'hashed_password',
            'hashedPassword'
        )
        queryInterface.renameColumn('Users', 'ticker_value', 'tickerValue')
    },

    async down(queryInterface, Sequelize) {
        queryInterface.renameColumn(
            'Users',
            'hashedPassword',
            'hashed_password'
        )
        queryInterface.renameColumn('Users', 'tickerValue', 'ticker_value')
    },
}
