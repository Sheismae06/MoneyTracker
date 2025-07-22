document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  const expenseForm = document.getElementById("expense-form");
  const expenseFields = document.getElementById("expense-fields");
  const addMoreBtn = document.getElementById("add-more");
  const totalDisplay = document.getElementById("total");
  const trackList = document.getElementById("track-list");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const filterBtn = document.getElementById("filterBtn");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  // 🧮 Recalculate total
  function updateTotal() {
    const amounts = [...document.querySelectorAll(".amount")].map(input => parseFloat(input.value) || 0);
    const total = amounts.reduce((acc, val) => acc + val, 0);
    totalDisplay.textContent = total.toFixed(2);
  }

  expenseFields.addEventListener("input", updateTotal);

  // ➕ Add more fields
  addMoreBtn.addEventListener("click", () => {
    const row = document.createElement("div");
    row.classList.add("expense-row");
    row.innerHTML = `
      <input type="text" class="description" placeholder="Description" required />
      <input type="number" class="amount" placeholder="Amount" required />
    `;
    expenseFields.appendChild(row);
  });

  // 💾 Save expense data
  expenseForm.addEventListener("submit", e => {
    e.preventDefault();
    const date = dateInput.value;
    if (!date) return alert("Please select a date.");

    const entries = [...document.querySelectorAll(".expense-row")].map(row => ({
      description: row.querySelector(".description").value,
      amount: parseFloat(row.querySelector(".amount").value)
    }));

    expenses.push({ date, entries });
    localStorage.setItem("expenses", JSON.stringify(expenses));

    // Clear form
    expenseFields.innerHTML = `
      <div class="expense-row">
        <input type="text" class="description" placeholder="Description" required />
        <input type="number" class="amount" placeholder="Amount" required />
      </div>
    `;
    dateInput.value = "";
    updateTotal();

    alert("Saved! You may now filter to view your saved data.");
  });

  // 🔍 Filter by date range
  filterBtn.addEventListener("click", () => {
    const start = startDateInput.value;
    const end = endDateInput.value;

    if (!start || !end) {
      alert("Please select both start and end dates.");
      return;
    }

    const filtered = expenses.filter(exp => exp.date >= start && exp.date <= end);
    displayFilteredExpenses(filtered);
  });

  // 🖼️ Display results
  function displayFilteredExpenses(filtered) {
    trackList.innerHTML = "";

    if (filtered.length === 0) {
      trackList.innerHTML = "<p>No entries found for selected range.</p>";
      return;
    }

    filtered.forEach(exp => {
      const div = document.createElement("div");
      div.classList.add("track-entry");

      const dateHeader = document.createElement("h3");
      dateHeader.textContent = `📅 ${exp.date}`;
      div.appendChild(dateHeader);

      const ul = document.createElement("ul");
      let dayTotal = 0;

      exp.entries.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.description}: PHP ${item.amount.toFixed(2)}`;
        ul.appendChild(li);
        dayTotal += item.amount;
      });

      const total = document.createElement("strong");
      total.textContent = `Total: PHP ${dayTotal.toFixed(2)}`;

      div.appendChild(ul);
      div.appendChild(total);
      trackList.appendChild(div);
    });
  }
});
