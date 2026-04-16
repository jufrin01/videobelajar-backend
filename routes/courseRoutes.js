const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// [GET] Ambil semua kelas
router.get('/', courseController.getAllCourses);

// [GET] Ambil 1 detail kelas berdasarkan ID
router.get('/:id', courseController.getCourseById);

// [POST] Tambah kelas baru
router.post('/', courseController.createCourse);

// [PUT] Update/Edit kelas
router.put('/:id', courseController.updateCourse);

// [DELETE] Hapus kelas
router.delete('/:id', courseController.deleteCourse);

module.exports = router;