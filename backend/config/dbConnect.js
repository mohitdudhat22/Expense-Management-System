import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import dotenv from 'dotenv';
dotenv.config({path: './.env'});

const dbConnect = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export default dbConnect;