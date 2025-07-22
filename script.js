// Elements
const salaryInputs = document.querySelectorAll('.salary-input');
const totalSalaryDisplay = document.getElementById('total-salary');
const expenseName = document.getElementById('expense-name');
const expenseAmount = document.getElementById('expense-amount');
const addExpenseBtn = document.getElementById('add-expense');
const expenseList = document.getElementById('expense-list');
const totalExpensesDisplay = document.getElementById('total-expenses');
const remainingBalanceDisplay = document.getElementById('remaining-balance');
const saveAmount = document.getElementById('save-amount');
const saveBtn = document.getElementById('save-btn');
const goalBtn = document.getElementById('goal-btn');

let totalSalary = 0;
let totalExpenses = 0;
let saved = 0;

function calculateTotalSalary() {
  totalSalary = 0;
  salaryInputs.forEach(input => {
    totalSalary += Number(input.value || 0);
  });
  totalSalaryDisplay.textContent = `₱ ${totalSalary.toLocaleString()}`;
  updateBalance();
}

function addExpense() {
  const name = expenseName.value.trim();
  const amount = parseFloat(expenseAmount.value);

  if (!name || isNaN(amount) || amount <= 0) return;

  const row = document.createElement('div');
  row.classList.add('expense-row');
  row.innerHTML = `
    <span>${name}</span>
    <span>₱ ${amount.toLocaleString()}</span>
  `;
  expenseList.appendChild(row);

  totalExpenses += amount;
  updateTotals();

  // Reset
  expenseName.value = '';
  expenseAmount.value = '';
}

function updateTotals() {
  totalExpensesDisplay.textContent = `₱ ${totalExpenses.toLocaleString()}`;
  updateBalance();
}

function updateBalance() {
  const balance = totalSalary - totalExpenses - saved;
  remainingBalanceDisplay.textContent = `₱ ${balance.toLocaleString()}`;
  renderChart();
}

function saveMoney() {
  const amount = parseFloat(saveAmount.value);
  if (isNaN(amount) || amount <= 0 || amount > totalSalary - totalExpenses - saved) return;

  saved += amount;
  saveAmount.value = '';
  updateBalance();
}

function renderChart() {
  if (!window.myChart) {
    const ctx = document.getElementById('expense-chart').getContext('2d');
    window.myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Expenses', 'Savings', 'Remaining'],
        datasets: [{
          label: 'Budget Breakdown',
          data: [totalExpenses, saved, totalSalary - totalExpenses - saved],
          backgroundColor: ['#e63946', '#f1c40f', '#2ecc71'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: 'white' }
          }
        }
      }
    });
  } else {
    window.myChart.data.datasets[0].data = [totalExpenses, saved, totalSalary - totalExpenses - saved];
    window.myChart.update();
  }
}

// Event listeners
salaryInputs.forEach(input => input.addEventListener('input', calculateTotalSalary));
addExpenseBtn.addEventListener('click', addExpense);
saveBtn.addEventListener('click', saveMoney);

// Optional: goal animation
goalBtn.addEventListener('click', () => {
  goalBtn.style.backgroundColor = 'gold';
  setTimeout(() => {
    goalBtn.style.backgroundColor = '#333';
  }, 200);
});

// Initialize
calculateTotalSalary();
