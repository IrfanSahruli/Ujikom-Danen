const express = require('express');
const {
    register,
    login,
    logout
} = require('../../controllers/User/login');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);

module.exports = router
