const expenseForm = document.getElementById("expense-form");
const expenseFields = document.getElementById("expense-fields");
const totalDisplay = document.getElementById("total");
const addMoreBtn = document.getElementById("add-more");
const dateInput = document.getElementById("date");
const trackList = document.getElementById("track-list");
const yearFilter = document.getElementById("yearFilter");
const monthFilter = document.getElementById("monthFilter");
const dayFilter = document.getElementById("dayFilter");
const filterBtn = document.getElementById("filterBtn");

let tracks = JSON.parse(localStorage.getItem("expenseTracks")) || [];

// Populate dropdowns
function populateDropdowns() {
  // Year 2025 - 3000
  for (let y = 2025; y <= 3000; y++) {
    yearFilter.innerHTML += `<option value="${y}">${y}</option>`;
  }

  // Month January - December
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  months.forEach((month, index) => {
    monthFilter.innerHTML += `<option value="${index + 1}">${month}</option>`;
  });

  // Days 1 - 31
  for (let d = 1; d <= 31; d++) {
    dayFilter.innerHTML += `<option value="${d}">${d}</option>`;
  }
}
populateDropdowns();

// Real-time total computation
function updateTotal() {
  const amounts = [...document.querySelectorAll(".amount")].map(input => parseFloat(input.value) || 0);
  const total = amounts.reduce((acc, val) => acc + val, 0);
  totalDisplay.textContent = total.toFixed(2);
}

// Add more expense row
addMoreBtn.addEventListener("click", () => {
  const row = document.createElement("div");
  row.className = "expense-row";
  row.innerHTML = `
    <input type="text" class="description" placeholder="Description" required />
    <input type="number" class="amount" placeholder="Amount" required />
  `;
  expenseFields.appendChild(row);

  row.querySelectorAll(".amount").forEach(input =>
    input.addEventListener("input", updateTotal)
  );
});

// Save button logic
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedDate = dateInput.value;
  if (!selectedDate) return alert("Please select a date.");

  const details = [...document.querySelectorAll(".expense-row")].map(row => {
    return {
      description: row.querySelector(".description").value.trim(),
      amount: parseFloat(row.querySelector(".amount").value || 0)
    };
  });

  const total = details.reduce((sum, item) => sum + item.amount, 0);
  const newTrack = { date: selectedDate, details, total };

  tracks.push(newTrack);
  localStorage.setItem("expenseTracks", JSON.stringify(tracks));

  alert("Saved successfully!");
  expenseForm.reset();
  expenseFields.innerHTML = `
    <div class="expense-row">
      <input type="text" class="description" placeholder="Description" required />
      <input type="number" class="amount" placeholder="Amount" required />
    </div>`;
  updateTotal();
});

// Filter button
filterBtn.addEventListener("click", () => {
  const y = yearFilter.value;
  const m = monthFilter.value.padStart(2, "0");
  const d = dayFilter.value.padStart(2, "0");
  const filterDate = `${y}-${m}-${d}`;

  const filtered = tracks.filter(track => track.date === filterDate);
  displayTracks(filtered);
});

// Display filtered tracks
function displayTracks(data) {
  trackList.innerHTML = "";
  if (data.length === 0) {
    trackList.innerHTML = "<p>No records found for selected date.</p>";
    return;
  }

  data.forEach((track, index) => {
    const div = document.createElement("div");
    div.className = "track-card";
    div.innerHTML = `
      <h3>📅 ${track.date}</h3>
      <ul>
        ${track.details.map((item, i) => `
          <li>
            📝 <input type="text" value="${item.description}" data-track="${track.date}" data-index="${i}" class="editable desc-edit"/>
            💸 <input type="number" value="${item.amount}" data-track="${track.date}" data-index="${i}" class="editable amt-edit"/>
          </li>`).join("")}
      </ul>
      <p>🧮 Total: PHP ${track.total.toFixed(2)}</p>
      <button class="delete-btn" data-date="${track.date}">🗑️ Delete</button>
    `;
    trackList.appendChild(div);
  });

  // Enable edit fields
  document.querySelectorAll(".editable").forEach(input => {
    input.addEventListener("change", (e) => {
      const { track, index } = e.target.dataset;
      const foundTrack = tracks.find(t => t.date === track);
      if (foundTrack) {
        const isDesc = e.target.classList.contains("desc-edit");
        if (isDesc) {
          foundTrack.details[index].description = e.target.value;
        } else {
          foundTrack.details[index].amount = parseFloat(e.target.value) || 0;
        }
        foundTrack.total = foundTrack.details.reduce((acc, item) => acc + item.amount, 0);
        localStorage.setItem("expenseTracks", JSON.stringify(tracks));
        displayTracks([foundTrack]); // Refresh
      }
    });
  });

  // Delete functionality
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this entry?")) {
        const dateToDelete = btn.dataset.date;
        tracks = tracks.filter(t => t.date !== dateToDelete);
        localStorage.setItem("expenseTracks", JSON.stringify(tracks));
        trackList.innerHTML = "";
      }
    });
  });
}

// Initial total computation
updateTotal();

// Watch for manual edits in amount fields
document.addEventListener("input", (e) => {
  if (e.target.classList.contains("amount")) {
    updateTotal();
  }
});
