// Elements
const bgMusic = document.getElementById("bg-music");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
const tableBody = document.querySelector("#entries-table tbody");
const totalsDiv = document.getElementById("totals");

// Music Toggle
musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicIcon.style.opacity = "1";
    musicIcon.style.filter = "drop-shadow(0 0 5px gold)";
  } else {
    bgMusic.pause();
    musicIcon.style.opacity = "0.5";
    musicIcon.style.filter = "none";
  }
});

// Save Entry
function saveEntry() {
  const date = document.getElementById("entry-date").value;
  const amount = parseFloat(document.getElementById("entry-amount").value);
  const type = document.getElementById("entry-type").value;
  const note = document.getElementById("entry-note").value;

  if (!date || isNaN(amount)) {
    alert("Please fill in both date and amount.");
    return;
  }

  const entry = { date, amount, type, note };
  const entries = JSON.parse(localStorage.getItem("moneyEntries")) || [];
  entries.push(entry);
  localStorage.setItem("moneyEntries", JSON.stringify(entries));
  renderEntries();
}

// Render Entries
function renderEntries() {
  const entries = JSON.parse(localStorage.getItem("moneyEntries")) || [];
  tableBody.innerHTML = "";

  let totalIncome = 0;
  let totalExpense = 0;

  entries.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>₱${entry.amount.toFixed(2)}</td>
      <td>${entry.type}</td>
      <td>${entry.note}</td>
      <td><button onclick="deleteEntry(${index})">🗑️</button></td>
    `;
    tableBody.appendChild(row);

    if (entry.type === "income") totalIncome += entry.amount;
    else totalExpense += entry.amount;
  });

  const balance = totalIncome - totalExpense;

  totalsDiv.innerHTML = `
    <p><strong>Total Income:</strong> ₱${totalIncome.toFixed(2)}</p>
    <p><strong>Total Expenses:</strong> ₱${totalExpense.toFixed(2)}</p>
    <p><strong>Remaining Balance:</strong> ₱${balance.toFixed(2)}</p>
  `;
}

// Delete Entry
function deleteEntry(index) {
  const entries = JSON.parse(localStorage.getItem("moneyEntries")) || [];
  entries.splice(index, 1);
  localStorage.setItem("moneyEntries", JSON.stringify(entries));
  renderEntries();
}

// Auto-load entries on page load
window.addEventListener("DOMContentLoaded", renderEntries);
