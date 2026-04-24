const pool = require('../config/db');
// [GET] AMBIL SEMUA DATA BANK (Bisa diakses User & Admin)
const getAllBanks = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM banks ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error get banks:", err.message);
        res.status(500).json({ error: 'Gagal mengambil data bank' });
    }
};

// [GET] AMBIL 1 DATA BANK SPESIFIK
const getBankById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM banks WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bank tidak ditemukan' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error get bank by id:", err.message);
        res.status(500).json({ error: 'Gagal mengambil data bank' });
    }
};

// [POST] TAMBAH BANK BARU (Khusus Admin)
const createBank = async (req, res) => {
    const { name, logo, themeColor, vaCode, instructions } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO banks (name, logo, theme_color, va_code, instructions) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, logo, themeColor || 'text-blue-600', vaCode, instructions]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error create bank:", err.message);
        res.status(500).json({ error: 'Gagal menambahkan bank baru' });
    }
};


// [PUT] EDIT/UPDATE DATA BANK (Khusus Admin)
const updateBank = async (req, res) => {
    const { id } = req.params;
    const { name, logo, themeColor, vaCode, instructions } = req.body;
    try {
        const result = await pool.query(
            `UPDATE banks 
             SET name = $1, logo = $2, theme_color = $3, va_code = $4, instructions = $5 
             WHERE id = $6 RETURNING *`,
            [name, logo, themeColor, vaCode, instructions, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bank tidak ditemukan' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error update bank:", err.message);
        res.status(500).json({ error: 'Gagal memperbarui data bank' });
    }
};

// [DELETE] HAPUS BANK (Khusus Admin)

const deleteBank = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM banks WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bank tidak ditemukan' });
        }
        res.json({ message: 'Bank berhasil dihapus', deletedBank: result.rows[0] });
    } catch (err) {
        console.error("Error delete bank:", err.message);
        res.status(500).json({ error: 'Gagal menghapus bank' });
    }
};

module.exports = {
    getAllBanks,
    getBankById,
    createBank,
    updateBank,
    deleteBank
};