const router = require('express').Router();

//Produk
router.use('/', require('./Produk/produk'));

//Login Register Logout
router.use('/', require('./User/login'));

//User
router.use('/', require('./User/user'));

//Transaksi
router.use('/', require('./Transaksi/transaksi'));

module.exports = router;
