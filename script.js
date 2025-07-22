document.addEventListener("DOMContentLoaded", function () { const incomeInput = document.getElementById("income"); const expenseInput = document.getElementById("expense"); const descriptionInput = document.getElementById("description"); const addButton = document.getElementById("addButton"); const chartCanvas = document.getElementById("moneyChart"); const saveButton = document.getElementById("saveButton"); const datePicker = document.getElementById("datePicker");

let moneyData = JSON.parse(localStorage.getItem("moneyData")) || {};

const chart = new Chart(chartCanvas, { type: "bar", data: { labels: [], datasets: [ { label: "Income", backgroundColor: "#8BC34A", data: [], }, { label: "Expense", backgroundColor: "#F44336", data: [], }, ], }, options: { responsive: true, scales: { y: { beginAtZero: true, }, }, }, });

function updateChartForDate(date) { const entries = moneyData[date] || []; chart.data.labels = entries.map((entry) => entry.description); chart.data.datasets[0].data = entries.map((entry) => entry.income); chart.data.datasets[1].data = entries.map((entry) => entry.expense); chart.update(); }

function saveDataToLocalStorage() { localStorage.setItem("moneyData", JSON.stringify(moneyData)); }

addButton.addEventListener("click", function () { const income = parseFloat(incomeInput.value) || 0; const expense = parseFloat(expenseInput.value) || 0; const description = descriptionInput.value.trim() || "No Description"; const selectedDate = datePicker.value || new Date().toISOString().split("T")[0];

if (!moneyData[selectedDate]) {
  moneyData[selectedDate] = [];
}

moneyData[selectedDate].push({ income, expense, description });
saveDataToLocalStorage();
updateChartForDate(selectedDate);

incomeInput.value = "";
expenseInput.value = "";
descriptionInput.value = "";

});

saveButton.addEventListener("click", function () { alert("Data saved locally! You can return to any date and your entries will remain."); });

datePicker.addEventListener("change", function () { updateChartForDate(datePicker.value); });

// Initialize with today's date datePicker.value = new Date().toISOString().split("T")[0]; updateChartForDate(datePicker.value); });

