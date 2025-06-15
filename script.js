// DOM Elements
const form = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const typeSelect = document.getElementById('type');
const balanceDisplay = document.getElementById('balance');
const transactionsContainer = document.getElementById('transactions-container');
const filterSelect = document.getElementById('filter');

// New filter inputs
const searchInput = document.getElementById('search');
const filterDateInput = document.getElementById('filter-date');
const amountRangeInput = document.getElementById('amount-range');

// Global Variables
let transactions = [];
let filterType = 'all'; // default filter

// Load transactions from localStorage
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('transactions');
  if (saved) {
    transactions = JSON.parse(saved);
    renderTransactions();
  }
});

// Save transactions to localStorage
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

// Filter event listeners
filterSelect.addEventListener('change', () => {
  filterType = filterSelect.value;
  renderTransactions();
});

searchInput.addEventListener('input', renderTransactions);
filterDateInput.addEventListener('change', renderTransactions);
amountRangeInput.addEventListener('input', renderTransactions);

// Render filtered transactions
function renderTransactions() {
  transactionsContainer.innerHTML = '';

  const filtered = transactions.filter(tx => {
    const matchesType = filterType === 'all' || tx.type === filterType;

    const searchTerm = searchInput.value.trim().toLowerCase();
    const matchesSearch = !searchTerm || tx.description.toLowerCase().includes(searchTerm);

    const selectedDate = filterDateInput.value;
    const matchesDate = !selectedDate || tx.date === selectedDate;

    const maxAmount = parseFloat(amountRangeInput.value);
    const matchesAmount = isNaN(maxAmount) || tx.amount <= maxAmount;

    return matchesType && matchesSearch && matchesDate && matchesAmount;
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
        ${tx.type === 'income' ? '+' : '-'} RWF ${tx.amount.toFixed(2)}
      </div>
      <div class="transaction-actions">
        <button class="edit-btn" onclick="editTransaction(${index})">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
</svg>

        </button>
        <button class="delete-btn" onclick="deleteTransaction(${index})">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
</svg>

        </button>
      </div>
    `;

    transactionsContainer.appendChild(div);
  });

  updateBalance();
}

// Update balance summary
function updateBalance() {
  const income = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const expense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  balanceDisplay.textContent = `RWF ${(income - expense).toFixed(2)}`;
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

  descriptionInput.value = tx.description;
  amountInput.value = tx.amount;
  dateInput.value = tx.date;
  typeSelect.value = tx.type;

  transactions.splice(index, 1);
  saveToLocalStorage();
  renderTransactions();
}
