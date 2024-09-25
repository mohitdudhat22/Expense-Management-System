import mongoose from 'mongoose';
import { DB_NAME } from '../constants';

const dbConnect = () => {
  const connectionInstance = mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
  .then(() => {
    console.log(`\n Connected to MongoDB: ${connectionInstance.connection.host}`);
})
  .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
  });
};
module.exports = dbConnect;