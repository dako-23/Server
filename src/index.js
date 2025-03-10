import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes.js';
import { auth } from './middlewares/authMiddleware.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import http from 'http'
import initSocket from './socket.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://dako23.web.app"],
        methods: ["GET", "POST"],
        credentials: true,
    }
});

initSocket(io);

try {

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('DB connected successfully! ');
} catch (err) {
    console.log('Connection to DB failed!');
    console.log(err.message);
}

// Setup CORS
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*', cors({ credentials: true }));

//     next();
// });
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://dako23.web.app'],
    credentials: true
}));
app.use(auth);

app.use(routes);

server.listen(5000, () => console.log('RESTful server is running...'))
