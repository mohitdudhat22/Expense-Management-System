import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dbConnect from './config/dbConnect.js';
import {swaggerUi, swaggerDocs} from './utils/swagger.js';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import expenseRoutes from './routes/expenseRoutes.js';
import authMiddleware from './middlewares/authMiddleware.js';
const app = express();
const PORT = process.env.PORT || 8080;
dotenv.config({ path: './.env' });

dbConnect();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses',authMiddleware, expenseRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(errorHandler());
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));