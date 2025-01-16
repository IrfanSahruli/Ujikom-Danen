const express = require('express');
const {
    createProduk,
    getAllProduk,
    getProdukById
} = require('../../controllers/Produk/produk');
const upload = require('../../middlewares/multer');

const router = express.Router();

router.post('/produk', upload.single("fotoProduk"), createProduk);
router.get('/produk', getAllProduk);
router.get('/produk/:id', getProdukById);

module.exports = router;
