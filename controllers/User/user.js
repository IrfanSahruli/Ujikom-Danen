const User = require('../../models/User/user');

const getAllUser = async (req, res) => {
    try {
        const user = await User.findAll();

        res.status(201).json({
            message: 'Berhasil mengambil semua data user',
            user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllUser
};
