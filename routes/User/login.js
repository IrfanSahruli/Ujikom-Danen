const express = require('express');
const {
    register,
    login,
    logout
} = require('../../controllers/User/login');
const protect = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/register/kasir', protect(['admin']), register);
router.post('/login', login);
router.delete('/logout', logout);

module.exports = router
