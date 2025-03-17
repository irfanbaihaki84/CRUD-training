const express = require('express');
require('dotenv').config();
const datas = require('./data.js');
const port = 5000;
const app = express();

app.use(express.json());

app.use('/users', (req, res) => {
  //   console.log('data: ', datas);

  try {
    res.json({
      message: 'GET dummy data success.',
      data: datas.users,
    });
  } catch (error) {
    res.json({ message: error });
  }
});

// app.use('/', (req, res) => {
//   res.send('SELAMAT DATANG.');
// });

app.listen(port, () => console.log(`Server running on port: ${port}`));
