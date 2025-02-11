const Produk = require('../../models/Produk/produk');

const createProduk = async (req, res) => {
    const fotoProduk = req.file ? `/uploads/${req.file.filename}` : null;
    const {
        namaProduk,
        hargaProduk,
        stokProduk,
        kategoriProduk
    } = req.body;

    try {
        const produk = await Produk.create({
            namaProduk,
            fotoProduk,
            hargaProduk,
            stokProduk,
            kategoriProduk
        });

        res.status(201).json({
            message: 'Produk berhasil ditambahkan', produk
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getAllProduk = async (req, res) => {
    try {
        const produk = await Produk.findAll();

        res.status(201).json({
            message: 'Berhasil mengambil semua data produk', produk
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getProdukById = async (req, res) => {
    const { id } = req.params;

    try {
        const produk = await Produk.findByPk(id);

        if (!produk) {
            return res.status(404).json({
                message: `Produk dengan id ${id} tidak ditemukan`
            });
        }

        res.status(201).json({
            message: `Produk dengan id ${id} berhasil diambil`, produk
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getProdukByKategori = async (req, res) => {
    const { kategoriProduk } = req.params;

    try {
        const produk = await Produk.findAll({
            where: { kategoriProduk }
        });

        if (produk.length == 0) {
            return res.status(404).json({
                message: `Produk dengan kategori ${kategoriProduk} tidak ditemukan`
            });
        }

        res.status(201).json({
            message: `Produk dengan kategori ${kategoriProduk} berhasil diambil`, produk
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateProduk = async (req, res) => {
    const { id } = req.params;
    const {
        namaProduk,
        hargaProduk,
        stokProduk,
        kategoriProduk
    } = req.body;

    try {
        const produk = await Produk.findByPk(id);

        if (!produk) {
            return res.status(404).json({
                message: `Produk dengan id ${id} tidak ditemukan`
            });
        }

        const fotoProduk = req.file ? `/uploads/${req.file.filename}` : produk.fotoProduk;
        const updateStokProduk = stokProduk !== undefined ? stokProduk : produk.stokProduk;

        await produk.update({
            namaProduk,
            hargaProduk,
            fotoProduk,
            stokProduk: updateStokProduk,
            kategoriProduk
        });

        res.status(201).json({
            message: `Produk dengan id ${id} berhasil diupdate`, produk
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteProduk = async (req, res) => {
    const { id } = req.params;

    try {
        const produk = await Produk.findByPk(id);

        if (!produk) {
            return res.status(404).json({
                message: `Produk dengan id ${id} tidak ditemukan`
            });
        }

        await produk.destroy();

        res.status(201).json({
            message: `Produk dengan id ${id} berhasil dihapus`
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createProduk,
    getAllProduk,
    getProdukById,
    getProdukByKategori,
    updateProduk,
    deleteProduk
};