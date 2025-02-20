const { DataTypes } = require("sequelize");
const db = require("../../config/db");
const User = require("../User/user");

const Transaksi = db.define(
  "transaksi",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    tanggalTransaksi: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    subTotal: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalBayar: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    kembalian: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    catatan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

Transaksi.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Transaksi, { foreignKey: "userId" });

module.exports = Transaksi;
