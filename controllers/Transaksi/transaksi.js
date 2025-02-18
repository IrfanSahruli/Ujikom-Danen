const { Op } = require('sequelize');
const Produk = require('../../models/Produk/produk');
const Transaksi = require('../../models/Transaksi/transaksi');
const TransaksiProduk = require('../../models/Transaksi/transaksiProduk');
const User = require('../../models/User/user');
const db = require('../../config/db');

const createTransaksi = async (req, res) => {
    const t = await db.transaction();
    try {
        const { produk } = req.body;
        const userId = req.user.id;
        const username = req.user.username;

        if (!produk || !Array.isArray(produk) || produk.length === 0) {
            return res.status(400).json({ message: 'Produk tidak boleh kosong' });
        }

        let totalSubTotal = 0;
        const transaksiProdukData = [];

        for (const item of produk) {
            const { idProduk, jumlah } = item;
            const produkData = await Produk.findByPk(idProduk);
            if (!produkData) {
                return res.status(404).json({ message: `Produk dengan id ${idProduk} tidak ditemukan` });
            }
            if (produkData.stokProduk < jumlah) {
                return res.status(400).json({ message: `Stok produk dengan id ${idProduk} tidak mencukupi` });
            }

            const subTotal = produkData.hargaProduk * jumlah;
            totalSubTotal += subTotal;

            transaksiProdukData.push({
                produkId: idProduk,
                jumlah,
                subTotal
            });
        }

        const tanggalTransaksi = new Date();

        const transaksi = await Transaksi.create(
            {
                userId,
                tanggalTransaksi,
                subTotal: totalSubTotal,
                totalBayar: null,
                kembalian: null
            },
            { transaction: t }
        );

        for (const item of transaksiProdukData) {
            await TransaksiProduk.create(
                {
                    transaksiId: transaksi.id,
                    produkId: item.produkId,
                    jumlah: item.jumlah,
                    subTotal: item.subTotal
                },
                { transaction: t }
            );

            const produkData = await Produk.findByPk(item.produkId);
            await produkData.update(
                { stokProduk: produkData.stokProduk - item.jumlah },
                { transaction: t }
            );
        }

        await t.commit();
        return res.status(201).json({
            id: transaksi.id,
            userId: transaksi.userId,
            username,
            tanggalTransaksi: transaksi.tanggalTransaksi,
            subTotal: transaksi.subTotal,
            produk: transaksiProdukData
        });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ message: error.message });
    }
};

const updatePembayaran = async (req, res) => {
    const { id } = req.params;
    const { totalBayar } = req.body;

    try {
        const transaksi = await Transaksi.findByPk(id);
        if (!transaksi) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        if (totalBayar < transaksi.subTotal) {
            return res.status(400).json({ message: 'Total bayar tidak boleh kurang dari subTotal' });
        }

        const kembalian = totalBayar - transaksi.subTotal;

        await transaksi.update({
            totalBayar,
            kembalian
        });

        return res.status(200).json({
            id: transaksi.id,
            userId: transaksi.userId,
            tanggalTransaksi: transaksi.tanggalTransaksi,
            subTotal: transaksi.subTotal,
            totalBayar,
            kembalian
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllTransaksi = async (req, res) => {
    try {
        const transaksiList = await Transaksi.findAll({
            include: [
                {
                    model: TransaksiProduk,
                    include: [{ model: Produk, attributes: ['id', 'namaProduk', 'hargaProduk'] }]
                },
                { model: User, attributes: ['id', 'username'] }
            ]
        });
        return res.status(200).json(transaksiList);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getTransaksiById = async (req, res) => {
    const { id } = req.params;
    try {
        const transaksi = await Transaksi.findOne({
            where: { id },
            include: [
                {
                    model: TransaksiProduk,
                    include: [{ model: Produk, attributes: ['id', 'namaProduk', 'hargaProduk'] }]
                },
                { model: User, attributes: ['id', 'username'] }
            ]
        });
        if (!transaksi) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }
        res.status(200).json(transaksi);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getRiwayatTransaksi = async (req, res) => {
    const { filter } = req.params;
    let whereClause = {};

    if (/^\d{4}-\d{2}-\d{2}$/.test(filter)) {
        whereClause.tanggalTransaksi = filter;
    } else if (/^\d{4}-\d{2}$/.test(filter)) {
        whereClause.tanggalTransaksi = {
            [Op.gte]: new Date(`${filter}-01`),
            [Op.lt]: new Date(`${filter}-31`)
        };
    } else if (/^\d{4}$/.test(filter)) {
        whereClause.tanggalTransaksi = {
            [Op.gte]: new Date(`${filter}-01-01`),
            [Op.lt]: new Date(`${parseInt(filter) + 1}-01-01`)
        };
    } else {
        return res.status(400).json({ message: 'Format filter tidak valid' });
    }

    try {
        const transaksiList = await Transaksi.findAll({
            where: whereClause,
            include: [
                {
                    model: TransaksiProduk,
                    include: [{ model: Produk, attributes: ['id', 'namaProduk', 'hargaProduk'] }]
                },
                { model: User, attributes: ['id', 'username'] }
            ]
        });

        return res.status(200).json({
            jumlahTransaksi: transaksiList.length,
            transaksi: transaksiList
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getTransaksiByFilter = async (req, res) => {
    const { filter } = req.params;
    let whereClause = {};
    const today = new Date();

    if (filter === 'perhari') {
        whereClause.tanggalTransaksi = {
            [Op.gte]: new Date(today.setHours(0, 0, 0, 0)),
            [Op.lt]: new Date(today.setHours(23, 59, 59, 999))
        };
    } else if (filter === 'perbulan') {
        whereClause.tanggalTransaksi = {
            [Op.gte]: new Date(today.getFullYear(), today.getMonth(), 1),
            [Op.lt]: new Date(today.getFullYear(), today.getMonth() + 1, 1)
        };
    } else if (filter === 'pertahun') {
        whereClause.tanggalTransaksi = {
            [Op.gte]: new Date(today.getFullYear(), 0, 1),
            [Op.lt]: new Date(today.getFullYear() + 1, 0, 1)
        };
    }

    try {
        const transaksiList = await Transaksi.findAll({
            where: whereClause,
            include: [
                {
                    model: TransaksiProduk,
                    include: [{ model: Produk, attributes: ['id', 'namaProduk', 'hargaProduk'] }]
                },
                { model: User, attributes: ['id', 'username'] }
            ]
        });
        return res.status(200).json(transaksiList);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTransaksi,
    updatePembayaran,
    getAllTransaksi,
    getTransaksiById,
    getRiwayatTransaksi,
    getTransaksiByFilter
};
