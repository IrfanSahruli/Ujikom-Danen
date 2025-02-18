const express = require('express');
const protect = require('../../middlewares/auth');
const {
    getAllUser,
    getUserByRole
} = require('../../controllers/User/user');

const router = express.Router();

router.get('/user', protect(['admin']), getAllUser);
router.get('/user/:role', protect(['admin']), getUserByRole);

module.exports = router;
