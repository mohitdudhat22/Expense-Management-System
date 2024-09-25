import express from 'express';
import expenseModel from '../models/expenseModel.js';
import authorize from '../middlewares/roleMiddleware.js';
import { cache, setCache } from '../middlewares/cacheMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *             required:
 *               - amount
 *               - category
 *               - paymentMethod
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Invalid input
 */
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

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all expenses
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of expenses
 */
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

/**
 * @swagger
 * /{id}:
 *   patch:
 *     summary: Update an expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the expense to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       400:
 *         description: Invalid input
 */
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

/**
 * @swagger
 * /:
 *   delete:
 *     summary: Delete multiple expenses
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Expenses deleted successfully
 *       400:
 *         description: No expense IDs provided
 */
router.delete('/', authorize(['user', 'admin']), async (req, res) => {
  const { ids } = req.body; 

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No expense IDs provided' });
  }

  try {
    const result = await expenseModel.deleteMany({
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

/**
 * @swagger
 * /bulk:
 *   post:
 *     summary: Bulk upload expenses
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: number
 *                 category:
 *                   type: string
 *                 paymentMethod:
 *                   type: string
 *     responses:
 *       201:
 *         description: Expenses uploaded successfully
 *       400:
 *         description: No expenses data provided
 */
router.post('/bulk', authorize(['user', 'admin']), async (req, res) => {
  if (!req.body || !Array.isArray(req.body) || req.body.length === 0) {
    return res.status(400).json({ error: 'No expenses data provided' });
  }
  console.log(req.body)
  const expenses = req.body.map(expense => ({
    ...expense,
    userId: req.user._id,
    createdAt: new Date(),
    updatedAt: new Date(),
    amount: parseFloat(expense.amount),
  }));

  try {
    const result = await expenseModel.insertMany(expenses);
    if (result.insertedCount === 0) {
      return res.status(500).json({ error: 'No expenses inserted' });
    }
    return res.status(201).json({ message: 'Expenses uploaded successfully', count: result.insertedCount });
  } catch (err) {
    return res.status(500).json({ error: 'Error processing the expenses data', details: err.message });
  }
});

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a single expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the expense to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       400:
 *         description: Invalid ID
 */
router.delete('/:id', authorize(['user', 'admin']), async (req, res) => {
  const { id } = req.params;
  try {
    await expenseModel.deleteOne({ _id: id, userId: req.user._id });
    res.status(200).json({ message: 'Expenses deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /stats/monthly:
 *   get:
 *     summary: Get monthly expense statistics
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: Monthly expense statistics
 */
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

/**
 * @swagger
 * /stats/category:
 *   get:
 *     summary: Get expense statistics by category
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: Expense statistics by category
 */
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
