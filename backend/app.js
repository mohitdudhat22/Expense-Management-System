import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dbConnect from './config/dbConnect.js';

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200
}));
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static('public'));
app.use(cookieParser());

export {app}