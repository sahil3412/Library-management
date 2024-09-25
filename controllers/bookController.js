const Book = require('../models/Book');

// Create a new book
exports.createBook = async (req, res) => {
    const { title, author, genre } = req.body;
    try {
        const newBook = new Book({ title, author, genre });
        await newBook.save();
        res.json(newBook);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Read all books or specific book by ID
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ msg: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Update book details
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(book);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Delete book
exports.deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Book removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Borrow/Return book
exports.borrowBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book.availability) return res.status(400).json({ msg: 'Book already borrowed' });

        book.availability = false;
        book.borrowedBy = req.user.id;
        await book.save();
        res.json(book);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.returnBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book.borrowedBy.toString() !== req.user.id)
            return res.status(400).json({ msg: 'Not authorized to return this book' });

        book.availability = true;
        book.borrowedBy = null;
        await book.save();
        res.json(book);
    } catch (err) {
        res.status(500).send('Server error');
    }
};