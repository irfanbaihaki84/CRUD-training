const express = require('express');
require('dotenv').config();
const UsersRoutes = require('../routes/UsersRoute');
const MiddlewareLogRequest = require('../middleware/logs');
const port = process.env.PORT || 7000;
const app = express();

// MIDDLEWARE
app.use(MiddlewareLogRequest);

app.use(express.json());

app.use('/users', UsersRoutes);

app.use('/', (req, res) => {
  res.send('SELAMAT DATANG.');
});

app.listen(port, () => console.log(`Server running on port: ${port}`));
