// Populate Month, Year, Day dropdowns
const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");
const daySelect = document.getElementById("day");

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

months.forEach((month, i) => {
  const option = document.createElement("option");
  option.value = i + 1;
  option.text = month;
  monthSelect.appendChild(option);
});

for (let y = 2025; y >= 2019; y--) {
  const option = document.createElement("option");
  option.value = y;
  option.text = y;
  yearSelect.appendChild(option);
}

for (let d = 1; d <= 31; d++) {
  const option = document.createElement("option");
  option.value = d;
  option.text = d;
  daySelect.appendChild(option);
}

// Elements
const entriesContainer = document.getElementById("entries");
const addRowBtn = document.getElementById("addRowBtn");
const totalDisplay = document.getElementById("totalAmount");
const saveBtn = document.getElementById("saveBtn");
const salary1Input = document.getElementById("salary1");
const salary2Input = document.getElementById("salary2");
const totalSalaryDisplay = document.getElementById("totalSalary");
const balanceDisplay = document.getElementById("balance");
const ctx = document.getElementById("graphCanvas").getContext("2d");

// Add new expense row
function addRow(item = "", amount = "") {
  const row = document.createElement("div");
  row.className = "entry-row";

  row.innerHTML = `
    <input type="text" class="item-input" placeholder="Expense name" value="${item}">
    <input type="number" class="amount-input" placeholder="Amount" value="${amount}">
    <button class="deleteBtn">✖</button>
  `;
  entriesContainer.appendChild(row);
  updateTotal();

  row.querySelector(".deleteBtn").addEventListener("click", () => {
    row.remove();
    updateTotal();
  });
}

// Update total expense
function updateTotal() {
  const amounts = document.querySelectorAll(".amount-input");
  let total = 0;
  amounts.forEach(input => {
    total += Number(input.value || 0);
  });
  totalDisplay.textContent = total.toFixed(2);

  const salary1 = parseFloat(salary1Input.value) || 0;
  const salary2 = parseFloat(salary2Input.value) || 0;
  const totalSalary = salary1 + salary2;
  totalSalaryDisplay.textContent = totalSalary.toFixed(2);
  balanceDisplay.textContent = (totalSalary - total).toFixed(2);
  updateGraph();
}

// Save to localStorage
function saveData() {
  const key = `${yearSelect.value}-${monthSelect.value}-${daySelect.value}`;
  const items = document.querySelectorAll(".item-input");
  const amounts = document.querySelectorAll(".amount-input");

  const data = {
    entries: [],
    salary1: salary1Input.value,
    salary2: salary2Input.value
  };

  items.forEach((item, i) => {
    data.entries.push({
      item: item.value,
      amount: amounts[i].value
    });
  });

  localStorage.setItem(key, JSON.stringify(data));
  alert("Saved successfully!");
  updateGraph(); // update after saving
}

// Load from localStorage
function loadData() {
  const key = `${yearSelect.value}-${monthSelect.value}-${daySelect.value}`;
  const data = JSON.parse(localStorage.getItem(key));

  entriesContainer.innerHTML = "";
  if (data) {
    salary1Input.value = data.salary1 || "";
    salary2Input.value = data.salary2 || "";
    data.entries.forEach(entry => addRow(entry.item, entry.amount));
  } else {
    salary1Input.value = "";
    salary2Input.value = "";
    addRow();
  }

  updateTotal();
}

// Update graph
let myChart;
function updateGraph() {
  const labels = [];
  const values = [];

  for (let d = 1; d <= 31; d++) {
    const key = `${yearSelect.value}-${monthSelect.value}-${d}`;
    const data = JSON.parse(localStorage.getItem(key));
    let dayTotal = 0;

    if (data && data.entries) {
      data.entries.forEach(entry => {
        dayTotal += Number(entry.amount);
      });
    }

    labels.push(`Day ${d}`);
    values.push(dayTotal);
  }

  if (myChart) myChart.destroy();

  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expenses per Day',
        data: values,
        backgroundColor: '#FFD700'
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#fff'
          }
        },
        x: {
          ticks: {
            color: '#fff'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#fff'
          }
        }
      }
    }
  });
}

// Event Listeners
addRowBtn.addEventListener("click", () => addRow());
saveBtn.addEventListener("click", saveData);
monthSelect.addEventListener("change", loadData);
yearSelect.addEventListener("change", loadData);
daySelect.addEventListener("change", loadData);
salary1Input.addEventListener("input", updateTotal);
salary2Input.addEventListener("input", updateTotal);

// Initial setup
window.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  monthSelect.value = today.getMonth() + 1;
  yearSelect.value = today.getFullYear();
  daySelect.value = today.getDate();
  loadData();
});
