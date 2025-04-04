const express = require('express');
const cors = require('cors');
// const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const MiddlewareLogRequest = require('./middleware/logs');

// dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MIDDLEWARE
app.use(MiddlewareLogRequest);

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use('/', (req, res) => {
  res.send('SELAMAT DATANG DI SERVER.');
});

const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`Server running on port: ${port}`));
