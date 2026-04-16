const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// [GET] Ambil semua user
router.get('/', userController.getAllUsers);

// [POST] Daftarkan user baru (Register)
router.post('/register', userController.createUser);

// [POST] Login User
router.post('/login', userController.loginUser);

module.exports = router;