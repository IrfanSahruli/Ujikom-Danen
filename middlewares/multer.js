const multer = require("multer");
const path = require("path");

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads"); // Direktori tempat menyimpan file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
    }
});

// Filter file untuk hanya menerima gambar
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//         cb(null, true);
//     } else {
//         cb(new Error("File harus berupa gambar"), false);
//     }
// };

// Middleware Multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } // Maksimal 2MB
});

module.exports = upload;
