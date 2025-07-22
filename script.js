document.addEventListener("DOMContentLoaded", function () {
  const monthSelect = document.getElementById("month");
  const daySelect = document.getElementById("day");
  const yearSelect = document.getElementById("year");

  const cutoff1 = document.getElementById("cutoff1");
  const cutoff2 = document.getElementById("cutoff2");
  const totalSalaryInput = document.getElementById("total-salary");

  const expensesContainer = document.getElementById("expenses-container");
  const addMoreBtn = document.getElementById("add-more");
  const expensesTotal = document.getElementById("expenses-total");

  const todayTotalSalary = document.getElementById("today-total-salary");
  const todayTotalExpenses = document.getElementById("today-total-expenses");
  const balance = document.getElementById("balance");

  const saveBtn = document.getElementById("save-btn");
  const entryList = document.getElementById("entry-list");

  // Initialize Chart
  let ctx = document.getElementById("expenseChart").getContext("2d");
  let expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });

  // Populate month, day, year
  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ];
  months.forEach((month, index) => {
    const opt = document.createElement("option");
    opt.value = index + 1;
    opt.textContent = month;
    monthSelect.appendChild(opt);
  });

  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    daySelect.appendChild(opt);
  }

  for (let y = 2025; y <= 3000; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }

  function updateTotalSalary() {
    const val1 = parseFloat(cutoff1.value) || 0;
    const val2 = parseFloat(cutoff2.value) || 0;
    totalSalaryInput.value = val1 + val2;
    updateTodaySummary();
  }

  cutoff1.addEventListener("input", updateTotalSalary);
  cutoff2.addEventListener("input", updateTotalSalary);

  function addExpenseRow(desc = "", amt = "") {
    const row = document.createElement("div");
    row.classList.add("expense-row");
    row.innerHTML = `
      <input type="text" class="desc" placeholder="Description" value="${desc}">
      <input type="number" class="amt" placeholder="Amount" value="${amt}">
      <button class="remove-expense">Remove</button>
    `;
    expensesContainer.appendChild(row);

    row.querySelector(".amt").addEventListener("input", updateExpensesTotal);
    row.querySelector(".remove-expense").addEventListener("click", () => {
      row.remove();
      updateExpensesTotal();
    });
  }

  addMoreBtn.addEventListener("click", () => {
    addExpenseRow();
  });

  function updateExpensesTotal() {
    const amounts = document.querySelectorAll(".amt");
    let total = 0;
    amounts.forEach((amt) => {
      total += parseFloat(amt.value) || 0;
    });
    expensesTotal.textContent = total.toFixed(2);
    updateTodaySummary();
    updateChart();
  }

  function updateTodaySummary() {
    const salary = parseFloat(totalSalaryInput.value) || 0;
    const expenses = parseFloat(expensesTotal.textContent) || 0;
    todayTotalSalary.textContent = salary.toFixed(2);
    todayTotalExpenses.textContent = expenses.toFixed(2);
    balance.textContent = (salary - expenses).toFixed(2);
  }

  function updateChart() {
    const descInputs = document.querySelectorAll(".desc");
    const amtInputs = document.querySelectorAll(".amt");

    const labels = [];
    const data = [];
    const colors = [];

    for (let i = 0; i < descInputs.length; i++) {
      const label = descInputs[i].value.trim();
      const amount = parseFloat(amtInputs[i].value) || 0;
      if (label && amount) {
        labels.push(label);
        data.push(amount);
        colors.push(`hsl(${Math.random() * 360}, 70%, 60%)`);
      }
    }

    expenseChart.data.labels = labels;
    expenseChart.data.datasets[0].data = data;
    expenseChart.data.datasets[0].backgroundColor = colors;
    expenseChart.update();
  }

  function getSelectedDateKey() {
    return `${monthSelect.value}-${daySelect.value}-${yearSelect.value}`;
  }

  function saveEntry() {
    const dateKey = getSelectedDateKey();
    const entry = {
      cutoff1: cutoff1.value,
      cutoff2: cutoff2.value,
      totalSalary: totalSalaryInput.value,
      expenses: [],
    };

    document.querySelectorAll(".expense-row").forEach((row) => {
      const desc = row.querySelector(".desc").value;
      const amt = row.querySelector(".amt").value;
      if (desc && amt) {
        entry.expenses.push({ desc, amt });
      }
    });

    localStorage.setItem(dateKey, JSON.stringify(entry));
    renderEntries();
  }

  function renderEntries() {
    entryList.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
      const dateKey = localStorage.key(i);
      const entry = JSON.parse(localStorage.getItem(dateKey));
      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${dateKey}</strong>
        <button class="edit" data-key="${dateKey}">Edit</button>
        <button class="delete" data-key="${dateKey}">Delete</button>
      `;
      entryList.appendChild(div);
    }

    document.querySelectorAll(".edit").forEach((btn) => {
      btn.addEventListener("click", () => loadEntry(btn.dataset.key));
    });

    document.querySelectorAll(".delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        localStorage.removeItem(btn.dataset.key);
        renderEntries();
      });
    });
  }

  function loadEntry(dateKey) {
    const entry = JSON.parse(localStorage.getItem(dateKey));
    if (!entry) return;

    const [month, day, year] = dateKey.split("-");
    monthSelect.value = month;
    daySelect.value = day;
    yearSelect.value = year;

    cutoff1.value = entry.cutoff1;
    cutoff2.value = entry.cutoff2;
    totalSalaryInput.value = entry.totalSalary;

    expensesContainer.innerHTML = "";
    entry.expenses.forEach((item) => {
      addExpenseRow(item.desc, item.amt);
    });

    updateTotalSalary();
    updateExpensesTotal();
  }

  saveBtn.addEventListener("click", saveEntry);
  renderEntries();
});
