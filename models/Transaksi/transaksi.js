const { DataTypes } = require('sequelize');
const db = require('../../config/db');
const User = require('../User/user');

const Transaksi = db.define('transaksi', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    totalPembayaran: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    freezeTableName: true
});

Transaksi.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Transaksi, { foreignKey: 'userId' });

module.exports = Transaksi;
