const express = require('express');
// const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const MiddlewareLogRequest = require('./middleware/logs');

// dotenv.config();

const app = express();

app.use(express.json());

// MIDDLEWARE
app.use(MiddlewareLogRequest);

app.use('/users', userRoutes);

app.use('/', (req, res) => {
  res.send('SELAMAT DATANG.');
});

const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`Server running on port: ${port}`));
