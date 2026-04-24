const pool = require('../config/db');

// [POST] BUAT PESANAN BARU
const createOrder = async (req, res) => {

    const userId = req.user.id;
    const { courseId, totalPayment, paymentMethod, status } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO orders 
            (user_id, course_id, amount, payment_method, status) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [userId, courseId, totalPayment, paymentMethod, status]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error create order:", err.message);
        res.status(500).json({ error: 'Gagal membuat pesanan di database' });
    }
};


// [GET] AMBIL PESANAN MILIK 1 USER
const getUserOrders = async (req, res) => {
    const { userId } = req.params;

    // Keamanan Ekstra: Pastikan user hanya bisa melihat pesanannya sendiri
    if (req.user.role !== 'admin' && req.user.id.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'Akses ditolak' });
    }

    try {
        const result = await pool.query(
            `SELECT 
                o.id, 
                o.user_id, 
                o.course_id AS "courseId", 
                o.amount AS "totalPayment", 
                o.payment_method AS "paymentMethod", 
                o.status, 
                o.created_at,
                c.title AS "courseTitle", 
                c.image AS "courseImage", 
                c.category AS "courseCategory"
             FROM orders o
             JOIN courses c ON o.course_id = c.id
             WHERE o.user_id = $1 
             ORDER BY o.created_at DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error get user orders:", err.message);
        res.status(500).json({ error: 'Gagal mengambil riwayat pesanan' });
    }
};

// [PUT] UPDATE STATUS PESANAN (Opsional)
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const result = await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error update order status:", err.message);
        res.status(500).json({ error: 'Gagal mengupdate status pesanan' });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    updateOrderStatus
};