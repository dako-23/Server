import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes.js';
import { auth } from './middlewares/authMiddleware.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

try {

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('DB connected successfully! ');
} catch (err) {
    console.log('Connection to DB failed!');
    console.log(err.message);
}

// Setup CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    next();
});
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}));
app.use(auth);

app.use(routes);

app.listen(5000, () => console.log('RESTful server is running...'))
