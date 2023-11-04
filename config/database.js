const Sequelize = require('sequelize');
require('dotenv').config()
//DB                //username              //password
module.exports = new Sequelize(process.env.database, process.env.database, process.env.password, {
    host: 'localhost',
    port: 4900,
    dialect: 'postgres',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});