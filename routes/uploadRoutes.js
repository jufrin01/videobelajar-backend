const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

router.post('/', upload.single('image'), (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: 'Tidak ada file gambar yang diunggah' });
        }

        const imageUrl = `http://localhost:5000/upload/${req.file.filename}`;

        res.status(200).json({
            message: 'Gambar berhasil diunggah',
            imageUrl: imageUrl
        });

    } catch (error) {
        console.error("Upload error:", error.message);
        res.status(500).json({ error: 'Gagal mengunggah gambar' });
    }
});

module.exports = router;