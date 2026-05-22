/**
 * ============================================
 * LIBRARY MANAGEMENT SYSTEM - CLASS DEFINITIONS
 * ============================================
 * 
 * This file contains all the Object-Oriented
 * Programming classes for the Library Management System.
 * 
 * Classes:
 * 1. Book (Base Class)
 * 2. PrintedBook (Extends Book)
 * 3. EBook (Extends Book)
 * 4. LibraryUser
 * 5. LibraryManagementSystem
 */

// ============================================
// 1. BOOK CLASS - Base class for all books
// ============================================

class Book {
    /**
     * Constructor for Book class
     * @param {string} title - Book title
     * @param {string} author - Book author
     * @param {string} isbn - ISBN number
     * @param {string} category - Book category
     * @param {number} loanDuration - Loan duration in days
     */
    constructor(title, author, isbn, category, loanDuration) {
        this.id = this.generateId();
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.category = category;
        this.loanDuration = loanDuration;
        this.isAvailable = true;
        this.type = 'Book';
        this.createdDate = new Date();
    }

    /**
     * Generate unique book ID
     * @returns {string} Unique book ID
     */
    generateId() {
        return 'BOOK_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    /**
     * Borrow the book
     * @returns {boolean} Success status
     */
    borrow() {
        if (this.isAvailable) {
            this.isAvailable = false;
            return true;
        }
        return false;
    }

    /**
     * Return the book
     * @returns {boolean} Success status
     */
    returnBook() {
        this.isAvailable = true;
        return true;
    }

    /**
     * Get availability status
     * @returns {string} Status message
     */
    getAvailabilityStatus() {
        return this.isAvailable ? 'Available' : 'Borrowed';
    }

    /**
     * Get book details
     * @returns {object} Book details object
     */
    getDetails() {
        return {
            id: this.id,
            title: this.title,
            author: this.author,
            isbn: this.isbn,
            category: this.category,
            type: this.type,
            loanDuration: this.loanDuration,
            isAvailable: this.isAvailable
        };
    }
}

// ============================================
// 2. PRINTED BOOK CLASS - Handles physical copies
// ============================================

class PrintedBook extends Book {
    /**
     * Constructor for PrintedBook class
     * @param {string} title - Book title
     * @param {string} author - Book author
     * @param {string} isbn - ISBN number
     * @param {string} category - Book category
     * @param {number} loanDuration - Loan duration in days
     * @param {number} quantity - Number of copies
     */
    constructor(title, author, isbn, category, loanDuration, quantity) {
        super(title, author, isbn, category, loanDuration);
        this.type = 'PrintedBook';
        this.quantity = quantity;
        this.availableCopies = quantity;
    }

    /**
     * Borrow a copy of the book
     * @returns {boolean} Success status
     */
    borrow() {
        if (this.availableCopies > 0) {
            this.availableCopies--;
            this.isAvailable = this.availableCopies > 0;
            return true;
        }
        return false;
    }

    /**
     * Return a copy of the book
     * @returns {boolean} Success status
     */
    returnBook() {
        if (this.availableCopies < this.quantity) {
            this.availableCopies++;
            this.isAvailable = true;
            return true;
        }
        return false;
    }

    /**
     * Get availability status
     * @returns {string} Status message with copy count
     */
    getAvailabilityStatus() {
        return `${this.availableCopies}/${this.quantity} copies`;
    }

    /**
     * Get book details with quantity info
     * @returns {object} Book details with quantity
     */
    getDetails() {
        const details = super.getDetails();
        details.quantity = this.quantity;
        details.availableCopies = this.availableCopies;
        return details;
    }
}

// ============================================
// 3. EBOOK CLASS - Handles digital licenses
// ============================================

class EBook extends Book {
    /**
     * Constructor for EBook class
     * @param {string} title - Book title
     * @param {string} author - Book author
     * @param {string} isbn - ISBN number
     * @param {string} category - Book category
     * @param {number} loanDuration - Loan duration in days
     */
    constructor(title, author, isbn, category, loanDuration) {
        super(title, author, isbn, category, loanDuration);
        this.type = 'EBook';
        this.maxSimultaneousUsers = 3;
        this.currentUsers = [];
    }

    /**
     * Borrow the ebook for a specific user
     * @param {string} userId - User ID
     * @returns {boolean} Success status
     */
    borrow(userId) {
        if (this.currentUsers.length < this.maxSimultaneousUsers) {
            if (!this.currentUsers.includes(userId)) {
                this.currentUsers.push(userId);
            }
            this.isAvailable = this.currentUsers.length < this.maxSimultaneousUsers;
            return true;
        }
        return false;
    }

    /**
     * Return the ebook for a specific user
     * @param {string} userId - User ID
     * @returns {boolean} Success status
     */
    returnBook(userId) {
        this.currentUsers = this.currentUsers.filter(id => id !== userId);
        this.isAvailable = this.currentUsers.length < this.maxSimultaneousUsers;
        return true;
    }

    /**
     * Get availability status
     * @returns {string} Status message with license count
     */
    getAvailabilityStatus() {
        const available = this.maxSimultaneousUsers - this.currentUsers.length;
        return `${available}/${this.maxSimultaneousUsers} licenses`;
    }

    /**
     * Get book details with license info
     * @returns {object} Book details with license info
     */
    getDetails() {
        const details = super.getDetails();
        details.maxSimultaneousUsers = this.maxSimultaneousUsers;
        details.currentUsers = this.currentUsers.length;
        return details;
    }
}

// ============================================
// 4. LIBRARY USER CLASS - Manages user data
// ============================================

class LibraryUser {
    /**
     * Constructor for LibraryUser class
     * @param {string} name - User full name
     * @param {string} email - User email address
     * @param {string} userId - Unique user ID
     * @param {string} type - User type (Student/Faculty/Staff)
     * @param {number} maxBooks - Maximum books allowed to borrow
     */
    constructor(name, email, userId, type, maxBooks) {
        this.id = userId;
        this.name = name;
        this.email = email;
        this.type = type;
        this.maxBooks = maxBooks;
        this.borrowedBooks = [];
        this.totalFines = 0;
        this.createdDate = new Date();
    }

    /**
     * Check if user can borrow more books
     * @returns {boolean} Can borrow status
     */
    canBorrow() {
        const activeBorrows = this.borrowedBooks.filter(b => !b.returned).length;
        return activeBorrows < this.maxBooks;
    }

    /**
     * Borrow a book
     * @param {Book} book - Book object to borrow
     * @param {Date} borrowDate - Date of borrowing
     * @returns {boolean} Success status
     */
    borrowBook(book, borrowDate = new Date(), expectedReturnDate = null) {
        if (!this.canBorrow()) {
            return false;
        }

        // Check if already borrowed
        const alreadyBorrowed = this.borrowedBooks.find(
            b => !b.returned && b.book.id === book.id
        );
        if (alreadyBorrowed) {
            return false;
        }

        let dueDate;
        if (expectedReturnDate) {
            dueDate = new Date(expectedReturnDate);
        } else {
            dueDate = new Date(borrowDate);
            dueDate.setDate(dueDate.getDate() + book.loanDuration);
        }

        this.borrowedBooks.push({
            book: book,
            borrowDate: new Date(borrowDate),
            dueDate: dueDate,
            returned: false,
            returnDate: null,
            fine: 0
        });

        return true;
    }

    /**
     * Return a borrowed book
     * @param {string} bookId - Book ID to return
     * @returns {object} Return details with fine information
     */
    returnBook(bookId) {
        const record = this.borrowedBooks.find(
            b => !b.returned && b.book.id === bookId
        );

        if (!record) {
            return { success: false, fine: 0, message: 'Book not found in records' };
        }

        record.returned = true;
        record.returnDate = new Date();

        const today = new Date();
        let fine = 0;

        if (today > record.dueDate) {
            const daysOverdue = Math.floor((today - record.dueDate) / (1000 * 60 * 60 * 24));
            fine = daysOverdue * 0.5; // $0.50 per day
            record.fine = fine;
            this.totalFines += fine;
        }

        return {
            success: true,
            fine: fine,
            daysOverdue: fine > 0 ? Math.floor((today - record.dueDate) / (1000 * 60 * 60 * 24)) : 0,
            message: `Book returned successfully${fine > 0 ? ` (Fine: $${fine.toFixed(2)})` : ''}`
        };
    }

    /**
     * Get all currently borrowed books
     * @returns {array} Array of borrowed book records
     */
    getActiveBorrowedBooks() {
        return this.borrowedBooks.filter(b => !b.returned);
    }

    /**
     * Get total outstanding fines
     * @returns {number} Total fine amount
     */
    getTotalFine() {
        return Math.round(this.totalFines * 100) / 100;
    }

    /**
     * Get user details
     * @returns {object} User details object
     */
    getDetails() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            type: this.type,
            maxBooks: this.maxBooks,
            borrowedCount: this.getActiveBorrowedBooks().length,
            totalFines: this.getTotalFine(),
            createdDate: this.createdDate
        };
    }
}

// ============================================
// 5. LIBRARY MANAGEMENT SYSTEM CLASS - Main System
// ============================================

class LibraryManagementSystem {
    /**
     * Constructor for LibraryManagementSystem class
     */
    constructor() {
        this.books = [];
        this.users = [];
        this.activities = [];
        this.maxActivities = 20;
    }

    // ========== BOOK MANAGEMENT ==========

    /**
     * Add a new book to the library
     * @param {Book} book - Book object to add
     * @returns {boolean} Success status
     */
    addBook(book) {
        if (!book || !book.title) {
            return false;
        }
        this.books.push(book);
        this.addActivity(`Book added: "${book.title}" by ${book.author}`);
        return true;
    }

    /**
     * Get all books
     * @returns {array} Array of all books
     */
    getBooks() {
        return this.books;
    }

    /**
     * Get book by ID
     * @param {string} bookId - Book ID
     * @returns {Book|null} Book object or null
     */
    getBookById(bookId) {
        return this.books.find(b => b.id === bookId) || null;
    }

    /**
     * Search books by criteria
     * @param {string} keyword - Search keyword
     * @param {string} category - Category filter
     * @returns {array} Matching books
     */
    searchBooks(keyword = '', category = '') {
        let results = this.books;

        if (keyword) {
            const lowerKeyword = keyword.toLowerCase();
            results = results.filter(b =>
                b.title.toLowerCase().includes(lowerKeyword) ||
                b.author.toLowerCase().includes(lowerKeyword) ||
                b.isbn.toLowerCase().includes(lowerKeyword)
            );
        }

        if (category) {
            results = results.filter(b => b.category === category);
        }

        return results;
    }

    // ========== USER MANAGEMENT ==========

    /**
     * Add a new user to the library
     * @param {LibraryUser} user - User object to add
     * @returns {boolean} Success status
     */
    addUser(user) {
        if (!user || !user.id || !user.name) {
            return false;
        }

        // Check if user ID already exists
        if (this.users.some(u => u.id === user.id)) {
            return false;
        }

        this.users.push(user);
        this.addActivity(`User registered: ${user.name} (${user.type})`);
        return true;
    }

    /**
     * Get all users
     * @returns {array} Array of all users
     */
    getUsers() {
        return this.users;
    }

    /**
     * Get user by ID
     * @param {string} userId - User ID
     * @returns {LibraryUser|null} User object or null
     */
    getUserById(userId) {
        return this.users.find(u => u.id === userId) || null;
    }

    /**
     * Search users by criteria
     * @param {string} keyword - Search keyword
     * @returns {array} Matching users
     */
    searchUsers(keyword = '') {
        if (!keyword) {
            return this.users;
        }

        const lowerKeyword = keyword.toLowerCase();
        return this.users.filter(u =>
            u.name.toLowerCase().includes(lowerKeyword) ||
            u.id.toLowerCase().includes(lowerKeyword) ||
            u.email.toLowerCase().includes(lowerKeyword)
        );
    }

    // ========== BORROWING MANAGEMENT ==========

    /**
     * Borrow a book for a user
     * @param {string} userId - User ID
     * @param {string} bookId - Book ID
     * @returns {object} Operation result
     */
    borrowBook(userId, bookId, borrowDate = null, expectedReturnDate = null) {
        const user = this.getUserById(userId);
        const book = this.getBookById(bookId);

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        if (!book) {
            return { success: false, message: 'Book not found' };
        }

        if (!user.canBorrow()) {
            return { success: false, message: `User has reached maximum borrowing limit (${user.maxBooks} books)` };
        }

        if (!book.isAvailable && !(book.type === 'EBook')) {
            return { success: false, message: 'Book is not available' };
        }

        // parse dates if provided
        const borrowDateObj = borrowDate ? new Date(borrowDate) : new Date();
        const expectedReturnObj = expectedReturnDate ? new Date(expectedReturnDate) : null;

        if (!user.borrowBook(book, borrowDateObj, expectedReturnObj)) {
            return { success: false, message: 'Failed to borrow book' };
        }

        if (book.type === 'EBook') {
            book.borrow(userId);
        } else {
            book.borrow();
        }

        this.addActivity(`Book borrowed: "${book.title}" borrowed by ${user.name}`);
        return { success: true, message: `"${book.title}" borrowed successfully` };
    }

    /**
     * Return a borrowed book
     * @param {string} userId - User ID
     * @param {string} bookId - Book ID
     * @returns {object} Operation result
     */
    returnBook(userId, bookId) {
        const user = this.getUserById(userId);
        const book = this.getBookById(bookId);

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        if (!book) {
            return { success: false, message: 'Book not found' };
        }

        const result = user.returnBook(bookId);

        if (!result.success) {
            return result;
        }

        if (book.type === 'EBook') {
            book.returnBook(userId);
        } else {
            book.returnBook();
        }

        this.addActivity(`Book returned: "${book.title}" returned by ${user.name}${result.fine > 0 ? ` (Fine: ₱${result.fine.toFixed(2)})` : ''}`);
        return result;
    }

    /**
     * Get all currently borrowed records
     * @returns {array} Array of borrowed records
     */
    getBorrowedRecords() {
        const records = [];
        this.users.forEach(user => {
            user.borrowedBooks.forEach(record => {
                if (!record.returned) {
                    records.push({
                        user: user,
                        record: record
                    });
                }
            });
        });
        return records;
    }

    /**
     * Get all borrowing records (including returned)
     * @returns {array} Array of all records
     */
    getAllRecords() {
        const records = [];
        this.users.forEach(user => {
            user.borrowedBooks.forEach(record => {
                records.push({
                    user: user,
                    record: record
                });
            });
        });
        return records;
    }

    // ========== STATISTICS ==========

    /**
     * Get total number of books
     * @returns {number} Total books count
     */
    getTotalBooks() {
        return this.books.length;
    }

    /**
     * Get available books count
     * @returns {number} Available books count
     */
    getAvailableBooks() {
        // Count available copies/licenses across all books
        let available = 0;
        this.books.forEach(b => {
            if (b.type === 'PrintedBook') {
                available += b.availableCopies || 0;
            } else if (b.type === 'EBook') {
                available += (b.maxSimultaneousUsers - (b.currentUsers ? b.currentUsers.length : 0));
            } else {
                available += b.isAvailable ? 1 : 0;
            }
        });
        return available;
    }

    /**
     * Get borrowed books count (counts copies/licenses currently borrowed)
     * @returns {number} Borrowed books count
     */
    getBorrowedBooks() {
        let borrowed = 0;
        this.books.forEach(b => {
            if (b.type === 'PrintedBook') {
                borrowed += (b.quantity - (b.availableCopies || 0));
            } else if (b.type === 'EBook') {
                borrowed += (b.currentUsers ? b.currentUsers.length : 0);
            } else {
                borrowed += b.isAvailable ? 0 : 1;
            }
        });
        return borrowed;
    }

    /**
     * Get total users count
     * @returns {number} Total users count
     */
    getTotalUsers() {
        return this.users.length;
    }

    /**
     * Get active borrowers count
     * @returns {number} Active borrowers count
     */
    getActiveBorrowers() {
        return this.users.filter(u => u.getActiveBorrowedBooks().length > 0).length;
    }

    /**
     * Get overdue books count
     * @returns {number} Overdue books count
     */
    getOverdueBooks() {
        const today = new Date();
        let overdue = 0;
        this.users.forEach(user => {
            user.borrowedBooks.forEach(record => {
                if (!record.returned && record.dueDate < today) {
                    overdue++;
                }
            });
        });
        return overdue;
    }

    /**
     * Get total fines
     * @returns {number} Total fines amount
     */
    getTotalFines() {
        let total = 0;
        this.users.forEach(user => {
            total += user.getTotalFine();
        });
        return Math.round(total * 100) / 100;
    }

    // ========== ACTIVITY MANAGEMENT ==========

    /**
     * Add activity to log
     * @param {string} message - Activity message
     */
    addActivity(message) {
        const activity = {
            message: message,
            timestamp: new Date()
        };
        this.activities.unshift(activity);
        if (this.activities.length > this.maxActivities) {
            this.activities.pop();
        }
    }

    /**
     * Get all activities
     * @returns {array} Array of activities
     */
    getActivities() {
        return this.activities;
    }
}