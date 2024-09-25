import bookModel from "../models/bookModel.js";
import express from 'express';
import userModel from "../models/userModel.js";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const books = await bookModel.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/users', async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
router.get('/:id', async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, author, description, publicationDate, borrowedBy,available, isBorrowed,genre } = req.body;
    console.log(req.body);
    const newBook = await bookModel.create({title, author, description, publicationDate, available, isBorrowed,genre});
    res.status(201).json({newBook, message: 'Book created successfully'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    console.log(req.body, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<put");
    const updatedBook = await bookModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({updatedBook, message: 'Book updated successfully'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await bookModel.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/borrow', async (req, res) => {
  try {
    const user = req.body.user;

    const book = await bookModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    book.isBorrowed = true;
    book.available = false;
    await book.save();
    res.json({book, message: 'Book borrowed successfully' , borrwer: req.body.user});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/return', async (req, res) => {
  try {

    //user should be able to return the the book if book is borrowed by the user
    const book = await bookModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    // console.log(req.user, "<<<<<<<<<<<user");
    // console.log(book.borrowedBy.toString(), "<<<<<<<book.borrowedBy");
    // if (book.borrowedBy.toString() !== req.user) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }
    book.isBorrowed = false;
    book.available = true;
    await book.save();
    res.json({book, message: 'Book returned successfully', returner: req.body.user});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;