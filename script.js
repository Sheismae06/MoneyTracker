// Music toggle
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const bgMusic = document.getElementById('bg-music');
let isMusicPlaying = false;

musicToggle.addEventListener('click', () => {
  isMusicPlaying = !isMusicPlaying;
  if (isMusicPlaying) {
    bgMusic.play();
    musicIcon.style.opacity = '1';
    musicIcon.style.filter = 'drop-shadow(0 0 5px gold)';
  } else {
    bgMusic.pause();
    musicIcon.style.opacity = '0.7';
    musicIcon.style.filter = 'none';
  }
});

// Save Entry
function saveEntry() {
  const date = document.getElementById('entry-date').value;
  const amount = parseFloat(document.getElementById('entry-amount').value);
  const type = document.getElementById('entry-type').value;
  const note = document.getElementById('entry-note').value;

  if (!date || isNaN(amount)) {
    alert("Please enter a valid date and amount.");
    return;
  }

  const entry = { date, amount, type, note };
  let entries = JSON.parse(localStorage.getItem('entries')) || [];
  entries.push(entry);
  localStorage.setItem('entries', JSON.stringify(entries));

  renderEntries();
  updateTotals();
  clearForm();
}

// Render Entries
function renderEntries() {
  const entries = JSON.parse(localStorage.getItem('entries')) || [];
  const tbody = document.querySelector('#entries-table tbody');
  tbody.innerHTML = '';

  entries.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>₱${entry.amount.toFixed(2)}</td>
      <td class="${entry.type}">${entry.type}</td>
      <td>${entry.note}</td>
      <td><button onclick="deleteEntry(${index})">Delete</button></td>
    `;
    tbody.appendChild(row);
  });
}

// Delete Entry
function deleteEntry(index) {
  let entries = JSON.parse(localStorage.getItem('entries')) || [];
  entries.splice(index, 1);
  localStorage.setItem('entries', JSON.stringify(entries));
  renderEntries();
  updateTotals();
}

// Clear form
function clearForm() {
  document.getElementById('entry-date').value = '';
  document.getElementById('entry-amount').value = '';
  document.getElementById('entry-type').value = 'income';
  document.getElementById('entry-note').value = '';
}

// Update Totals
function updateTotals() {
  const entries = JSON.parse(localStorage.getItem('entries')) || [];
  let income = 0, expense = 0;

  entries.forEach(entry => {
    if (entry.type === 'income') {
      income += entry.amount;
    } else {
      expense += entry.amount;
    }
  });

  const total = income - expense;
  document.getElementById('totals').innerHTML = `
    <p>Income: <span class="green">₱${income.toFixed(2)}</span></p>
    <p>Expenses: <span class="red">₱${expense.toFixed(2)}</span></p>
    <p>Balance: <strong>₱${total.toFixed(2)}</strong></p>
  `;
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  renderEntries();
  updateTotals();
});
