const { DataTypes } = require('sequelize');
const db = require('../../config/db');

const Produk = db.define('produk', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    namaProduk: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fotoProduk: {
        type: DataTypes.STRING,
        allowNull: true
    },
    hargaProduk: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    stokProduk: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    kategoriProduk: {
        type: DataTypes.ENUM('makanan', 'minuman'),
        allowNull: true
    }
}, {
    freezeTableName: true
});

module.exports = Produk;
