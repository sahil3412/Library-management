const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createBook, getBooks, getBookById, updateBook, deleteBook, borrowBook, returnBook } = require('../controllers/bookController');

// CRUD operations
router.post('/', auth, createBook);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', auth, updateBook);
router.delete('/:id', auth, deleteBook);

// Borrow/Return operations
router.put('/borrow/:id', auth, borrowBook);
router.put('/return/:id', auth, returnBook);

module.exports = router;