import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 }).isString(),
  body('username').isLength({ min: 1 }).isString(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, username, role } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new userModel({ email, password, username, role });
    await user.save();
    
    const token = jwt.sign({ userId: user._id, role, email, username,  }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' , error});
  }
});

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 }).isString(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, { httpOnly: true });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;