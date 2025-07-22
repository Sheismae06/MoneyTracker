// Initialization
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('expense-form');
  const addMoreBtn = document.getElementById('add-more');
  const dateInput = document.getElementById('date');
  const trackList = document.getElementById('track-list');
  const totalDisplay = document.getElementById('total');
  const filterBtn = document.getElementById('filterBtn');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');

  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

  // Render all expenses at start
  renderExpenses();

  // Recalculate total whenever fields change
  form.addEventListener('input', updateTotal);

  // Add new expense row
  addMoreBtn.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'expense-row';
    row.innerHTML = `
      <input type="text" class="description" placeholder="Description" required />
      <input type="number" class="amount" placeholder="Amount" required />
    `;
    document.getElementById('expense-fields').appendChild(row);
  });

  // Save expenses
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedDate = dateInput.value;
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }

    const rows = document.querySelectorAll('.expense-row');
    rows.forEach(row => {
      const desc = row.querySelector('.description').value.trim();
      const amount = parseFloat(row.querySelector('.amount').value);
      if (desc && !isNaN(amount)) {
        expenses.push({
          date: selectedDate,
          description: desc,
          amount: amount
        });
      }
    });

    localStorage.setItem('expenses', JSON.stringify(expenses));
    alert('Saved successfully!');
    form.reset();
    document.getElementById('expense-fields').innerHTML = `
      <div class="expense-row">
        <input type="text" class="description" placeholder="Description" required />
        <input type="number" class="amount" placeholder="Amount" required />
      </div>
    `;
    updateTotal();
    renderExpenses();
  });

  // Update total
  function updateTotal() {
    const amounts = document.querySelectorAll('.amount');
    let total = 0;
    amounts.forEach(input => {
      const val = parseFloat(input.value);
      if (!isNaN(val)) total += val;
    });
    totalDisplay.textContent = total.toFixed(2);
  }

  // Filter by date range
  filterBtn.addEventListener('click', () => {
    const start = new Date(startDateInput.value);
    const end = new Date(endDateInput.value);
    if (!startDateInput.value || !endDateInput.value) {
      alert('Please select both start and end date.');
      return;
    }

    const filtered = expenses.filter(e => {
      const expDate = new Date(e.date);
      return expDate >= start && expDate <= end;
    });

    renderExpenses(filtered);
  });

  // Render function
  function renderExpenses(filteredData = expenses) {
    trackList.innerHTML = '';
    if (filteredData.length === 0) {
      trackList.innerHTML = '<p>No expenses found.</p>';
      return;
    }

    filteredData.forEach((entry, index) => {
      const div = document.createElement('div');
      div.className = 'track-entry';
      div.innerHTML = `
        <strong>${entry.date}</strong> - ${entry.description}: PHP ${entry.amount.toFixed(2)}
        <button onclick="deleteEntry(${index})">🗑️ Delete</button>
        <button onclick="editEntry(${index})">✏️ Edit</button>
      `;
      trackList.appendChild(div);
    });
  }

  // Delete function
  window.deleteEntry = function(index) {
    if (confirm('Are you sure you want to delete this entry?')) {
      expenses.splice(index, 1);
      localStorage.setItem('expenses', JSON.stringify(expenses));
      renderExpenses();
    }
  };

  // Edit function
  window.editEntry = function(index) {
    const newDesc = prompt('Edit description:', expenses[index].description);
    const newAmount = prompt('Edit amount:', expenses[index].amount);
    if (newDesc !== null && newAmount !== null && !isNaN(parseFloat(newAmount))) {
      expenses[index].description = newDesc.trim();
      expenses[index].amount = parseFloat(newAmount);
      localStorage.setItem('expenses', JSON.stringify(expenses));
      renderExpenses();
    }
  };
});
