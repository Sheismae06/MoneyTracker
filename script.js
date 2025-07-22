// References
const dateInput = document.getElementById("date");
const expenseForm = document.getElementById("expense-form");
const expenseFields = document.getElementById("expense-fields");
const addMoreBtn = document.getElementById("add-more");
const totalDisplay = document.getElementById("total");
const trackList = document.getElementById("track-list");

const yearFilter = document.getElementById("yearFilter");
const monthFilter = document.getElementById("monthFilter");
const dayFilter = document.getElementById("dayFilter");
const filterBtn = document.getElementById("filterBtn");

// Populate year/month/day dropdown
function populateDropdowns() {
  for (let y = 2025; y <= 3000; y++) {
    let opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearFilter.appendChild(opt);
  }
  for (let m = 1; m <= 12; m++) {
    let opt = document.createElement("option");
    opt.value = String(m).padStart(2, "0");
    opt.textContent = new Date(2000, m - 1).toLocaleString("default", { month: "long" });
    monthFilter.appendChild(opt);
  }
  for (let d = 1; d <= 31; d++) {
    let opt = document.createElement("option");
    opt.value = String(d).padStart(2, "0");
    opt.textContent = d;
    dayFilter.appendChild(opt);
  }
}
populateDropdowns();

// Add more fields
addMoreBtn.addEventListener("click", () => {
  const row = document.createElement("div");
  row.className = "expense-row";
  row.innerHTML = `
    <input type="text" class="description" placeholder="Description" required />
    <input type="number" class="amount" placeholder="Amount" required />
  `;
  expenseFields.appendChild(row);
  updateTotal();
});

// Update total on input
expenseFields.addEventListener("input", updateTotal);
function updateTotal() {
  const amounts = document.querySelectorAll(".amount");
  let total = 0;
  amounts.forEach(a => {
    const val = parseFloat(a.value);
    if (!isNaN(val)) total += val;
  });
  totalDisplay.textContent = total.toFixed(2);
}

// Save data
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = dateInput.value;
  if (!date) return alert("Please select a date.");

  const entries = [];
  const rows = document.querySelectorAll(".expense-row");
  rows.forEach(row => {
    const desc = row.querySelector(".description").value.trim();
    const amt = parseFloat(row.querySelector(".amount").value);
    if (desc && !isNaN(amt)) {
      entries.push({ desc, amt });
    }
  });

  if (!entries.length) return alert("Please enter valid expense(s).");

  const key = `track-${date}`;
  localStorage.setItem(key, JSON.stringify(entries));
  alert("Saved!");
  expenseForm.reset();
  expenseFields.innerHTML = `
    <div class="expense-row">
      <input type="text" class="description" placeholder="Description" required />
      <input type="number" class="amount" placeholder="Amount" required />
    </div>
  `;
  updateTotal();
  displayFilteredTracks();
});

// Filter data
filterBtn.addEventListener("click", () => {
  displayFilteredTracks();
});

function displayFilteredTracks() {
  const y = yearFilter.value;
  const m = monthFilter.value;
  const d = dayFilter.value;
  const key = `${y}-${m}-${d}`;
  const data = localStorage.getItem(`track-${key}`);
  trackList.innerHTML = "";

  if (data) {
    const parsed = JSON.parse(data);
    const title = document.createElement("h3");
    title.textContent = `Expenses for ${key}`;
    trackList.appendChild(title);

    parsed.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "expense-row";
      div.innerHTML = `
        <span>📌 ${item.desc}</span> — PHP ${item.amt.toFixed(2)}
        <button onclick="editItem('${key}', ${index})">✏️ Edit</button>
        <button onclick="deleteItem('${key}', ${index})">🗑️ Delete</button>
      `;
      trackList.appendChild(div);
    });
  } else {
    trackList.innerHTML = `<p>No expenses found for this date.</p>`;
  }
}

// Edit item
window.editItem = function (key, index) {
  const data = JSON.parse(localStorage.getItem(key));
  const newDesc = prompt("Update description:", data[index].desc);
  const newAmt = prompt("Update amount:", data[index].amt);

  if (newDesc && !isNaN(parseFloat(newAmt))) {
    data[index] = { desc: newDesc.trim(), amt: parseFloat(newAmt) };
    localStorage.setItem(key, JSON.stringify(data));
    displayFilteredTracks();
  }
};

// Delete item
window.deleteItem = function (key, index) {
  const confirmDelete = confirm("Are you sure you want to delete this item?");
  if (confirmDelete) {
    const data = JSON.parse(localStorage.getItem(key));
    data.splice(index, 1);
    if (data.length) {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      localStorage.removeItem(key);
    }
    displayFilteredTracks();
  }
};
