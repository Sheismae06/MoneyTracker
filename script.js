document.addEventListener("DOMContentLoaded", function () {
  const monthSelect = document.getElementById("month");
  const daySelect = document.getElementById("day");
  const yearSelect = document.getElementById("year");
  const cutoff1 = document.getElementById("cutoff1");
  const cutoff2 = document.getElementById("cutoff2");
  const totalSalary = document.getElementById("totalSalary");
  const expenseContainer = document.getElementById("expenseContainer");
  const totalExpenses = document.getElementById("totalExpenses");
  const computedSalary = document.getElementById("computedSalary");
  const computedExpenses = document.getElementById("computedExpenses");
  const balance = document.getElementById("balance");
  const saveBtn = document.getElementById("saveBtn");
  const editBtn = document.getElementById("editBtn");
  const deleteBtn = document.getElementById("deleteBtn");

  // Populate date options
  for (let i = 1; i <= 12; i++) {
    monthSelect.innerHTML += `<option value="${i}">${new Date(0, i - 1).toLocaleString('default', { month: 'long' })}</option>`;
  }
  for (let i = 1; i <= 31; i++) {
    daySelect.innerHTML += `<option value="${i}">${i}</option>`;
  }
  for (let i = 2025; i <= 3000; i++) {
    yearSelect.innerHTML += `<option value="${i}">${i}</option>`;
  }

  // Salary computation
  function computeSalary() {
    const c1 = parseFloat(cutoff1.value) || 0;
    const c2 = parseFloat(cutoff2.value) || 0;
    const total = c1 + c2;
    totalSalary.value = total;
    computedSalary.value = total;
    updateBalance();
  }

  cutoff1.addEventListener("input", computeSalary);
  cutoff2.addEventListener("input", computeSalary);

  // Expense tracking
  function computeExpenses() {
    let total = 0;
    document.querySelectorAll(".amount").forEach((el) => {
      total += parseFloat(el.value) || 0;
    });
    totalExpenses.value = total;
    computedExpenses.value = total;
    updateBalance();
    updateChart();
  }

  expenseContainer.addEventListener("input", computeExpenses);

  document.getElementById("addExpense").addEventListener("click", () => {
    const div = document.createElement("div");
    div.className = "expenseRow";
    div.innerHTML = `
      <input type="text" class="description" placeholder="Description">
      <input type="number" class="amount" placeholder="Amount">
    `;
    expenseContainer.appendChild(div);
  });

  function updateBalance() {
    const total = parseFloat(totalSalary.value) || 0;
    const expenses = parseFloat(totalExpenses.value) || 0;
    balance.value = (total - expenses).toFixed(2);
  }

  // Save / Edit / Delete functionality
  function getCurrentDateKey() {
    return `${monthSelect.value}-${daySelect.value}-${yearSelect.value}`;
  }

  saveBtn.addEventListener("click", () => {
    const key = getCurrentDateKey();
    const data = {
      cutoff1: cutoff1.value,
      cutoff2: cutoff2.value,
      expenses: Array.from(document.querySelectorAll(".expenseRow")).map((row) => ({
        description: row.querySelector(".description").value,
        amount: row.querySelector(".amount").value,
      })),
    };
    localStorage.setItem(key, JSON.stringify(data));
    alert("Saved!");
  });

  editBtn.addEventListener("click", () => {
    const key = getCurrentDateKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      const data = JSON.parse(saved);
      cutoff1.value = data.cutoff1;
      cutoff2.value = data.cutoff2;
      computeSalary();
      expenseContainer.innerHTML = "";
      data.expenses.forEach((exp) => {
        const div = document.createElement("div");
        div.className = "expenseRow";
        div.innerHTML = `
          <input type="text" class="description" value="${exp.description}">
          <input type="number" class="amount" value="${exp.amount}">
        `;
        expenseContainer.appendChild(div);
      });
      computeExpenses();
    } else {
      alert("No data found.");
    }
  });

  deleteBtn.addEventListener("click", () => {
    const key = getCurrentDateKey();
    localStorage.removeItem(key);
    alert("Deleted!");
  });

  // Chart rendering
  let chart;
  function updateChart() {
    const labels = [];
    const data = [];

    document.querySelectorAll(".expenseRow").forEach((row) => {
      const desc = row.querySelector(".description").value || "Unnamed";
      const amt = parseFloat(row.querySelector(".amount").value) || 0;
      if (amt > 0) {
        labels.push(desc);
        data.push(amt);
      }
    });

    if (chart) chart.destroy();
    const ctx = document.getElementById("expenseChart").getContext("2d");
    chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              "#ff6384",
              "#36a2eb",
              "#ffcd56",
              "#4bc0c0",
              "#9966ff",
              "#ff9f40"
            ],
          },
        ],
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
  }
});
