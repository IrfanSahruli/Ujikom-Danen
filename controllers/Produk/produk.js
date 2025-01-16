const Produk = require('../../models/Produk/produk');

const createProduk = async (req, res) => {
    const fotoProduk = req.file ? `/uploads/${req.file.filename}` : null;
    const {
        namaProduk,
        hargaProduk,
        stokProduk
    } = req.body;

    try {
        const produk = await Produk.create({
            namaProduk,
            fotoProduk,
            hargaProduk,
            stokProduk
        });

        res.status(201).json({ message: 'Produk berhasil ditambahkan', produk });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllProduk = async (req, res) => {
    try {
        const produk = await Produk.findAll();

        res.status(201).json({ message: 'Berhasil mengambil semua data produk', produk });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProdukById = async (req, res) => {
    const { id } = req.params;

    try {
        const produk = await Produk.findByPk(id);

        if (!produk) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }

        res.status(201).json({ message: 'Berhasil mengambil produk', produk });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProduk,
    getAllProduk,
    getProdukById
};