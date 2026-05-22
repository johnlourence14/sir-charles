/**
 * ============================================
 * LIBRARY MANAGEMENT SYSTEM - MAIN APPLICATION
 * ============================================
 * 
 * This file handles:
 * - DOM Manipulation
 * - Event Listeners
 * - UI Updates
 * - Application Logic
 */

// ============================================
// GLOBAL VARIABLES
// ============================================

const library = new LibraryManagementSystem();

// ============================================
// UI MANAGER - Handles all DOM manipulation
// ============================================

const UIManager = {
    /**
     * Initialize all event listeners
     */
    init() {
        this.setupTabNavigation();
        this.setupModalHandlers();
        this.setupFormHandlers();
        this.setupSearchFilters();
        this.setupActionButtons();
        this.updateAllDashboard();
    },

    // ========== TAB NAVIGATION ==========

    /**
     * Setup tab navigation event listeners
     */
    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.nav-btn');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;

                // Remove active class from all buttons and contents
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

                // Add active class to clicked button and corresponding tab
                e.target.classList.add('active');
                const tabContent = document.getElementById(tabName);
                if (tabContent) {
                    tabContent.classList.add('active');

                    // Refresh content when switching tabs
                    if (tabName === 'catalog') {
                        this.renderCatalog();
                    } else if (tabName === 'users') {
                        this.renderUsers();
                    } else if (tabName === 'borrowing') {
                        this.renderBorrowedBooks();
                    } else if (tabName === 'records') {
                        this.renderRecords();
                    } else if (tabName === 'dashboard') {
                        this.updateAllDashboard();
                    }
                }
            });
        });
    },

    // ========== MODAL HANDLERS ==========

    /**
     * Setup modal open and close handlers
     */
    setupModalHandlers() {
        const self = this;

        // Open buttons
        const addBookBtn = document.getElementById('addBookBtn');
        if (addBookBtn) {
            addBookBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                self.openModal('addBookModal');
            });
        }

        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                self.openModal('addUserModal');
            });
        }

        const borrowBookBtn = document.getElementById('borrowBookBtn');
        if (borrowBookBtn) {
            borrowBookBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                self.populateBorrowForm();
                self.openModal('borrowModal');
            });
        }

        const returnBookBtn = document.getElementById('returnBookBtn');
        if (returnBookBtn) {
            returnBookBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                self.populateReturnForm();
                self.openModal('returnModal');
            });
        }

        // Close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const modalId = e.target.dataset.modal;
                self.closeModal(modalId);
            });
        });

        // Cancel buttons in modals
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const modalId = e.target.dataset.modal;
                if (e.target.classList.contains('btn-danger')) {
                    self.closeModal(modalId);
                }
            });
        });

        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    },

    /**
     * Open a modal
     * @param {string} modalId - Modal element ID
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    },

    /**
     * Close a modal
     * @param {string} modalId - Modal element ID
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    },

    // ========== FORM HANDLERS ==========

    /**
     * Setup all form submission handlers
     */
    setupFormHandlers() {
        // Add Book Form
        document.getElementById('addBookForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddBook();
        });

        // Add User Form
        document.getElementById('addUserForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddUser();
        });

        // Borrow Book Form
        document.getElementById('borrowForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBorrowBook();
        });

        // Return Book Form
        document.getElementById('returnForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleReturnBook();
        });
    },

    /**
     * Handle adding a new book
     */
    handleAddBook() {
        const title = document.getElementById('bookTitle').value.trim();
        const author = document.getElementById('bookAuthor').value.trim();
        const isbn = document.getElementById('bookISBN').value.trim();
        const category = document.getElementById('bookCategory').value;
        const type = document.getElementById('bookType').value;
        const quantity = parseInt(document.getElementById('bookQuantity').value);
        const loanDuration = parseInt(document.getElementById('loanDuration').value);

        // Validation
        if (!title || !author || !isbn || !category || !type) {
            this.showAlert('Please fill in all required fields', 'danger');
            return;
        }

        let book;
        try {
            if (type === 'PrintedBook') {
                book = new PrintedBook(title, author, isbn, category, loanDuration, quantity);
            } else {
                book = new EBook(title, author, isbn, category, loanDuration);
            }

            if (library.addBook(book)) {
                this.showAlert(`Book "${title}" added successfully!`, 'success');
                document.getElementById('addBookForm').reset();
                this.closeModal('addBookModal');
                this.updateAllDashboard();
            } else {
                this.showAlert('Failed to add book', 'danger');
            }
        } catch (error) {
            this.showAlert('Error adding book: ' + error.message, 'danger');
        }
    },

    /**
     * Handle adding a new user
     */
    handleAddUser() {
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const userId = document.getElementById('userID').value.trim();
        const type = document.getElementById('userType').value;
        const maxBooks = parseInt(document.getElementById('maxBooks').value);

        // Validation
        if (!name || !email || !userId || !type) {
            this.showAlert('Please fill in all required fields', 'danger');
            return;
        }

        try {
            const user = new LibraryUser(name, email, userId, type, maxBooks);

            if (library.addUser(user)) {
                this.showAlert(`User "${name}" registered successfully!`, 'success');
                document.getElementById('addUserForm').reset();
                this.closeModal('addUserModal');
                this.updateAllDashboard();
            } else {
                this.showAlert('User ID already exists or invalid user data', 'danger');
            }
        } catch (error) {
            this.showAlert('Error registering user: ' + error.message, 'danger');
        }
    },

    /**
     * Handle borrowing a book
     */
    handleBorrowBook() {
        const userId = document.getElementById('borrowUser').value;
        const bookId = document.getElementById('borrowBook').value;
        const borrowDateVal = document.getElementById('borrowDate') ? document.getElementById('borrowDate').value : null;
        const expectedReturnVal = document.getElementById('expectedReturnDate') ? document.getElementById('expectedReturnDate').value : null;

        if (!userId || !bookId) {
            this.showAlert('Please select both user and book', 'danger');
            return;
        }

        const result = library.borrowBook(userId, bookId, borrowDateVal, expectedReturnVal);

        if (result.success) {
            this.showAlert(result.message, 'success');
            document.getElementById('borrowForm').reset();
            this.closeModal('borrowModal');
            this.updateAllDashboard();
        } else {
            this.showAlert(result.message, 'danger');
        }
    },

    /**
     * Handle returning a book
     */
    handleReturnBook() {
        const recordValue = document.getElementById('returnBook').value;

        if (!recordValue) {
            this.showAlert('Please select a book to return', 'danger');
            return;
        }

        const [userId, bookId] = recordValue.split('|');
        const result = library.returnBook(userId, bookId);

        if (result.success) {
            this.showAlert(result.message, 'success');
            document.getElementById('returnForm').reset();
            this.closeModal('returnModal');
            this.updateAllDashboard();
        } else {
            this.showAlert(result.message, 'danger');
        }
    },

    // ========== SEARCH & FILTER ==========

    /**
     * Setup search and filter event listeners
     */
    setupSearchFilters() {
        // Book catalog search
        document.getElementById('searchBooks').addEventListener('keyup', () => {
            this.renderCatalog();
        });

        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.renderCatalog();
        });

        document.getElementById('filterBtn').addEventListener('click', () => {
            this.renderCatalog();
        });

        // User search
        document.getElementById('searchUsers').addEventListener('keyup', () => {
            this.renderUsers();
        });

        document.getElementById('searchUserBtn').addEventListener('click', () => {
            this.renderUsers();
        });
    },

    /**
     * Setup delegated action buttons for dynamic content
     */
    setupActionButtons() {
        const usersList = document.getElementById('usersList');
        if (usersList) {
            usersList.addEventListener('click', (e) => {
                const button = e.target.closest('.view-user-btn');
                if (button) {
                    e.preventDefault();
                    this.handleViewUserDetails(button.dataset.userId);
                }
            });
        }

        const borrowedList = document.getElementById('borrowedList');
        if (borrowedList) {
            borrowedList.addEventListener('click', (e) => {
                const button = e.target.closest('.quick-return-btn');
                if (button) {
                    e.preventDefault();
                    this.handleQuickReturnBook(button.dataset.userId, button.dataset.bookId);
                }
            });
        }
    },

    /**
     * Show detailed user info
     * @param {string} userId
     */
    handleViewUserDetails(userId) {
        const user = library.getUserById(userId);
        if (!user) {
            this.showAlert('User not found', 'danger');
            return;
        }

        const borrowed = user.getActiveBorrowedBooks();
        let details = `User Details:\n──────────────────────\nName: ${user.name}\nID: ${user.id}\nType: ${user.type}\nEmail: ${user.email}\nMax Books: ${user.maxBooks}\nCurrently Borrowed: ${borrowed.length}\nTotal Fines: ₱${user.getTotalFine().toFixed(2)}`;

        if (borrowed.length > 0) {
            details += `\n\nBorrowed Books:\n──────────────────────`;
            borrowed.forEach((b, index) => {
                details += `\n${index + 1}. ${b.book.title}\n   Due: ${b.dueDate.toLocaleDateString()}\n   Overdue: ${b.dueDate < new Date() ? 'Yes' : 'No'}`;
            });
        }

        alert(details);
    },

    /**
     * Return a book using the quick return button
     * @param {string} userId
     * @param {string} bookId
     */
    handleQuickReturnBook(userId, bookId) {
        if (confirm('Are you sure you want to return this book?')) {
            const result = library.returnBook(userId, bookId);
            this.showAlert(result.message, result.success ? 'success' : 'danger');
            if (result.success) {
                this.updateAllDashboard();
            }
        }
    },

    /**
     * Populate borrow form with available books
     */
    populateBorrowForm() {
        const userSelect = document.getElementById('borrowUser');
        const bookSelect = document.getElementById('borrowBook');
        const borrowDateInput = document.getElementById('borrowDate');
        const expectedReturnInput = document.getElementById('expectedReturnDate');

        // Clear previous options
        userSelect.innerHTML = '<option value="">-- Select User --</option>';
        bookSelect.innerHTML = '<option value="">-- Select Book --</option>';

        // Populate users
        library.getUsers().forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.name} (${user.type})`;
            userSelect.appendChild(option);
        });

        // Populate available books
        library.getBooks().forEach(book => {
            let available = false;

            if (book.type === 'PrintedBook') {
                available = book.availableCopies > 0;
            } else if (book.type === 'EBook') {
                available = book.currentUsers.length < book.maxSimultaneousUsers;
            } else {
                available = book.isAvailable;
            }

            if (available) {
                const option = document.createElement('option');
                option.value = book.id;
                option.textContent = `${book.title} - ${book.author} (${book.type})`;
                bookSelect.appendChild(option);
            }
        });

        // Set default borrow date to today
        if (borrowDateInput) {
            const today = new Date();
            borrowDateInput.value = today.toISOString().slice(0,10);
        }

        // Update expected return date when book or borrow date changes
        const updateExpectedReturn = () => {
            if (!borrowDateInput || !expectedReturnInput || !bookSelect) return;
            const borrowDateVal = borrowDateInput.value;
            const selectedBookId = bookSelect.value;
            if (!borrowDateVal || !selectedBookId) return;
            const book = library.getBookById(selectedBookId);
            if (!book) return;
            const borrowDate = new Date(borrowDateVal);
            const dueDate = new Date(borrowDate);
            dueDate.setDate(dueDate.getDate() + (book.loanDuration || 0));
            expectedReturnInput.value = dueDate.toISOString().slice(0,10);
        };

        if (bookSelect) bookSelect.addEventListener('change', updateExpectedReturn);
        if (borrowDateInput) borrowDateInput.addEventListener('change', updateExpectedReturn);
    },

    /**
     * Populate return form with borrowed books
     */
    populateReturnForm() {
        const returnSelect = document.getElementById('returnBook');
        returnSelect.innerHTML = '<option value="">-- Select Book to Return --</option>';

        const borrowed = library.getBorrowedRecords();
        borrowed.forEach(item => {
            const option = document.createElement('option');
            option.value = `${item.user.id}|${item.record.book.id}`;
            const dueDate = new Date(item.record.dueDate);
            option.textContent = `${item.record.book.title} - ${item.user.name} (Due: ${dueDate.toLocaleDateString()})`;
            returnSelect.appendChild(option);
        });
    },

    // ========== RENDERING FUNCTIONS ==========

    /**
     * Render dashboard with statistics
     */
    updateAllDashboard() {
        this.renderDashboardStats();
        this.renderActivityLog();
        this.renderCatalog();
        this.renderUsers();
        this.renderBorrowedBooks();
        this.renderRecords();
    },

    /**
     * Update dashboard statistics
     */
    renderDashboardStats() {
        document.getElementById('totalBooks').textContent = library.getTotalBooks();
        document.getElementById('availableBooks').textContent = library.getAvailableBooks();
        document.getElementById('borrowedBooksCount').textContent = library.getBorrowedBooks();
        document.getElementById('totalUsers').textContent = library.getTotalUsers();
        document.getElementById('activeBorrowers').textContent = library.getActiveBorrowers();
        document.getElementById('totalFines').textContent = `₱${library.getTotalFines().toFixed(2)}`;
        document.getElementById('overdueCount').textContent = library.getOverdueBooks();
    },

    /**
     * Render activity log
     */
    renderActivityLog() {
        const activityList = document.getElementById('activityLog');
        const activities = library.getActivities();

        if (activities.length === 0) {
            activityList.innerHTML = '<div class="empty-message">No activities yet</div>';
            return;
        }

        activityList.innerHTML = activities.map(activity => {
            const timeStr = activity.timestamp.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            return `
                <div class="activity-item">
                    <div class="activity-text">
                        <div class="activity-message">${activity.message}</div>
                        <div class="activity-time">${timeStr}</div>
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Render book catalog with filters
     */
    renderCatalog() {
        const searchTerm = document.getElementById('searchBooks').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;

        const books = library.searchBooks(searchTerm, category);
        const catalogGrid = document.getElementById('catalogGrid');

        if (books.length === 0) {
            catalogGrid.innerHTML = '<div class="no-data">No books found</div>';
            return;
        }

        catalogGrid.innerHTML = books.map(book => {
            const availabilityStatus = book.getAvailabilityStatus();
            const badgeClass = book.isAvailable ? 'badge-available' : 'badge-borrowed';
            const typeClass = book.type === 'EBook' ? 'badge-ebook' : 'badge-printed';

            return `
                <div class="book-card">
                    <div class="book-badges">
                        <span class="badge ${typeClass}">${book.type === 'EBook' ? 'E-Book' : 'Printed'}</span>
                        <span class="badge ${badgeClass}">${book.isAvailable ? 'Available' : 'Borrowed'}</span>
                    </div>
                    <h3>${this.escapeHtml(book.title)}</h3>
                    <div class="book-meta">
                        <strong>Author:</strong>
                        <span>${this.escapeHtml(book.author)}</span>
                    </div>
                    <div class="book-meta">
                        <strong>ISBN:</strong>
                        <span>${this.escapeHtml(book.isbn)}</span>
                    </div>
                    <div class="book-meta">
                        <strong>Category:</strong>
                        <span>${book.category}</span>
                    </div>
                    <div class="book-meta">
                        <strong>Available:</strong>
                        <span>${availabilityStatus}</span>
                    </div>
                    <div class="book-meta">
                        <strong>Loan Duration:</strong>
                        <span>${book.loanDuration} days</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Render users table
     */
    renderUsers() {
        const searchTerm = document.getElementById('searchUsers').value;
        const users = library.searchUsers(searchTerm);
        const usersList = document.getElementById('usersList');

        if (users.length === 0) {
            usersList.innerHTML = '<tr><td colspan="7" class="empty-message">No users found</td></tr>';
            return;
        }

        usersList.innerHTML = users.map(user => {
            const borrowed = user.getActiveBorrowedBooks().length;
            const fine = user.getTotalFine();

            return `
                <tr>
                    <td>${this.escapeHtml(user.name)}</td>
                    <td>${user.id}</td>
                    <td>${user.type}</td>
                    <td>${this.escapeHtml(user.email)}</td>
                    <td>${borrowed}/${user.maxBooks}</td>
                    <td>₱${fine.toFixed(2)}</td>
                    <td>
                        <button type="button" class="btn btn-primary btn-small view-user-btn" data-user-id="${user.id}">Details</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    /**
     * Render borrowed books table
     */
    renderBorrowedBooks() {
        const borrowed = library.getBorrowedRecords();
        const borrowedList = document.getElementById('borrowedList');

        if (borrowed.length === 0) {
            borrowedList.innerHTML = '<tr><td colspan="7" class="empty-message">No borrowed books</td></tr>';
            return;
        }

        borrowedList.innerHTML = borrowed.map(item => {
            const record = item.record;
            const today = new Date();
            const borrowDate = new Date(record.borrowDate);
            const dueDate = new Date(record.dueDate);
            const isOverdue = dueDate < today;
            const statusClass = isOverdue ? 'status-overdue' : 'status-active';
            const statusText = isOverdue ? 'Overdue' : 'Active';

            const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

            return `
                <tr>
                    <td>${this.escapeHtml(record.book.title)}</td>
                    <td>${this.escapeHtml(item.user.name)}</td>
                    <td>${borrowDate.toLocaleDateString()}</td>
                    <td>${dueDate.toLocaleDateString()}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>${daysLeft > 0 ? daysLeft : 'Overdue by ' + Math.abs(daysLeft) + ' days'}</td>
                    <td>
                        <button type="button" class="btn btn-warning btn-small quick-return-btn" data-user-id="${item.user.id}" data-book-id="${record.book.id}">Return</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    /**
     * Render all borrowing records
     */
    renderRecords() {
        const records = library.getAllRecords();
        const recordsList = document.getElementById('recordsList');

        if (records.length === 0) {
            recordsList.innerHTML = '<tr><td colspan="7" class="empty-message">No records</td></tr>';
            return;
        }

        recordsList.innerHTML = records.map(item => {
            const record = item.record;
            const borrowDate = new Date(record.borrowDate);
            const returnDate = record.returnDate ? new Date(record.returnDate) : new Date();

            const daysBorrowed = Math.floor((returnDate - borrowDate) / (1000 * 60 * 60 * 24));
            const fine = record.fine || 0;
            const status = record.returned ? 'Returned' : 'Active';

            return `
                <tr>
                    <td>${this.escapeHtml(record.book.title)}</td>
                    <td>${this.escapeHtml(item.user.name)}</td>
                    <td>${borrowDate.toLocaleDateString()}</td>
                    <td>${record.returnDate ? new Date(record.returnDate).toLocaleDateString() : 'N/A'}</td>
                    <td>${daysBorrowed}</td>
                    <td>${fine > 0 ? '₱' + fine.toFixed(2) : '-'}</td>
                    <td><span class="status-badge status-${record.returned ? 'returned' : 'active'}">${status}</span></td>
                </tr>
            `;
        }).join('');
    },

    /**
     * Show alert message
     * @param {string} message - Alert message
     * @param {string} type - Alert type (success, danger, warning, info)
     */
    showAlert(message, type = 'info') {
        const alertBox = document.getElementById('alertBox');
        alertBox.textContent = message;
        alertBox.className = `alert show alert-${type}`;

        setTimeout(() => {
            alertBox.classList.remove('show');
        }, 4000);
    },

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize sample data
 */
function initializeSampleData() {
    // Sample Books
    library.addBook(new PrintedBook('The Great Gatsby', 'F. Scott Fitzgerald', 'ISBN001', 'Fiction', 14, 3));
    library.addBook(new EBook('1984', 'George Orwell', 'ISBN002', 'Fiction', 7));
    library.addBook(new PrintedBook('A Brief History of Time', 'Stephen Hawking', 'ISBN003', 'Science', 21, 2));
    library.addBook(new PrintedBook('The Code Breaker', 'Walter Isaacson', 'ISBN004', 'Biography', 14, 1));
    library.addBook(new EBook('Clean Code', 'Robert Martin', 'ISBN005', 'Technology', 7));
    library.addBook(new PrintedBook('Sapiens', 'Yuval Noah Harari', 'ISBN006', 'History', 21, 2));
    library.addBook(new EBook('Python Mastery', 'Mark Lutz', 'ISBN007', 'Technology', 14));
    // Added books from user request
    library.addBook(new PrintedBook('To Kill a Mockingbird', 'Harper Lee', 'ISBN008', 'Classic Fiction, Southern Gothic, Drama', 14, 4));
    library.addBook(new PrintedBook('The Hobbit', 'J.R.R. Tolkien', 'ISBN009', 'High Fantasy, Adventure', 14, 4));
    library.addBook(new PrintedBook('Dune', 'Frank Herbert', 'ISBN010', 'Science Fiction, Space Opera', 21, 3));
    library.addBook(new PrintedBook('Educated', 'Tara Westover', 'ISBN011', 'Memoir, Autobiography', 14, 3));
    library.addBook(new PrintedBook('Atomic Habits', 'James Clear', 'ISBN012', 'Self-Help, Personal Development', 14, 3));
    library.addBook(new PrintedBook('Thinking, Fast and Slow', 'Daniel Kahneman', 'ISBN013', 'Psychology, Behavioral Economics', 14, 2));
    library.addBook(new PrintedBook('The Silent Patient', 'Alex Michaelides', 'ISBN014', 'Psychological Thriller, Mystery', 14, 2));
    library.addBook(new PrintedBook('Project Hail Mary', 'Andy Weir', 'ISBN015', 'Hard Science Fiction, Sci-Fi Adventure', 14, 3));
    library.addBook(new PrintedBook('Crying in H Mart', 'Michelle Zauner', 'ISBN016', 'Memoir, Biography, Food Writing', 14, 2));
    library.addBook(new PrintedBook('Pride and Prejudice', 'Jane Austen', 'ISBN017', 'Classic Romance, Satire', 14, 3));
    library.addBook(new PrintedBook('Bad Blood: Secrets and Lies in a Silicon Valley Startup', 'John Carreyrou', 'ISBN018', 'True Crime, Business, Investigative Journalism', 14, 2));
    library.addBook(new PrintedBook('The Midnight Library', 'Matt Haig', 'ISBN019', 'Contemporary Fantasy, Philosophical Fiction', 14, 3));

    // Sample Users
    library.addUser(new LibraryUser('Alice Johnson', 'alice@university.edu', 'STU001', 'Student', 5));
    library.addUser(new LibraryUser('Bob Smith', 'bob@university.edu', 'STU002', 'Student', 5));
    library.addUser(new LibraryUser('Dr. Carol White', 'carol@university.edu', 'FAC001', 'Faculty', 10));
    library.addUser(new LibraryUser('David Brown', 'david@university.edu', 'STAFF001', 'Staff', 7));

    // Sample Borrowings
    library.borrowBook('STU001', library.getBooks()[0].id);
    library.borrowBook('STU002', library.getBooks()[2].id);
    library.borrowBook('FAC001', library.getBooks()[1].id);
}

/**
 * Start the application
 */
function startApplication() {
    try {
        initializeSampleData();
        UIManager.init();
        UIManager.showAlert('Library Management System loaded successfully!', 'success');
    } catch (error) {
        console.error('Error starting application:', error);
        UIManager.showAlert('Error loading application: ' + error.message, 'danger');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', startApplication);