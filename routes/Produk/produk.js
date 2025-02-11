const express = require('express');
const {
    createProduk,
    getAllProduk,
    getProdukById,
    getProdukByKategori,
    updateProduk,
    deleteProduk
} = require('../../controllers/Produk/produk');
const upload = require('../../middlewares/multer');
const protect = require('../../middlewares/auth');

const router = express.Router();

router.post('/produk', protect(['admin']), upload.single('fotoProduk'), createProduk);
router.get('/produk', protect(['kasir', 'admin']), getAllProduk);
router.get('/produk/:id', protect(['kasir', 'admin']), getProdukById);
router.get('/produk/kategori/:kategoriProduk', protect(['kasir', 'admin']), getProdukByKategori);
router.put('/produk/:id', protect(['admin']), upload.single('fotoProduk'), updateProduk);
router.delete('/produk/:id', protect(['admin']), deleteProduk);

module.exports = router;
