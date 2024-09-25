import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const ExpenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  paymentMethod: { type: String, enum: ['cash', 'credit'], required: true, default: 'cash' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

ExpenseSchema.plugin(mongooseAggregatePaginate); // added aggregation plugin
export default mongoose.model('Expense', ExpenseSchema);
