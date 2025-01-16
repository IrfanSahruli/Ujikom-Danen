const router = require('express').Router();

//Produk
router.use('/', require('./Produk/produk'));

//Login Register Logout
router.use('/', require('./User/login'));

module.exports = router;
