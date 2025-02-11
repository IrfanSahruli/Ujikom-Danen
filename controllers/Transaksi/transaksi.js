const Produk = require('../../models/Produk/produk');
const Transaksi = require('../../models/Transaksi/transaksi');
const TransaksiProduk = require('../../models/Transaksi/transaksiProduk');
const User = require('../../models/User/user');
const db = require('../../config/db'); // Pastikan ini adalah konfigurasi database Anda

const createTransaksi = async (req, res) => {
    const t = await db.transaction(); // Menggunakan transaksi database
    try {
        const { produk } = req.body;
        const userId = req.user.id;
        const username = req.user.username;

        if (!produk || !Array.isArray(produk) || produk.length === 0) {
            return res.status(400).json({ message: 'Produk tidak boleh kosong' });
        }

        let totalPembayaran = 0;
        const transaksiProdukData = [];

        // Validasi produk dan hitung total pembayaran
        for (const item of produk) {
            const { idProduk, jumlah } = item;

            const produkData = await Produk.findByPk(idProduk);
            if (!produkData) {
                return res.status(404).json({ message: `Produk dengan id ${idProduk} tidak ditemukan` });
            }

            if (produkData.stokProduk < jumlah) {
                return res.status(404).json({ message: `Stok produk dengan id ${idProduk} tidak mencukupi` });
            }

            const subTotal = produkData.hargaProduk * jumlah;
            totalPembayaran += subTotal;

            transaksiProdukData.push({
                produkId: idProduk,
                jumlah,
                subTotal
            });
        }

        // Simpan transaksi
        const transaksi = await Transaksi.create(
            {
                userId,
                totalPembayaran
            },
            { transaction: t }
        );

        // Simpan detail transaksi produk dan update stok
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

        // Ambil detail transaksi
        const transaksiDetail = {
            id: transaksi.id,
            userId: transaksi.userId,
            username,
            totalPembayaran: transaksi.totalPembayaran,
            produk: transaksiProdukData.map((item) => ({
                idProduk: item.produkId,
                jumlah: item.jumlah,
                subTotal: item.subTotal
            })),
        };

        await t.commit(); // Commit transaksi database

        // Format respons
        return res.status(201).json(transaksiDetail);
    } catch (error) {
        await t.rollback(); // Rollback jika terjadi error
        return res.status(500).json({ message: error.message });
    }
};

const getAllTransaksi = async (req, res) => {
    const userId = req.user.id;
    try {
        const transaksiList = await Transaksi.findAll({
            include: [
                {
                    model: TransaksiProduk,
                    include: [
                        {
                            model: Produk,
                            attributes: ['id', 'namaProduk', 'hargaProduk']
                        }
                    ]
                },
                {
                    model: User,
                    attributes: ['id', 'username']
                }
            ]
        });

        return res.status(201).json(transaksiList);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getTransaksiById = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const transaksi = await Transaksi.findOne({
            where: { id },
            include: [
                {
                    model: TransaksiProduk,
                    include: [
                        {
                            model: Produk,
                            attributes: ['id', 'namaProduk', 'hargaProduk']
                        }
                    ]
                },
                {
                    model: User,
                    attributes: ['id', 'username']
                }
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

module.exports = {
    createTransaksi,
    getAllTransaksi,
    getTransaksiById
};
