document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('expense-form');
  const trackList = document.getElementById('track-list');
  const totalDisplay = document.getElementById('total');
  const addMoreBtn = document.getElementById('add-more');
  const filterBtn = document.getElementById('filterBtn');

  let tracks = JSON.parse(localStorage.getItem('tracks')) || [];

  // Render All Tracks
  renderTracks();

  // Recalculate total on any input
  form.addEventListener('input', calculateTotal);

  // Add More Fields
  addMoreBtn.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'expense-row';
    row.innerHTML = `
      <input type="text" class="description" placeholder="Description" required />
      <input type="number" class="amount" placeholder="Amount" required />
    `;
    document.getElementById('expense-fields').appendChild(row);
  });

  // Save Entries
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const descriptions = document.querySelectorAll('.description');
    const amounts = document.querySelectorAll('.amount');

    const entries = Array.from(descriptions).map((desc, i) => ({
      description: desc.value.trim(),
      amount: parseFloat(amounts[i].value) || 0
    })).filter(e => e.description && !isNaN(e.amount) && e.amount > 0);

    if (!date || entries.length === 0) {
      alert('Please complete the form with valid data.');
      return;
    }

    // Save track
    tracks.push({ date, entries });
    localStorage.setItem('tracks', JSON.stringify(tracks));

    // Reset form
    form.reset();
    document.getElementById('expense-fields').innerHTML = `
      <div class="expense-row">
        <input type="text" class="description" placeholder="Description" required />
        <input type="number" class="amount" placeholder="Amount" required />
      </div>`;
    calculateTotal();
    renderTracks();
  });

  // Real-time Total Calculation
  function calculateTotal() {
    const amountInputs = document.querySelectorAll('.amount');
    let total = 0;
    amountInputs.forEach(input => {
      const val = parseFloat(input.value);
      if (!isNaN(val)) total += val;
    });
    totalDisplay.textContent = total.toFixed(2);
  }

  // Edit Track
  function editTrack(index) {
    const track = tracks[index];
    document.getElementById('date').value = track.date;
    const expenseFields = document.getElementById('expense-fields');
    expenseFields.innerHTML = '';
    track.entries.forEach(entry => {
      const row = document.createElement('div');
      row.className = 'expense-row';
      row.innerHTML = `
        <input type="text" class="description" placeholder="Description" value="${entry.description}" required />
        <input type="number" class="amount" placeholder="Amount" value="${entry.amount}" required />
      `;
      expenseFields.appendChild(row);
    });

    tracks.splice(index, 1);
    localStorage.setItem('tracks', JSON.stringify(tracks));
    renderTracks();
    calculateTotal();
  }

  // Render all or filtered tracks
  function renderTracks(filtered = tracks) {
    trackList.innerHTML = '';

    if (filtered.length === 0) {
      trackList.innerHTML = '<p>No entries found.</p>';
      return;
    }

    filtered.forEach((track, index) => {
      const container = document.createElement('div');
      container.className = 'track-item';

      const date = document.createElement('div');
      date.textContent = `📅 ${track.date}`;

      const list = document.createElement('ul');
      track.entries.forEach(entry => {
        const item = document.createElement('li');
        item.textContent = `${entry.description} - PHP ${entry.amount.toFixed(2)}`;
        list.appendChild(item);
      });

      const total = document.createElement('div');
      const sum = track.entries.reduce((a, b) => a + b.amount, 0);
      total.textContent = `Total: PHP ${sum.toFixed(2)}`;

      const editBtn = document.createElement('button');
      editBtn.textContent = '✏️ Edit';
      editBtn.onclick = () => editTrack(index);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑️ Delete';
      deleteBtn.onclick = () => {
        if (confirm('Are you sure you want to delete this?')) {
          tracks.splice(index, 1);
          localStorage.setItem('tracks', JSON.stringify(tracks));
          renderTracks();
        }
      };

      container.appendChild(date);
      container.appendChild(list);
      container.appendChild(total);
      container.appendChild(editBtn);
      container.appendChild(deleteBtn);
      trackList.appendChild(container);
    });
  }

  // Filter by date range
  filterBtn.addEventListener('click', () => {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    if (!start || !end) {
      alert('Please select both start and end dates.');
      return;
    }

    const filtered = tracks.filter(t => t.date >= start && t.date <= end);
    renderTracks(filtered);
  });
});
