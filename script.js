let data = JSON.parse(localStorage.getItem('expenseData')) || {};
let currentDate = getCurrentDate();

document.getElementById("currentDate").textContent = currentDate;
loadDataForDate(currentDate);

function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

function addExpenseRow(description = "", amount = "") {
  const entry = document.createElement("div");
  entry.className = "expense-entry";

  entry.innerHTML = `
    <input type="text" placeholder="Description" class="desc" value="${description}" />
    <input type="number" placeholder="Amount" class="amt" value="${amount}" />
    <button class="remove-btn" onclick="removeEntry(this)">✕</button>
  `;

  document.getElementById("expenseList").appendChild(entry);
  updateTotal();
}

function removeEntry(btn) {
  btn.parentElement.remove();
  updateTotal();
}

function updateTotal() {
  const amounts = document.querySelectorAll(".amt");
  let total = 0;
  amounts.forEach(input => {
    total += parseFloat(input.value) || 0;
  });
  document.getElementById("totalAmount").textContent = "PHP " + total.toFixed(2);
}

document.getElementById("addMore").addEventListener("click", () => {
  addExpenseRow();
});

document.getElementById("expenseList").addEventListener("input", updateTotal);

document.getElementById("saveBtn").addEventListener("click", () => {
  const descriptions = Array.from(document.querySelectorAll(".desc")).map(i => i.value);
  const amounts = Array.from(document.querySelectorAll(".amt")).map(i => parseFloat(i.value) || 0);
  const entries = descriptions.map((desc, i) => ({ desc, amt: amounts[i] }));

  data[currentDate] = entries;
  localStorage.setItem("expenseData", JSON.stringify(data));

  showConfirmation("Your track today was successfully saved.");
  clearForm();
  loadDataForDate(currentDate);
});

function showConfirmation(message) {
  const msgBox = document.createElement("div");
  msgBox.className = "confirmation";
  msgBox.textContent = message;
  document.body.appendChild(msgBox);
  setTimeout(() => msgBox.remove(), 2500);
}

function clearForm() {
  document.getElementById("expenseList").innerHTML = "";
  updateTotal();
}

document.getElementById("datePicker").addEventListener("change", (e) => {
  currentDate = e.target.value;
  document.getElementById("currentDate").textContent = currentDate;
  loadDataForDate(currentDate);
});

function loadDataForDate(date) {
  clearForm();
  if (data[date]) {
    data[date].forEach(entry => {
      addExpenseRow(entry.desc, entry.amt);
    });
  } else {
    addExpenseRow();
  }
}

document.getElementById("historyBtn").addEventListener("click", () => {
  const history = Object.keys(data).sort().reverse().map(date => {
    return `<li onclick="selectHistoryDate('${date}')">${date}</li>`;
  }).join("");
  document.getElementById("historyList").innerHTML = history;
  document.getElementById("historyPopup").style.display = "block";
});

function selectHistoryDate(date) {
  currentDate = date;
  document.getElementById("datePicker").value = date;
  document.getElementById("currentDate").textContent = date;
  loadDataForDate(date);
  document.getElementById("historyPopup").style.display = "none";
}

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expense_data.json";
  a.click();
});

document.getElementById("clearHistoryPopup").addEventListener("click", () => {
  document.getElementById("historyPopup").style.display = "none";
});
