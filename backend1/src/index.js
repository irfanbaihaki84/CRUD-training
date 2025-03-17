const express = require('express');
require('dotenv').config();
// const datas = require('./data.js');
const mysql = require('mysql2');
const UsersRoutes = require('../routes/UsersRoute');
const port = 5000;
const app = express();

// KONEKSI KE DATABASE
const dbPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'db_1',
});

app.use(express.json());

app.use('/users', UsersRoutes);

app.use('/test', (req, res) => {
  dbPool.query('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.json({ message: 'Koneksi Gagal!' });
    }

    return res.json({
      message: 'Koneksi Sukses',
      data: rows,
    });
  });
});

app.use('/', (req, res) => {
  res.send('SELAMAT DATANG.');
});

app.listen(port, () => console.log(`Server running on port: ${port}`));
