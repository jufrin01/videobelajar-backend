const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

// [GET] Ambil semua kelas -> PUBLIC (Siapa saja boleh lihat)
router.get('/', courseController.getAllCourses);

// [GET] Ambil 1 detail kelas -> PUBLIC
router.get('/:id', courseController.getCourseById);

// --- PROTECTED ROUTES (Hanya Admin) ---

// [POST] Tambah kelas baru -> Login + Admin Only
router.post('/', authenticateToken, authorizeAdmin, courseController.createCourse);

// [PUT] Update/Edit kelas -> Login + Admin Only
router.put('/:id', authenticateToken, authorizeAdmin, courseController.updateCourse);

// [DELETE] Hapus kelas -> Login + Admin Only
router.delete('/:id', authenticateToken, authorizeAdmin, courseController.deleteCourse);

module.exports = router;