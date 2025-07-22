document.addEventListener('DOMContentLoaded', () => {
  const expenseListContainer = document.getElementById('expenseListContainer');
  const addExpenseBtn = document.getElementById('addExpenseBtn');
  const totalAmountEl = document.getElementById('totalAmount');
  const saveBtn = document.getElementById('saveBtn');
  const historyList = document.getElementById('historyList');
  const confirmationMsg = document.getElementById('confirmationMsg');
  const trackDateInput = document.getElementById('trackDate');

  function updateTotal() {
    let total = 0;
    document.querySelectorAll('.amount').forEach(input => {
      const val = parseFloat(input.value);
      if (!isNaN(val)) total += val;
    });
    totalAmountEl.textContent = total.toFixed(2);
  }

  function createExpenseItem(desc = '', amount = '') {
    const item = document.createElement('div');
    item.className = 'expense-item';
    item.innerHTML = `
      <input type="text" placeholder="Description" class="desc" value="${desc}">
      <input type="number" placeholder="Amount" class="amount" value="${amount}">
      <button class="remove-btn">✖</button>
    `;

    item.querySelector('.amount').addEventListener('input', updateTotal);
    item.querySelector('.remove-btn').addEventListener('click', () => {
      item.remove();
      updateTotal();
    });

    return item;
  }

  addExpenseBtn.addEventListener('click', () => {
    const newItem = createExpenseItem();
    expenseListContainer.appendChild(newItem);
  });

  saveBtn.addEventListener('click', () => {
    const date = trackDateInput.value;
    if (!date) return alert('Please select a date.');

    const entries = [];
    document.querySelectorAll('.expense-item').forEach(item => {
      const desc = item.querySelector('.desc').value.trim();
      const amount = parseFloat(item.querySelector('.amount').value);
      if (desc && !isNaN(amount)) {
        entries.push({ desc, amount });
      }
    });

    if (entries.length === 0) {
      alert('Please add at least one expense item.');
      return;
    }

    localStorage.setItem(`track-${date}`, JSON.stringify(entries));
    confirmationMsg.classList.remove('hidden');
    setTimeout(() => confirmationMsg.classList.add('hidden'), 3000);
    loadHistory();
  });

  function loadHistory() {
    historyList.innerHTML = '';
    for (let key in localStorage) {
      if (key.startsWith('track-')) {
        const date = key.replace('track-', '');
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${date}</strong>
          <button class="view-btn">View</button>
          <button class="delete-btn">🗑</button>
        `;

        li.querySelector('.view-btn').addEventListener('click', () => {
          const data = JSON.parse(localStorage.getItem(key));
          trackDateInput.value = date;
          expenseListContainer.innerHTML = '';
          data.forEach(entry => {
            const item = createExpenseItem(entry.desc, entry.amount);
            expenseListContainer.appendChild(item);
          });
          updateTotal();
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
          if (confirm(`Delete record for ${date}?`)) {
            localStorage.removeItem(key);
            loadHistory();
          }
        });

        historyList.appendChild(li);
      }
    }
  }

  trackDateInput.valueAsDate = new Date();
  updateTotal();
  loadHistory();
});
