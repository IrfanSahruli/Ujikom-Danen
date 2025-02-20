const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require('./config/db');
const Produk = require('./models/Produk/produk');
const User = require('./models/User/user');
const Transaksi = require('./models/Transaksi/transaksi');
const TransaksiProduk = require('./models/Transaksi/transaksiProduk');
const Routes = require('./routes//routes');

dotenv.config();
const app = express();

app.use(cors({
    credentials: true,
    origin: true
}))

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Middleware untuk melayani file statis di folder uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api', Routes);

db.authenticate().then(async () => {
    console.log('Database berhasil konek');
    // await db.sync({ alter: true });
}).catch(err => console.log(`Error: ${err}`));

app.listen(process.env.PORT, () => {
    console.log(`Server running in port ${process.env.PORT}`);
});