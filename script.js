document.addEventListener('DOMContentLoaded', () => {
  const descriptionInput = document.getElementById('description');
  const amountInput = document.getElementById('amount');
  const addMoreBtn = document.getElementById('addMore');
  const saveBtn = document.getElementById('saveBtn');
  const trackList = document.getElementById('trackList');
  const totalDisplay = document.getElementById('total');
  const savedExpenses = document.getElementById('savedExpenses');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const filterBtn = document.getElementById('filterBtn');

  let trackItems = [];

  // Add item
  addMoreBtn.addEventListener('click', () => {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    if (description && !isNaN(amount)) {
      trackItems.push({ description, amount, date: new Date().toISOString().split('T')[0] });
      renderTrackList(trackItems);
      updateTotal(trackItems);
      descriptionInput.value = '';
      amountInput.value = '';
      saveBtn.disabled = false;
    }
  });

  // Save to localStorage
  saveBtn.addEventListener('click', () => {
    const existing = JSON.parse(localStorage.getItem('expenses')) || [];
    localStorage.setItem('expenses', JSON.stringify([...existing, ...trackItems]));
    trackItems = [];
    renderTrackList([]);
    updateTotal([]);
    alert('Saved successfully!');
    saveBtn.disabled = true;
  });

  // Render list
  function renderTrackList(items) {
    trackList.innerHTML = '';
    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${item.date} - ${item.description} - PHP ${item.amount.toFixed(2)}
        <button class="edit" data-index="${index}">✏️</button>
        <button class="delete" data-index="${index}">🗑️</button>
      `;
      trackList.appendChild(li);
    });
  }

  // Update total
  function updateTotal(items) {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    totalDisplay.textContent = `Total: PHP ${total.toFixed(2)}`;
  }

  // Filter expenses by date range
  filterBtn.addEventListener('click', () => {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
      alert('Please select both start and end dates.');
      return;
    }

    const saved = JSON.parse(localStorage.getItem('expenses')) || [];
    const filtered = saved.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });

    renderTrackList(filtered);
    updateTotal(filtered);
    currentFiltered = filtered;
  });

  // Edit and Delete logic
  let currentFiltered = [];
  trackList.addEventListener('click', (e) => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains('delete')) {
      if (confirm('Are you sure you want to delete this item?')) {
        const all = JSON.parse(localStorage.getItem('expenses')) || [];
        const filteredItem = currentFiltered[index];
        const matchIndex = all.findIndex(
          x => x.description === filteredItem.description &&
               x.amount === filteredItem.amount &&
               x.date === filteredItem.date
        );
        if (matchIndex !== -1) {
          all.splice(matchIndex, 1);
          localStorage.setItem('expenses', JSON.stringify(all));
        }
        currentFiltered.splice(index, 1);
        renderTrackList(currentFiltered);
        updateTotal(currentFiltered);
      }
    }

    if (e.target.classList.contains('edit')) {
      const item = currentFiltered[index];
      const newDesc = prompt('Edit description:', item.description);
      const newAmt = parseFloat(prompt('Edit amount:', item.amount));
      if (newDesc && !isNaN(newAmt)) {
        const all = JSON.parse(localStorage.getItem('expenses')) || [];
        const matchIndex = all.findIndex(
          x => x.description === item.description &&
               x.amount === item.amount &&
               x.date === item.date
        );
        if (matchIndex !== -1) {
          all[matchIndex] = { ...item, description: newDesc, amount: newAmt };
          localStorage.setItem('expenses', JSON.stringify(all));
        }
        currentFiltered[index] = { ...item, description: newDesc, amount: newAmt };
        renderTrackList(currentFiltered);
        updateTotal(currentFiltered);
      }
    }
  });
});
