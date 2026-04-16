const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// [POST] Buat pesanan baru (Checkout)
router.post('/', orderController.createOrder);

// [GET] Ambil semua pesanan milik 1 user tertentu
router.get('/user/:userId', orderController.getUserOrders);

// [PUT] Update status pesanan (Misal: dari 'pending' jadi 'success')
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;