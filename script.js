const expenseForm = document.getElementById('expense-form');
const expenseFields = document.getElementById('expense-fields');
const addMoreBtn = document.getElementById('add-more');
const totalDisplay = document.getElementById('total');
const dateInput = document.getElementById('date');

const yearFilter = document.getElementById('yearFilter');
const monthFilter = document.getElementById('monthFilter');
const dayFilter = document.getElementById('dayFilter');
const filterBtn = document.getElementById('filterBtn');
const trackList = document.getElementById('track-list');

let currentExpenses = [];

function updateTotal() {
  const amounts = document.querySelectorAll('.amount');
  let total = 0;
  amounts.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) total += value;
  });
  totalDisplay.textContent = total.toFixed(2);
}

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function getDateKey(dateStr) {
  return `expenses-${dateStr}`;
}

function renderTrackList(data, dateKey) {
  trackList.innerHTML = '';

  if (!data.length) {
    trackList.innerHTML = `<p>No data for this date.</p>`;
    return;
  }

  data.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'track-item';
    div.innerHTML = `
      <div><strong>${item.description}</strong> - PHP ${parseFloat(item.amount).toFixed(2)}</div>
      <button class="edit" data-index="${index}" data-date="${dateKey}">✏️ Edit</button>
      <button class="delete" data-index="${index}" data-date="${dateKey}">🗑️ Delete</button>
    `;
    trackList.appendChild(div);
  });
}

function updateFiltersDropdowns() {
  // Reset
  yearFilter.innerHTML = '';
  monthFilter.innerHTML = '';
  dayFilter.innerHTML = '';

  // Year: 2025 to 3000
  for (let y = 2025; y <= 3000; y++) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearFilter.appendChild(opt);
  }

  // Month: 01 to 12
  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement('option');
    opt.value = m.toString().padStart(2, '0');
    opt.textContent = new Date(0, m - 1).toLocaleString('default', { month: 'long' });
    monthFilter.appendChild(opt);
  }

  // Day: 01 to 31
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement('option');
    opt.value = d.toString().padStart(2, '0');
    opt.textContent = d;
    dayFilter.appendChild(opt);
  }
}

addMoreBtn.addEventListener('click', () => {
  const row = document.createElement('div');
  row.className = 'expense-row';
  row.innerHTML = `
    <input type="text" class="description" placeholder="Description" required />
    <input type="number" class="amount" placeholder="Amount" required />
  `;
  expenseFields.appendChild(row);
});

expenseFields.addEventListener('input', updateTotal);

expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const date = dateInput.value;
  if (!date) return alert('Please select a date.');

  const descriptions = document.querySelectorAll('.description');
  const amounts = document.querySelectorAll('.amount');
  let expenses = [];

  for (let i = 0; i < descriptions.length; i++) {
    const desc = descriptions[i].value.trim();
    const amt = parseFloat(amounts[i].value);
    if (desc && !isNaN(amt)) {
      expenses.push({ description: desc, amount: amt });
    }
  }

  if (expenses.length === 0) return alert('Add at least one valid expense.');

  const dateKey = getDateKey(date);
  const existing = loadFromLocalStorage(dateKey);
  const updated = existing.concat(expenses);
  saveToLocalStorage(dateKey, updated);

  // Clear form
  expenseFields.innerHTML = `
    <div class="expense-row">
      <input type="text" class="description" placeholder="Description" required />
      <input type="number" class="amount" placeholder="Amount" required />
    </div>`;
  totalDisplay.textContent = '0.00';

  alert('Expenses saved! Use filter to view.');
});

filterBtn.addEventListener('click', () => {
  const y = yearFilter.value;
  const m = monthFilter.value;
  const d = dayFilter.value;
  const fullDate = `${y}-${m}-${d}`;
  const dateKey = getDateKey(fullDate);
  const data = loadFromLocalStorage(dateKey);
  renderTrackList(data, dateKey);
});

// Delete/Edit event delegation
trackList.addEventListener('click', (e) => {
  const index = e.target.dataset.index;
  const dateKey = e.target.dataset.date;
  if (e.target.classList.contains('delete')) {
    let data = loadFromLocalStorage(dateKey);
    data.splice(index, 1);
    saveToLocalStorage(dateKey, data);
    renderTrackList(data, dateKey);
  } else if (e.target.classList.contains('edit')) {
    let data = loadFromLocalStorage(dateKey);
    const newDesc = prompt('Edit description:', data[index].description);
    const newAmt = prompt('Edit amount:', data[index].amount);
    if (newDesc !== null && newAmt !== null && !isNaN(parseFloat(newAmt))) {
      data[index] = { description: newDesc, amount: parseFloat(newAmt) };
      saveToLocalStorage(dateKey, data);
      renderTrackList(data, dateKey);
    }
  }
});

updateFiltersDropdowns();
