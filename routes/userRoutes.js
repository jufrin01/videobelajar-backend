const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// [GET] Ambil semua user (Khusus Admin)
router.get('/', userController.getAllUsers);

// [POST] Daftarkan user baru (Register)
router.post('/register', userController.createUser);

// [POST] Login User
router.post('/login', userController.loginUser);

// [POST] Refresh Token (Meminta access token baru secara otomatis)
router.post('/refresh-token', userController.handleRefreshToken);

// [POST] Logout User (Menghapus refresh token dari database)
router.post('/logout', userController.logoutUser);

router.get('/verifikasi-email', userController.verifyEmail);

module.exports = router;