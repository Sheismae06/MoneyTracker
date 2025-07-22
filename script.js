// ✅ script.js (Updated with calendar-based tracking)

// DOM Elements
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");
const saveBtn = document.getElementById("saveBtn");
const incomeList = document.getElementById("incomeList");
const expenseList = document.getElementById("expenseList");
const balanceEl = document.getElementById("balance");
const datePicker = document.getElementById("datePicker");

// Initialize date picker to today
datePicker.valueAsDate = new Date();

// Retrieve and display data when date changes
datePicker.addEventListener("change", loadDataForSelectedDate);

// Save entry
saveBtn.addEventListener("click", () => {
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
  const description = descriptionInput.value;
  const dateKey = datePicker.value;

  if (!amount || !category) return alert("Please fill out all fields");

  const entry = { amount, category, description, date: dateKey };

  const entries = JSON.parse(localStorage.getItem(dateKey)) || [];
  entries.push(entry);
  localStorage.setItem(dateKey, JSON.stringify(entries));

  amountInput.value = "";
  categoryInput.value = "";
  descriptionInput.value = "";

  loadDataForSelectedDate();
});

// Load data for selected date
function loadDataForSelectedDate() {
  const dateKey = datePicker.value;
  const entries = JSON.parse(localStorage.getItem(dateKey)) || [];

  incomeList.innerHTML = "";
  expenseList.innerHTML = "";

  let balance = 0;

  entries.forEach(({ amount, category, description }) => {
    const li = document.createElement("li");
    li.textContent = `${category}: PHP ${amount.toFixed(2)}${description ? ` (${description})` : ""}`;
    if (amount >= 0) {
      incomeList.appendChild(li);
    } else {
      expenseList.appendChild(li);
    }
    balance += amount;
  });

  balanceEl.textContent = `PHP ${balance.toFixed(2)}`;
}

// Initial load
loadDataForSelectedDate();
