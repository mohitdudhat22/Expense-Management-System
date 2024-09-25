import express from 'express';
import expenseModel from '../models/expenseModel.js';
import authorize from '../middlewares/roleMiddleware.js';
const router = express.Router();


// Add Expense
router.post('/', authorize(['user', 'admin']), async (req, res) => {
  try {
    const { amount, category, paymentMethod  } = req.body;
    const expense = new expenseModel({ ...req.body, userId: req.user._id });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bulk Upload CSV
router.post('/bulk', authorize(['user', 'admin']), async (req, res) => {
  // Handle CSV parsing and bulk insert logic here
});

// Read Expenses with Filtering, Sorting, and Pagination
router.get('/', authorize(['user', 'admin']), async (req, res) => { 
  const { category, paymentMethod, startDate, endDate, sort, limit, page } = req.query;
  let filter = { userId: req.user._id };

  if (category) filter.category = category;
  if (paymentMethod) filter.paymentMethod = paymentMethod;
  if (startDate || endDate) filter.createdAt = { $gte: startDate, $lte: endDate };

  const expenses = await expenseModel.find(filter)
    .sort(sort || '-createdAt')
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json(expenses);
});

// Update Expense (PATCH)
router.patch('/:id', authorize(['user', 'admin']), async (req, res) => {
  try {
    const expense = await expenseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Expenses (Bulk)
router.delete('/', authorize(['user', 'admin']), async (req, res) => {
  const { ids } = req.body;
  try {
    await expenseModel.deleteMany({ _id: { $in: ids }, userId: req.user._id });
    res.status(200).json({ message: 'Expenses deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Delete Expenses
router.delete('/:id', authorize(['user', 'admin']), async (req, res) => {
  const { id } = req.params;
  try {
    await expenseModel.deleteOne({ _id: id, userId: req.user._id });
    res.status(200).json({ message: 'Expenses deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get('/stats/monthly', authorize(['user', 'admin']), async (req, res) => {
  try {
    const stats = await expenseModel.aggregate([
      // Step 1: Match - Get expenses for the authenticated user
      { $match: { userId: req.user._id } },

      // Step 2: Project - Extract month and year from createdAt
      {
        $project: {
          amount: 1,
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        }
      },

      // Step 3: Group - Group by month and year, then sum the total amount
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          totalExpenses: { $sum: "$amount" }
        }
      },

      // Step 4: Sort - Sort by year and month
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/stats/category', authorize(['user', 'admin']), async (req, res) => {
  try {
    const stats = await expenseModel.aggregate([
      // Step 1: Match - Get expenses for the authenticated user
      { $match: { userId: req.user._id } },

      // Step 2: Group - Group by category, sum the total amount spent per category
      {
        $group: {
          _id: "$category",
          totalExpenses: { $sum: "$amount" }
        }
      },

      // Step 3: Sort - Sort by total amount spent
      { $sort: { totalExpenses: -1 } }
    ]);

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
