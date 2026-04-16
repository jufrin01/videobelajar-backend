const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(() => console.log('Berhasil terhubung ke PostgreSQL videobelajar_db!'))
    .catch((err) => console.error('Gagal koneksi ke database:', err.message));

module.exports = pool;