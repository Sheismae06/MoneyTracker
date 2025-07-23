// Load saved data on page load
let savedExpenses = JSON.parse(localStorage.getItem('expenses')) || {};

// Real-time total computation
function updateTotal() {
  const amounts = document.querySelectorAll('.amount');
  let total = 0;
  amounts.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) total += value;
  });
  document.getElementById('total').textContent = total.toFixed(2);
}

// Add dynamic input row
document.getElementById('add-more').addEventListener('click', () => {
  const row = document.createElement('div');
  row.className = 'expense-row';
  row.innerHTML = `
    <input type="text" class="description" placeholder="Description" required />
    <input type="number" class="amount" placeholder="Amount" required />
  `;
  document.getElementById('expense-fields').appendChild(row);
});

// Save data on form submit
document.getElementById('expense-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const date = document.getElementById('date').value;
  if (!date) return alert("Please select a date.");

  const descriptions = document.querySelectorAll('.description');
  const amounts = document.querySelectorAll('.amount');

  const entries = [];
  for (let i = 0; i < descriptions.length; i++) {
    const desc = descriptions[i].value.trim();
    const amt = parseFloat(amounts[i].value);
    if (desc && !isNaN(amt)) {
      entries.push({ description: desc, amount: amt });
    }
  }

  if (entries.length > 0) {
    savedExpenses[date] = entries;
    localStorage.setItem('expenses', JSON.stringify(savedExpenses));
    alert("Saved successfully!");
    document.getElementById('expense-form').reset();
    document.getElementById('expense-fields').innerHTML = `
      <div class="expense-row">
        <input type="text" class="description" placeholder="Description" required />
        <input type="number" class="amount" placeholder="Amount" required />
      </div>
    `;
    updateTotal();
  }
});

// Real-time total when editing
document.addEventListener('input', (e) => {
  if (e.target.classList.contains('amount')) {
    updateTotal();
  }
});

// Filter date range
document.getElementById('filterBtn').addEventListener('click', () => {
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;

  if (!start || !end) {
    alert("Please select both start and end date.");
    return;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);
  const trackList = document.getElementById('track-list');
  trackList.innerHTML = '';

  const sortedDates = Object.keys(savedExpenses).sort();

  sortedDates.forEach(date => {
    const current = new Date(date);
    if (current >= startDate && current <= endDate) {
      const entryDiv = document.createElement('div');
      entryDiv.className = 'track-entry';
      entryDiv.innerHTML = `<h3>${date}</h3>`;
      savedExpenses[date].forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = `• ${item.description} - PHP ${item.amount.toFixed(2)}`;
        entryDiv.appendChild(itemDiv);
      });
      trackList.appendChild(entryDiv);
    }
  });

  if (trackList.innerHTML === '') {
    trackList.innerHTML = "<p>No records found in selected range.</p>";
  }
});
