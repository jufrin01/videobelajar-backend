const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db');


const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/sendEmail');

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Access Token singkat (15 menit)
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' } // Refresh Token lama (7 hari)
    );
};



// [POST] DAFTAR USER BARU )

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const checkEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (checkEmail.rows.length > 0) {
            return res.status(400).json({ error: 'Email sudah terdaftar!' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate Token Verifikasi Unik dengan UUID
        const verificationToken = uuidv4();

        const result = await pool.query(
            `INSERT INTO users (name, email, password, role, verification_token) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role`,
            [name, email, hashedPassword, role || 'user', verificationToken]
        );

        // Tahap 6: Kirim token tersebut via nodemailer ke email user
        await sendEmail(email, verificationToken);

        res.status(201).json({
            message: 'Registrasi berhasil. Silakan cek email Anda untuk verifikasi.',
            user: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Gagal mendaftarkan user' });
    }
};

// TAHAP SERVICE VERIFIKASI EMAIL
const verifyEmail = async (req, res) => {
    const { token } = req.query; // Menangkap token dari URL

    try {
        // Cari token tersebut di database
        const result = await pool.query('SELECT * FROM users WHERE verification_token = $1', [token]);

        // Jika tidak ditemukan
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Invalid Verification Token" });
        }

        const user = result.rows[0];

        // Apabila berhasil, update status is_verified dan hapus tokennya
        await pool.query(
            'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = $1',
            [user.id]
        );

        // Berikan response sesuai instruksi soal
        res.status(200).json({ message: "Email Verified Successfully" });

    } catch (err) {
        console.error("Error verify email:", err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};




// [POST] LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Email atau password salah' });
        }

        const user = userResult.rows[0];

        // KEAMANAN EKSTRA: Cek apakah user sudah verifikasi email
        if (user.is_verified === false) {
            return res.status(403).json({ error: 'Akses ditolak. Harap verifikasi email Anda terlebih dahulu melalui link yang kami kirimkan.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Email atau password salah' });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

        res.json({
            accessToken,
            refreshToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

// [POST] REFRESH TOKEN (Auto-Login saat Access Token habis)
const handleRefreshToken = async (req, res) => {
    const { token } = req.body; // Frontend mengirimkan Refresh Token
    if (!token) return res.status(401).json({ error: 'Refresh Token dibutuhkan' });

    try {

        const userResult = await pool.query('SELECT * FROM users WHERE refresh_token = $1', [token]);
        if (userResult.rows.length === 0) return res.status(403).json({ error: 'Token tidak valid' });

        const user = userResult.rows[0];
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ error: 'Token kadaluarsa' });

            const newAccessToken = generateAccessToken(user);
            res.json({ accessToken: newAccessToken });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};


const logoutUser = async (req, res) => {
    try {
        const { userId } = req.body;
        await pool.query('UPDATE users SET refresh_token = NULL WHERE id = $1', [userId]);

        res.json({ message: 'Berhasil logout' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
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
    verifyEmail,
    loginUser,
    handleRefreshToken,
    logoutUser,
    getAllUsers
};