const express = require("express");
const protect = require("../../middlewares/auth");
const {
  createTransaksi,
  getAllTransaksi,
  getTransaksiById,
  getRiwayatTransaksi,
  getTransaksiByFilter,
} = require("../../controllers/Transaksi/transaksi");

const router = express.Router();

router.post("/transaksi", protect(["kasir"]), createTransaksi);
router.get("/transaksi", protect(["admin"]), getAllTransaksi);
router.get("/transaksi/:id", protect(["admin", "kasir"]), getTransaksiById);
router.get(
  "/transaksi/riwayat/:filter",
  protect(["admin"]),
  getRiwayatTransaksi
);
router.get(
  "/transaksi/filter/:filter",
  protect(["admin"]),
  getTransaksiByFilter
);

module.exports = router;
