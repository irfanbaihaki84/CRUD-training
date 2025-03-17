import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import UserRoutes from './routes/UserRoutes.js';
// import MiddlewareLogRequest from '../middleware/logs';

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

// MIDDLEWARE
// app.use(MiddlewareLogRequest);

app.use(cors());
app.use(express.json());

app.use(UserRoutes);

app.use('/', (req, res) => {
  res.send('SELAMAT DATANG.');
});

app.listen(port, () => console.log(`Server running on port: ${port}`));
