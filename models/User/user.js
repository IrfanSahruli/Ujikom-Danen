const { DataTypes } = require('sequelize');
const db = require('../../config/db');

const User = db.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    noHp: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('kasir', 'admin'),
        allowNull: true
    }
}, {
    freezeTableName: true
});

module.exports = User;
