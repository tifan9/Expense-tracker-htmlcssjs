// DOM Elements
const form = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const typeSelect = document.getElementById('type');
const balanceDisplay = document.getElementById('balance');
const transactionsContainer = document.getElementById('transactions-container');
const filterSelect = document.getElementById('filter');

// Global Variables
let transactions = [];
let filterType = 'all'; // default filter

// Load transactions from localStorage on startup
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('transactions');
    if (saved) {
        transactions = JSON.parse(saved);
        renderTransactions();
    }
});

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const transaction = {
        description: descriptionInput.value.trim(),
        amount: parseFloat(amountInput.value),
        date: dateInput.value,
        type: typeSelect.value
    };

    if (!transaction.description || isNaN(transaction.amount) || !transaction.date) return;

    transactions.push(transaction);
    saveToLocalStorage();
    form.reset();
    renderTransactions();
});

// Handle filter change
filterSelect.addEventListener('change', () => {
    filterType = filterSelect.value;
    renderTransactions();
});

// Render transactions
function renderTransactions() {
    transactionsContainer.innerHTML = '';

    const filtered = transactions.filter(tx => {
        return filterType === 'all' || tx.type === filterType;
    });

    filtered.forEach((tx, index) => {
        const div = document.createElement('div');
        div.className = `transaction ${tx.type}`;

        div.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-description">${tx.description}</div>
                <div class="transaction-date">${tx.date}</div>
            </div>
            <div class="transaction-amount ${tx.type === 'income' ? 'transaction-income' : 'transaction-expense'}">
                ${tx.type === 'income' ? '+' : '-'} RWF${tx.amount.toFixed(2)}
            </div>
            <div class="transaction-actions">
                <button class="edit-btn" onclick="editTransaction(${index})">✏️</button>
                <button class="delete-btn" onclick="deleteTransaction(${index})">🗑️</button>
            </div>
        `;

        transactionsContainer.appendChild(div);
    });

    updateBalance();
}

// Update balance display
function updateBalance() {
    const income = transactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const expense = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);

    balanceDisplay.textContent = `RWF${(income - expense).toFixed(2)}`;
}

// Delete transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveToLocalStorage();
    renderTransactions();
}

// Edit transaction
function editTransaction(index) {
    const tx = transactions[index];

    // Prefill form
    descriptionInput.value = tx.description;
    amountInput.value = tx.amount;
    dateInput.value = tx.date;
    typeSelect.value = tx.type;

    // Remove transaction temporarily
    transactions.splice(index, 1);
    saveToLocalStorage();
    renderTransactions();
}
