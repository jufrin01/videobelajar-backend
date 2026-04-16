const pool = require('../config/db');
const bcrypt = require('bcrypt'); // Import Bcrypt

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const checkEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (checkEmail.rows.length > 0) {
            return res.status(400).json({ error: 'Email sudah terdaftar!' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await pool.query(
            `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`,
            [name, email, hashedPassword, role || 'user']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Gagal mendaftarkan user' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Email atau Kata Sandi salah' });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Email atau Kata Sandi salah' });
        }

        // 3. Jika sukses, kembalikan data user (TANPA PASSWORD)
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = {
    createUser,
    loginUser,
    getAllUsers
};