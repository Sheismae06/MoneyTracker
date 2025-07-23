// ✅ script.js — Updated with full filtering, edit/delete with confirmation, and total computation

// Get elements const trackForm = document.getElementById("trackForm"); const saveBtn = document.getElementById("saveBtn"); const trackDataDiv = document.getElementById("trackData"); const startDate = document.getElementById("startDate"); const endDate = document.getElementById("endDate"); const filterBtn = document.getElementById("filterBtn"); const totalDisplay = document.getElementById("totalDisplay");

// ✅ Save Data saveBtn.addEventListener("click", function (e) { e.preventDefault();

const date = document.getElementById("date").value; const description = document.getElementById("description").value; const amount = parseFloat(document.getElementById("amount").value);

if (!date || !description || isNaN(amount)) { alert("Please fill in all fields correctly."); return; }

const data = JSON.parse(localStorage.getItem("moneyData") || "{}");

if (!data[date]) { data[date] = []; }

data[date].push({ description, amount });

localStorage.setItem("moneyData", JSON.stringify(data)); alert("Saved successfully!"); trackForm.reset(); });

// ✅ Filter and Display Data filterBtn.addEventListener("click", function () { const start = startDate.value; const end = endDate.value; if (!start || !end) { alert("Please select both start and end dates."); return; }

const data = JSON.parse(localStorage.getItem("moneyData") || "{}"); const displayItems = []; let totalAmount = 0;

const startD = new Date(start); const endD = new Date(end);

trackDataDiv.innerHTML = "";

for (const date in data) { const currentD = new Date(date); if (currentD >= startD && currentD <= endD) { data[date].forEach((entry, idx) => { totalAmount += entry.amount; const div = document.createElement("div"); div.className = "entry-item"; div.innerHTML = <strong>${date}</strong> - ${entry.description}: PHP ${entry.amount.toFixed(2)} <button onclick="editEntry('${date}', ${idx})">✏️ Edit</button> <button onclick="confirmDelete('${date}', ${idx})">🗑️ Delete</button>; trackDataDiv.appendChild(div); }); } }

if (totalAmount > 0) { totalDisplay.innerHTML = 🔢 <strong>Total for selected dates:</strong> PHP ${totalAmount.toFixed(2)}; } else { totalDisplay.innerHTML = "No data found in selected range."; } });

// ✅ Delete with Confirmation function confirmDelete(date, index) { if (confirm("Are you sure you want to delete this entry?")) { const data = JSON.parse(localStorage.getItem("moneyData") || "{}"); data[date].splice(index, 1); if (data[date].length === 0) delete data[date]; localStorage.setItem("moneyData", JSON.stringify(data)); filterBtn.click(); // refresh filtered view } }

// ✅ Edit Entry function editEntry(date, index) { const data = JSON.parse(localStorage.getItem("moneyData") || "{}"); const entry = data[date][index];

const newDesc = prompt("Edit description:", entry.description); if (newDesc === null) return; const newAmount = prompt("Edit amount:", entry.amount); if (newAmount === null || isNaN(parseFloat(newAmount))) return;

data[date][index] = { description: newDesc, amount: parseFloat(newAmount) }; localStorage.setItem("moneyData", JSON.stringify(data)); filterBtn.click(); }

// ✅ Optional: auto load recent dates // filterBtn.click();

