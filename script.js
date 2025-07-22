// 🎵 Music Toggle
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
const bgMusic = document.getElementById("bg-music");

let isPlaying = false;

musicToggle.addEventListener("click", () => {
  if (isPlaying) {
    bgMusic.pause();
    musicIcon.style.opacity = "0.5";
  } else {
    bgMusic.play();
    musicIcon.style.opacity = "1";
  }
  isPlaying = !isPlaying;
});

// 💾 Save Entry
function saveEntry() {
  const date = document.getElementById("entry-date").value;
  const amount = parseFloat(document.getElementById("entry-amount").value);
  const type = document.getElementById("entry-type").value;
  const note = document.getElementById("entry-note").value;

  if (!date || isNaN(amount)) {
    alert("Please enter a valid date and amount.");
    return;
  }

  const entry = { date, amount, type, note };
  let entries = JSON.parse(localStorage.getItem("entries")) || [];
  entries.push(entry);
  localStorage.setItem("entries", JSON.stringify(entries));

  renderEntries();
  updateTotals();
  renderChart();
  clearForm();
}

// 🧹 Clear Form
function clearForm() {
  document.getElementById("entry-date").value = "";
  document.getElementById("entry-amount").value = "";
  document.getElementById("entry-type").value = "income";
  document.getElementById("entry-note").value = "";
}

// 🧾 Render Entries Table
function renderEntries() {
  const tbody = document.querySelector("#entries-table tbody");
  tbody.innerHTML = "";

  const entries = JSON.parse(localStorage.getItem("entries")) || [];

  entries.forEach((entry, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.date}</td>
      <td>₱${entry.amount.toFixed(2)}</td>
      <td class="${entry.type}">${entry.type}</td>
      <td>${entry.note || ""}</td>
      <td><button onclick="deleteEntry(${index})">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// ❌ Delete Entry
function deleteEntry(index) {
  let entries = JSON.parse(localStorage.getItem("entries")) || [];
  entries.splice(index, 1);
  localStorage.setItem("entries", JSON.stringify(entries));

  renderEntries();
  updateTotals();
  renderChart();
}

// 📊 Update Totals
function updateTotals() {
  const entries = JSON.parse(localStorage.getItem("entries")) || [];

  let income = 0;
  let expense = 0;

  entries.forEach(entry => {
    if (entry.type === "income") {
      income += entry.amount;
    } else {
      expense += entry.amount;
    }
  });

  const balance = income - expense;

  document.getElementById("totals").innerHTML = `
    <p><strong>Income:</strong> ₱${income.toFixed(2)}</p>
    <p><strong>Expenses:</strong> ₱${expense.toFixed(2)}</p>
    <p><strong>Balance:</strong> ₱${balance.toFixed(2)}</p>
  `;
}

// 📈 Render Chart
function renderChart() {
  const ctx = document.getElementById("summary-chart").getContext("2d");

  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  let income = 0;
  let expense = 0;

  entries.forEach(entry => {
    if (entry.type === "income") income += entry.amount;
    else expense += entry.amount;
  });

  if (window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#4caf50", "#f44336"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

// 🚀 Init
window.addEventListener("DOMContentLoaded", () => {
  renderEntries();
  updateTotals();
  renderChart();
});
