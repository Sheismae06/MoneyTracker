// Populate Month, Day, Year dropdowns
const yearFilter = document.getElementById("yearFilter");
const monthFilter = document.getElementById("monthFilter");
const dayFilter = document.getElementById("dayFilter");

function populateDateDropdowns() {
  // Year: 2025 to 3000
  for (let y = 2025; y <= 3000; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearFilter.appendChild(opt);
  }

  // Month: January to December
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  months.forEach((month, index) => {
    const opt = document.createElement("option");
    opt.value = index + 1; // 1 to 12
    opt.textContent = month;
    monthFilter.appendChild(opt);
  });

  // Day: 1 to 31
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    dayFilter.appendChild(opt);
  }
}

populateDateDropdowns();

// Add more fields
const addMoreBtn = document.getElementById("add-more");
addMoreBtn.addEventListener("click", () => {
  const container = document.createElement("div");
  container.classList.add("expense-row");
  container.innerHTML = `
    <input type="text" class="description" placeholder="Description" required />
    <input type="number" class="amount" placeholder="Amount" required />
  `;
  document.getElementById("expense-fields").appendChild(container);
});

// Save and compute
const expenseForm = document.getElementById("expense-form");
let savedExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const date = document.getElementById("date").value;
  if (!date) return alert("Please select a date first.");

  const descriptions = document.querySelectorAll(".description");
  const amounts = document.querySelectorAll(".amount");

  const entries = [];
  let total = 0;

  descriptions.forEach((desc, i) => {
    const description = desc.value.trim();
    const amount = parseFloat(amounts[i].value);

    if (description && !isNaN(amount)) {
      entries.push({ description, amount });
      total += amount;
    }
  });

  savedExpenses.push({ date, entries, total });
  localStorage.setItem("expenses", JSON.stringify(savedExpenses));

  renderSavedExpenses();
  expenseForm.reset();
  document.getElementById("total").textContent = "0.00";
});

// Live total calculator
expenseForm.addEventListener("input", () => {
  const amounts = document.querySelectorAll(".amount");
  let total = 0;
  amounts.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) total += value;
  });
  document.getElementById("total").textContent = total.toFixed(2);
});

// Render saved
function renderSavedExpenses(filterDate = null) {
  const list = document.getElementById("track-list");
  list.innerHTML = "";

  let filtered = savedExpenses;
  if (filterDate) {
    filtered = savedExpenses.filter(exp => exp.date === filterDate);
  }

  if (filtered.length === 0) {
    list.innerHTML = "<p>No saved expenses found.</p>";
    return;
  }

  filtered.forEach(exp => {
    const div = document.createElement("div");
    div.className = "track-card";
    div.innerHTML = `
      <h3>📅 ${exp.date}</h3>
      <ul>
        ${exp.entries.map(e => `<li>${e.description} - PHP ${e.amount.toFixed(2)}</li>`).join("")}
      </ul>
      <strong>Total: PHP ${exp.total.toFixed(2)}</strong>
    `;
    list.appendChild(div);
  });
}

// Filter logic
document.getElementById("filterBtn").addEventListener("click", () => {
  const year = yearFilter.value;
  const month = monthFilter.value.padStart(2, "0");
  const day = dayFilter.value.padStart(2, "0");

  if (!year || !month || !day) {
    alert("Please select complete filter date.");
    return;
  }

  const filterDate = `${year}-${month}-${day}`;
  renderSavedExpenses(filterDate);
});

// Initial render
renderSavedExpenses();
