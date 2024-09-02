import express from 'express';
import cors from 'cors';
import connectDB from './src/config/database'; 
import router from './src/routes/BookRoutes'; 

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));