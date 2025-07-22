document.addEventListener('DOMContentLoaded', () => {
  const trackDate = document.getElementById('trackDate');
  const expenseListContainer = document.getElementById('expenseListContainer');
  const addExpenseBtn = document.getElementById('addExpenseBtn');
  const saveBtn = document.getElementById('saveBtn');
  const historyList = document.getElementById('historyList');
  const totalAmountDisplay = document.getElementById('totalAmount');
  const confirmationMsg = document.getElementById('confirmationMsg');

  // Set default date to today
  trackDate.valueAsDate = new Date();

  // Add new expense row
  addExpenseBtn.addEventListener('click', () => {
    addExpenseRow();
    computeTotal();
  });

  // Save button logic
  saveBtn.addEventListener('click', () => {
    const selectedDate = trackDate.value;
    const expenses = [];

    const items = expenseListContainer.querySelectorAll('.expense-item');
    items.forEach(item => {
      const desc = item.querySelector('.desc').value.trim();
      const amount = parseFloat(item.querySelector('.amount').value);
      if (desc && !isNaN(amount)) {
        expenses.push({ desc, amount });
      }
    });

    if (expenses.length === 0) return;

    localStorage.setItem(`expenses-${selectedDate}`, JSON.stringify(expenses));
    showConfirmation();
    loadHistory();
  });

  // Load expenses for selected date
  trackDate.addEventListener('change', () => {
    loadExpensesForDate(trackDate.value);
  });

  // Compute total when typing
  expenseListContainer.addEventListener('input', () => {
    computeTotal();
  });

  // Load saved tracks on page load
  loadExpensesForDate(trackDate.value);
  loadHistory();

  function addExpenseRow(desc = '', amount = '') {
    const div = document.createElement('div');
    div.className = 'expense-item';

    div.innerHTML = `
      <input type="text" class="desc" placeholder="Description" value="${desc}"/>
      <input type="number" class="amount" placeholder="Amount" value="${amount}"/>
      <button class="remove-btn">✖</button>
    `;

    div.querySelector('.remove-btn').addEventListener('click', () => {
      div.remove();
      computeTotal();
    });

    expenseListContainer.appendChild(div);
  }

  function computeTotal() {
    let total = 0;
    const amounts = expenseListContainer.querySelectorAll('.amount');
    amounts.forEach(input => {
      const val = parseFloat(input.value);
      if (!isNaN(val)) {
        total += val;
      }
    });
    totalAmountDisplay.textContent = total.toFixed(2);
  }

  function showConfirmation() {
    confirmationMsg.classList.remove('hidden');
    setTimeout(() => {
      confirmationMsg.classList.add('hidden');
    }, 1500);
  }

  function loadExpensesForDate(date) {
    expenseListContainer.innerHTML = '';
    const saved = localStorage.getItem(`expenses-${date}`);
    if (saved) {
      const expenses = JSON.parse(saved);
      expenses.forEach(exp => {
        addExpenseRow(exp.desc, exp.amount);
      });
    } else {
      addExpenseRow(); // Start with one blank row
    }
    computeTotal();
  }

  function loadHistory() {
    historyList.innerHTML = '';
    const keys = Object.keys(localStorage).filter(key => key.startsWith('expenses-'));
    keys.sort().reverse();

    keys.forEach(key => {
      const date = key.replace('expenses-', '');
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${date}</strong>
        <button class="load">View</button>
        <button class="delete">🗑</button>
      `;

      li.querySelector('.load').addEventListener('click', () => {
        trackDate.value = date;
        loadExpensesForDate(date);
      });

      li.querySelector('.delete').addEventListener('click', () => {
        if (confirm(`Delete saved data for ${date}?`)) {
          localStorage.removeItem(key);
          loadHistory();
        }
      });

      historyList.appendChild(li);
    });
  }
});
