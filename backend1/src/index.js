const express = require('express');
require('dotenv').config();
const UsersRoutes = require('../routes/UsersRoute');
const MiddlewareLogRequest = require('../middleware/log');
const port = process.env.PORT || 7000;
const app = express();

// MIDDLEWARE
app.use(MiddlewareLogRequest);

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
