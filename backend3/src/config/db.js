const mysql = require('mysql2');
require('dotenv').config();

// KONEKSI KE DATABASE MYSQL
const dbPool = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

dbPool.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});

module.exports = dbPool;
