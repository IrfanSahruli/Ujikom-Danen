const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../../models/User/user');

dotenv.config();

const register = async (req, res) => {
    const {
        username,
        password,
        email,
        noHp,
        alamat,
        role
    } = req.body;

    try {
        const UserEmail = await User.findOne({ where: { email } });
        if (UserEmail) {
            return res.status(409).json({ message: 'Email telah digunakan' });
        }

        const UserUserName = await User.findOne({ where: { username } });
        if (UserUserName) {
            return res.status(409).json({ message: 'Username telah digunakan' });
        }

        const UserNoHp = await User.findOne({ where: { noHp } });
        if (UserNoHp) {
            return res.status(409).json({ message: 'No hp telah digunakan' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            password: hashedpassword,
            email,
            noHp,
            alamat,
            role
        });

        res.status(201).json({ message: role + ' berhasil ditambahkan', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'Username tidak ditemukan' });
        }

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password salah' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.SECRET_KEY
        );

        res.cookie('token', token, { httpOnly: true, sameSite: 'None', secure: true, path: '/' });

        res.status(201).json({ message: 'Login berhasil', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true });
        res.status(200).json({ message: 'Log out berhasil' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    logout
};