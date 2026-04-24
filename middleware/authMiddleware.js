// File: middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // 1. Cek apakah ada token di header menggunakan req.headers.authorization
    const authHeader = req.headers['authorization'];

    // Format standar token adalah "Bearer <token>", jadi kita ambil bagian tokennya saja (index 1)
    const token = authHeader && authHeader.split(' ')[1];

    // Jika tidak ada token sama sekali
    if (!token) {
        return res.status(401).json({ error: 'Autentikasi gagal. Token tidak ditemukan.' });
    }

    // 2. Mengecek validitas token menggunakan jwt.verify dan secretkey
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        // Jika token tidak valid / sudah dimanipulasi / kadaluarsa
        if (err) {
            // Beri respons status kode 403 (Forbidden) dan beri tahu pengguna
            return res.status(403).json({ error: 'Autentikasi gagal. Token tidak valid atau kadaluarsa.' });
        }

        // 3. Jika token valid, simpan data user ke dalam request agar bisa dipakai di controller
        req.user = decodedUser;

        // Biarkan permintaan lanjut menggunakan next()
        next();
    });
};

// --- BONUS: Middleware Khusus Admin ---
// Karena aplikasi Anda punya Dashboard Admin, kita tambahkan gembok ekstra
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Akses ditolak. Endpoint ini hanya untuk Admin.' });
    }
    next(); // Lanjut jika dia benar-benar admin
};

module.exports = {
    authenticateToken,
    authorizeAdmin
};