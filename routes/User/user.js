const express = require('express');
const protect = require('../../middlewares/auth');
const {
    getAllUser
} = require('../../controllers/User/user');

const router = express.Router();

router.get('/user', protect(['admin']), getAllUser);

module.exports = router;
