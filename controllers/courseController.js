const pool = require('../config/db');

// [READ] Ambil semua kelas
const getAllCourses = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

// [READ] Ambil satu kelas berdasarkan ID
const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Kelas tidak ditemukan' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

// [CREATE] Tambah kelas baru
const createCourse = async (req, res) => {
    try {
        const { title, category, description, price, image, instructorName, instructorRole } = req.body;

        const result = await pool.query(
            `INSERT INTO courses (title, category, description, price, image, instructor_name, instructor_role) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, category, description, price, image, instructorName, instructorRole]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Gagal menambah kelas' });
    }
};

// [UPDATE] Edit kelas
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, description, price, image, instructorName, instructorRole } = req.body;

        const result = await pool.query(
            `UPDATE courses 
             SET title = $1, category = $2, description = $3, price = $4, image = $5, instructor_name = $6, instructor_role = $7 
             WHERE id = $8 RETURNING *`,
            [title, category, description, price, image, instructorName, instructorRole, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Kelas tidak ditemukan' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Gagal mengupdate kelas' });
    }
};

// [DELETE] Hapus kelas
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Kelas tidak ditemukan' });
        }
        res.json({ message: 'Kelas berhasil dihapus' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Gagal menghapus kelas' });
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};