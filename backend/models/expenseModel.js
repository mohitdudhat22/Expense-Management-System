import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       required:
 *         - amount
 *         - category
 *         - paymentMethod
 *       properties:
 *         amount:
 *           type: number
 *           description: The amount of the expense
 *         category:
 *           type: string
 *           description: The category of the expense
 *         paymentMethod:
 *           type: string
 *           enum: [cash, credit]
 *           description: The payment method used
 *         userId:
 *           type: string
 *           format: objectId
 *           description: The ID of the user associated with the expense
 *       example:
 *         amount: 100
 *         category: "Food"
 *         paymentMethod: "cash"
 *         userId: "60d5ec49f1a2c8b8f8e4b8e4"
 */

const ExpenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  paymentMethod: { type: String, enum: ['cash', 'credit'], required: true, default: 'cash' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

ExpenseSchema.plugin(mongooseAggregatePaginate); // added aggregation plugin
export default mongoose.model('Expense', ExpenseSchema);
