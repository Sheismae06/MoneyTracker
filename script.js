// Date Selects
function populateSelects() {
  const months = [...Array(12)].map((_, i) => new Option(new Date(0, i).toLocaleString('default', { month: 'long' }), i + 1));
  const days = [...Array(31)].map((_, i) => new Option(`Day ${i + 1}`, i + 1));
  const years = [...Array(976)].map((_, i) => new Option(2025 + i, 2025 + i));

  document.getElementById('month').append(...months);
  document.getElementById('day').append(...days);
  document.getElementById('year').append(...years);
}
populateSelects();

// Salary Calculation
function updateTotalSalary() {
  const c1 = parseFloat(document.getElementById('cutoff1').value) || 0;
  const c2 = parseFloat(document.getElementById('cutoff2').value) || 0;
  document.getElementById('totalSalary').value = c1 + c2;
  updateBalance();
}

// Expenses
function addExpenseItem(desc = '', amt = '') {
  const container = document.getElementById('expenses-container');
  const div = document.createElement('div');
  div.className = 'expense-item';
  div.innerHTML = `
    <input type="text" placeholder="Description" class="desc" value="${desc}">
    <input type="number" placeholder="Amount" class="amt" value="${amt}">
  `;
  container.appendChild(div);
  updateTotalExpenses();
}

function updateTotalExpenses() {
  const amounts = [...document.querySelectorAll('.amt')].map(input => parseFloat(input.value) || 0);
  const total = amounts.reduce((a, b) => a + b, 0);
  document.getElementById('totalExpenses').textContent = total.toFixed(2);
  updateBalance();
  updateChart();
}

// Balance
function updateBalance() {
  const salary = parseFloat(document.getElementById('totalSalary').value) || 0;
  const expenses = parseFloat(document.getElementById('totalExpenses').textContent) || 0;
  document.getElementById('balance').textContent = (salary - expenses).toFixed(2);
}

// Chart
let chart;
function updateChart() {
  const ctx = document.getElementById('myChart').getContext('2d');
  const descs = [...document.querySelectorAll('.desc')].map(i => i.value);
  const amts = [...document.querySelectorAll('.amt')].map(i => parseFloat(i.value) || 0);

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: descs,
      datasets: [{
        data: amts,
        backgroundColor: amts.map((_, i) => `hsl(${i * 50}, 70%, 60%)`)
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

// Save/Load/Delete
function saveData() {
  const key = getSelectedDateKey();
  const data = {
    cutoff1: document.getElementById('cutoff1').value,
    cutoff2: document.getElementById('cutoff2').value,
    totalSalary: document.getElementById('totalSalary').value,
    expenses: [...document.querySelectorAll('.expense-item')].map(div => ({
      desc: div.querySelector('.desc').value,
      amt: div.querySelector('.amt').value
    }))
  };
  localStorage.setItem(key, JSON.stringify(data));
  alert('Data saved for selected date!');
}

function loadData() {
  const key = getSelectedDateKey();
  const data = JSON.parse(localStorage.getItem(key));
  if (!data) return alert('No saved data for this date.');

  document.getElementById('cutoff1').value = data.cutoff1;
  document.getElementById('cutoff2').value = data.cutoff2;
  document.getElementById('totalSalary').value = data.totalSalary;

  document.getElementById('expenses-container').innerHTML = '';
  data.expenses.forEach(item => addExpenseItem(item.desc, item.amt));

  updateTotalSalary();
  updateTotalExpenses();
}

function deleteData() {
  const key = getSelectedDateKey();
  localStorage.removeItem(key);
  alert('Data deleted for selected date!');
  location.reload();
}

function getSelectedDateKey() {
  const m = document.getElementById('month').value;
  const d = document.getElementById('day').value;
  const y = document.getElementById('year').value;
  return `tracker_${m}_${d}_${y}`;
}

// Event Listeners
document.getElementById('cutoff1').addEventListener('input', updateTotalSalary);
document.getElementById('cutoff2').addEventListener('input', updateTotalSalary);
document.getElementById('expenses-container').addEventListener('input', updateTotalExpenses);
document.getElementById('addExpense').addEventListener('click', () => addExpenseItem());
document.getElementById('saveBtn').addEventListener('click', saveData);
document.getElementById('loadBtn').addEventListener('click', loadData);
document.getElementById('deleteBtn').addEventListener('click', deleteData);

// Default 1 expense field
addExpenseItem();
