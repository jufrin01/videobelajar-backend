const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');


app.use('/course', courseRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
    res.json({ message: "🚀 Backend VideoBelajar Menyala!" });
});

app.use((req, res) => {
    res.status(404).json({ error: "Endpoint API tidak ditemukan" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`Server Backend Jalan di Port: ${PORT}`);
    console.log(`===========================================`);
});