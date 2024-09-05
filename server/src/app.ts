import express from 'express';
import cors from 'cors';
import connectDB from './config/database'; 
import router from './routes/BookRoutes'; 
import path from 'path';

const app = express();

connectDB();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());
app.use('/', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));