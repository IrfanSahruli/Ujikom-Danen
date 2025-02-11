const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const db = new Sequelize(process.env.DBNAME, process.env.nama, process.env.DBPASSWORD, {
    host: process.env.DBHOST,
    dialect: 'mysql'
});

module.exports = db;
