const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Daftarkan Routes ke URL tertentu
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Endpoint Tes Root Server
app.get('/', (req, res) => {
    res.json({
        message: "🚀 Backend VideoBelajar (PostgreSQL + Express) Menyala!",
        status: "Active"
    });
});

// Tangkap route yang tidak ada (404)
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint API tidak ditemukan" });
});

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`Server Backend Jalan di Port: ${PORT}`);
    console.log(`Cek di browser: http://localhost:${PORT}`);
    console.log(`===========================================`);
});