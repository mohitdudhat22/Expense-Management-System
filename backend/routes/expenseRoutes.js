import express from 'express';
import expenseModel from '../models/expenseModel.js';
import authorize from '../middlewares/roleMiddleware.js';
import { cache, setCache } from '../middlewares/cacheMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';
const router = express.Router();

router.post('/', authorize(['user', 'admin']), async (req, res) => {
  try {
    const { amount, category, paymentMethod } = req.body;
    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (typeof category !== 'string' || category.trim() === '') {
      return res.status(400).json({ error: 'Invalid category' });
    }
    if (['cash', 'credit'].indexOf(paymentMethod) === -1) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }
    console.log(req.user._id);
    const expense = new expenseModel({ ...req.body, userId: req.user._id });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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

router.patch('/:id', authorize(['user', 'admin']), async (req, res) => {
  try {
    const { amount, category, paymentMethod } = req.body;
    if (amount && (typeof amount !== 'number' || amount < 0)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (category && (typeof category !== 'string' || category.trim() === '')) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    if (paymentMethod && ['cash', 'credit'].indexOf(paymentMethod) === -1) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }
    const expense = await expenseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Expenses (Bulk)
router.delete('/', authorize(['user', 'admin']), async (req, res) => {
  const { ids } = req.body; 

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No expense IDs provided' });
  }

  try {
    const result = await Expense.deleteMany({
      _id: { $in: ids },
      userId: req.user._id
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No expenses found for deletion' });
    }

    res.status(200).json({ message: `${result.deletedCount} expenses deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk Upload CSV
router.post('/bulk', authorize(['user', 'admin']),upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const expenses = [];
  const allowedFields = ['amount', 'category', 'paymentMethod'];
  try {
    req.file.buffer
      .pipe(csv())
      .on('data', (row) => {
        // Validate each row's data
        const expenseData = {};
        for (const field of allowedFields) {
          if (!row[field]) {
            return res.status(400).json({ error: `Missing field: ${field}` });
          }
          expenseData[field] = row[field];
        }

        expenseData.amount = parseFloat(row.amount);
        if (isNaN(expenseData.amount)) {
          return res.status(400).json({ error: 'Invalid amount in CSV' });
        }

        expenseData.userId = req.user._id;
        expenseData.createdAt = new Date();
        expenseData.updatedAt = new Date();

        expenses.push(expenseData);
      })
      .on('end', async () => {
        if (expenses.length > 0) {
          await Expense.insertMany(expenses);
          return res.status(201).json({ message: 'Expenses uploaded successfully', count: expenses.length });
        } else {
          return res.status(400).json({ error: 'No valid expenses to upload' });
        }
      });
  } catch (err) {
    return res.status(500).json({ error: 'Error processing the file' });
  }

});

router.delete('/:id', authorize(['user', 'admin']), async (req, res) => {
  const { id } = req.params;
  try {
    await expenseModel.deleteOne({ _id: id, userId: req.user._id });
    res.status(200).json({ message: 'Expenses deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get('/stats/monthly',cache('monthlyStats'), authorize(['user', 'admin']), async (req, res) => {
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
router.get('/stats/category',cache('monthlyStats'), authorize(['user', 'admin']), async (req, res) => {
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
