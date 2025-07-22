// Music toggle
const music = document.getElementById("bg-music");
const toggle = document.getElementById("musicToggle");
const icon = document.getElementById("musicIcon");

let musicPlaying = false;

toggle.addEventListener("click", () => {
  musicPlaying ? music.pause() : music.play();
  musicPlaying = !musicPlaying;
  updateMusicIcon();
});

function updateMusicIcon() {
  if (musicPlaying) {
    icon.style.opacity = "1";
    icon.querySelector("path").setAttribute("stroke", "gold");
  } else {
    icon.style.opacity = "0.6";
    icon.querySelector("path").setAttribute("stroke", "white");
  }
}

// Save entry
let entries = JSON.parse(localStorage.getItem("entries")) || [];

function saveEntry() {
  const date = document.getElementById("entry-date").value;
  const amount = parseFloat(document.getElementById("entry-amount").value);
  const type = document.getElementById("entry-type").value;
  const note = document.getElementById("entry-note").value;

  if (!date || isNaN(amount)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const entry = {
    id: Date.now(),
    date,
    amount,
    type,
    note
  };

  entries.push(entry);
  localStorage.setItem("entries", JSON.stringify(entries));
  renderEntries();
  updateSummary();
}

// Render entries
function renderEntries() {
  const tableBody = document.querySelector("#entries-table tbody");
  tableBody.innerHTML = "";

  entries.forEach(entry => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${entry.date}</td>
      <td>₱${entry.amount.toFixed(2)}</td>
      <td>${entry.type}</td>
      <td>${entry.note || ""}</td>
      <td>
        <button onclick="deleteEntry(${entry.id})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Delete entry
function deleteEntry(id) {
  entries = entries.filter(e => e.id !== id);
  localStorage.setItem("entries", JSON.stringify(entries));
  renderEntries();
  updateSummary();
}

// Update totals and chart
function updateSummary() {
  const income = entries
    .filter(e => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const expense = entries
    .filter(e => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  document.getElementById("totals").innerHTML = `
    <p><strong>Total Income:</strong> ₱${income.toFixed(2)}</p>
    <p><strong>Total Expense:</strong> ₱${expense.toFixed(2)}</p>
    <p><strong>Balance:</strong> ₱${(income - expense).toFixed(2)}</p>
  `;

  updateChart(income, expense);
}

// Chart setup using Chart.js
let chart;

function updateChart(income, expense) {
  const ctx = document.getElementById("summary-chart").getContext("2d");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#ffd700", "#ff4d4d"]
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

// Initialize
renderEntries();
updateSummary();
