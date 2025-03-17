import express from 'express';
import dotenv from 'dotenv';
// import UsersRoutes from '../routes/UsersRoute';
// import MiddlewareLogRequest from '../middleware/logs';

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

// MIDDLEWARE
// app.use(MiddlewareLogRequest);

app.use(express.json());

// app.use('/users', UsersRoutes);

app.use('/', (req, res) => {
  res.send('SELAMAT DATANG.');
});

app.listen(port, () => console.log(`Server running on port: ${port}`));
