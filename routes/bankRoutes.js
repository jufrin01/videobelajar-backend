const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');

const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

// [GET] Ambil semua bank (Siapapun yang login bisa melihat daftar bank untuk Checkout)
router.get('/', bankController.getAllBanks);

// [GET] Ambil detail 1 bank
router.get('/:id', authenticateToken, bankController.getBankById);

// RUTE BERIKUT HANYA BISA DIAKSES OLEH ADMIN
// [POST] Tambah bank baru
router.post('/', authenticateToken, authorizeAdmin, bankController.createBank);

// [PUT] Edit data bank
router.put('/:id', authenticateToken, authorizeAdmin, bankController.updateBank);

// [DELETE] Hapus data bank
router.delete('/:id', authenticateToken, authorizeAdmin, bankController.deleteBank);

module.exports = router;