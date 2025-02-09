const { DataTypes } = require('sequelize');
const db = require('../../config/db');
const Produk = require('../Produk/produk');
const Transaksi = require('./transaksi'); // Pastikan ini diimpor sebelum mendefinisikan relasi

// Definisikan TransaksiProduk
const TransaksiProduk = db.define('transaksiproduk', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    transaksiId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Transaksi,
            key: 'id'
        }
    },
    produkId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Produk,
            key: 'id'
        }
    },
    jumlah: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    subTotal: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    freezeTableName: true
});

Produk.hasMany(TransaksiProduk, { foreignKey: 'produkId' });
Transaksi.hasMany(TransaksiProduk, { foreignKey: 'transaksiId' });

TransaksiProduk.belongsTo(Produk, { foreignKey: 'produkId' });
TransaksiProduk.belongsTo(Transaksi, { foreignKey: 'transaksiId' });

Transaksi.belongsToMany(Produk, { through: TransaksiProduk, foreignKey: 'transaksiId' });
Produk.belongsToMany(Transaksi, { through: TransaksiProduk, foreignKey: 'produkId' });

module.exports = TransaksiProduk;
