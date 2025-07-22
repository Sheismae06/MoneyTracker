document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseFields = document.getElementById("expense-fields");
  const addMoreBtn = document.getElementById("add-more");
  const totalDisplay = document.getElementById("total");
  const dateInput = document.getElementById("date");
  const trackList = document.getElementById("track-list");

  const yearFilter = document.getElementById("yearFilter");
  const monthFilter = document.getElementById("monthFilter");
  const dayFilter = document.getElementById("dayFilter");
  const filterBtn = document.getElementById("filterBtn");

  function calculateTotal() {
    const amounts = expenseFields.querySelectorAll(".amount");
    let total = 0;
    amounts.forEach(input => {
      const value = parseFloat(input.value);
      if (!isNaN(value)) total += value;
    });
    totalDisplay.textContent = total.toFixed(2);
  }

  expenseFields.addEventListener("input", calculateTotal);

  addMoreBtn.addEventListener("click", () => {
    const newRow = document.createElement("div");
    newRow.className = "expense-row";
    newRow.innerHTML = `
      <input type="text" class="description" placeholder="Description" required />
      <input type="number" class="amount" placeholder="Amount" required />
    `;
    expenseFields.appendChild(newRow);
  });

  function getSavedExpenses() {
    return JSON.parse(localStorage.getItem("expenses") || "[]");
  }

  function saveExpenses(expenses) {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  function updateFiltersDropdowns(expenses) {
    const years = new Set();
    const months = new Set();
    const days = new Set();

    expenses.forEach(exp => {
      const [year, month, day] = exp.date.split("-");
      years.add(year);
      months.add(month);
      days.add(day);
    });

    const setOptions = (select, set, label) => {
      select.innerHTML = `<option value="">${label}</option>`;
      Array.from(set).sort().forEach(val => {
        select.innerHTML += `<option value="${val}">${val}</option>`;
      });
    };

    setOptions(yearFilter, years, "Year");
    setOptions(monthFilter, months, "Month");
    setOptions(dayFilter, days, "Day");
  }

  function renderSavedExpenses(filter = {}) {
    const expenses = getSavedExpenses();
    trackList.innerHTML = "";

    const filtered = expenses.filter(exp => {
      const [y, m, d] = exp.date.split("-");
      return (!filter.year || filter.year === y) &&
             (!filter.month || filter.month === m) &&
             (!filter.day || filter.day === d);
    });

    if (filtered.length === 0) {
      trackList.innerHTML = "<p>No expenses found.</p>";
      return;
    }

    filtered.forEach(entry => {
      const div = document.createElement("div");
      div.className = "saved-entry";
      div.innerHTML = `
        <strong>${entry.date}</strong>
        <ul>
          ${entry.items.map(i => `<li>${i.description}: PHP ${parseFloat(i.amount).toFixed(2)}</li>`).join("")}
        </ul>
        <em>Total: PHP ${parseFloat(entry.total).toFixed(2)}</em>
      `;
      trackList.appendChild(div);
    });
  }

  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const date = dateInput.value;
    if (!date) {
      alert("Please select a date.");
      return;
    }

    const items = [];
    const rows = expenseFields.querySelectorAll(".expense-row");

    rows.forEach(row => {
      const description = row.querySelector(".description").value.trim();
      const amount = row.querySelector(".amount").value.trim();
      if (description && amount) {
        items.push({ description, amount });
      }
    });

    if (items.length === 0) {
      alert("Please enter at least one expense.");
      return;
    }

    const total = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    const expenses = getSavedExpenses();
    expenses.push({ date, items, total });
    saveExpenses(expenses);
    updateFiltersDropdowns(expenses);
    renderSavedExpenses();
    expenseForm.reset();
    expenseFields.innerHTML = `
      <div class="expense-row">
        <input type="text" class="description" placeholder="Description" required />
        <input type="number" class="amount" placeholder="Amount" required />
      </div>
    `;
    totalDisplay.textContent = "0.00";
  });

  filterBtn.addEventListener("click", () => {
    const filter = {
      year: yearFilter.value,
      month: monthFilter.value,
      day: dayFilter.value
    };
    renderSavedExpenses(filter);
  });

  // Initialize
  const savedExpenses = getSavedExpenses();
  updateFiltersDropdowns(savedExpenses);
  renderSavedExpenses();
});
