const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// IMPORT Satpam Backend (Middleware)
const { authenticateToken } = require('../middleware/authMiddleware');

// Semua rute di bawah ini mewajibkan user LOGIN (Membawa Token)

// [POST] Buat pesanan baru (Checkout)
router.post('/', authenticateToken, orderController.createOrder);

// [GET] Ambil semua pesanan milik 1 user tertentu
router.get('/user/:userId', authenticateToken, orderController.getUserOrders);

// [PUT] Update status pesanan
router.put('/:id/status', authenticateToken, orderController.updateOrderStatus);

module.exports = router;