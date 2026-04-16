const pool = require('../config/db');

const createOrder = async (req, res) => {
    try {
        const { userId, courseId, amount, paymentMethod } = req.body;

        const result = await pool.query(
            `INSERT INTO orders (user_id, course_id, amount, payment_method, status) 
             VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
            [userId, courseId, amount, paymentMethod]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Gagal membuat pesanan' });
    }
};


const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const query = `
            SELECT o.id, o.amount, o.payment_method, o.status, o.created_at, 
                   c.id as course_id, c.title as course_title, c.image as course_image
            FROM orders o
            JOIN courses c ON o.course_id = c.id
            WHERE o.user_id = $1
            ORDER BY o.created_at DESC
        `;

        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
        }

        const updatedOrder = result.rows[0];

        if (status === 'success') {
            const checkEnrollment = await pool.query(
                'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2',
                [updatedOrder.user_id, updatedOrder.course_id]
            );

            if (checkEnrollment.rows.length === 0) {
                await pool.query(
                    'INSERT INTO enrollments (user_id, course_id, progress) VALUES ($1, $2, 0)',
                    [updatedOrder.user_id, updatedOrder.course_id]
                );
            }
        }

        res.json(updatedOrder);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Gagal update status pesanan' });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    updateOrderStatus
};