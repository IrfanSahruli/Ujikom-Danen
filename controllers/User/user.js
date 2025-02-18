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

const getUserByRole = async (req, res) => {
    const { role } = req.params;

    try {
        const user = await User.findAll({
            where: { role },
            attributes: ['id', 'username', 'password', 'email', 'noHp', 'alamat', 'role']
        });

        if (user.length === 0) {
            return res.status(404).json({
                message: `Tidak ada pengguna dengan role '${role}'`
            });
        }

        res.status(201).json({
            message: `Sukses mengambil data user dengan role '${role}'`,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllUser,
    getUserByRole
};
