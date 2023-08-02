'use strict'
import { Sequelize } from 'sequelize-typescript'
import 'dotenv/config'

import config from './dbConfig'

const env = process.env.NODE_ENV || 'development'

const sequelize = new Sequelize(
    config[env].database,
    config[env].username,
    config[env].password,
    {
        host: config[env].host,
        port: config[env].port,
        dialect: config[env].dialect,
    }
)

sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection successful.')
    })
    .catch(() => {
        console.error('Error connecting to database.')
    })

sequelize.addModels([__dirname + '/models'])

import User from './models/User'

// Connect all the models/tables in the database to a db object,
// so everything is accessible via one object
const db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    users: User,
}

export default db
