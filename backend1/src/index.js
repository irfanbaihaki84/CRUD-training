const express = require('express');
require('dotenv').config();
// const datas = require('./data.js');
const UsersRoutes = require('../routes/UsersRoute');
const port = 5000;
const app = express();

app.use(express.json());

app.use('/users', UsersRoutes);

app.use('/', (req, res) => {
  res.send('SELAMAT DATANG.');
});

app.listen(port, () => console.log(`Server running on port: ${port}`));
