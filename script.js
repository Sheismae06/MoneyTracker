// Music toggle
let musicPlaying = false;
let audio = new Audio("https://youtu.be/qBeX-iF_SpM?si=2Ohr_qvAAV-LOzHh");

document.getElementById("musicToggle").addEventListener("click", () => {
  musicPlaying ? audio.pause() : audio.play();
  musicPlaying = !musicPlaying;
});

// Populate month/year/day dropdowns
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
const daySelect = document.getElementById("daySelect");

months.forEach((m, i) => {
  let opt = document.createElement("option");
  opt.value = i;
  opt.textContent = m;
  monthSelect.appendChild(opt);
});

for (let y = 2025; y >= 2019; y--) {
  let opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y;
  yearSelect.appendChild(opt);
}

for (let d = 1; d <= 31; d++) {
  let opt = document.createElement("option");
  opt.value = d;
  opt.textContent = d;
  daySelect.appendChild(opt);
}

// Salary calculation
document.getElementById("cutoff1").addEventListener("input", calcSalary);
document.getElementById("cutoff2").addEventListener("input", calcSalary);

function calcSalary() {
  let c1 = parseFloat(document.getElementById("cutoff1").value) || 0;
  let c2 = parseFloat(document.getElementById("cutoff2").value) || 0;
  document.getElementById("totalSalary").textContent = `₱${c1 + c2}`;
}

// Add entry
function addEntry() {
  const entriesDiv = document.querySelector(".entries");
  const newEntry = document.createElement("div");
  newEntry.className = "entry";
  newEntry.innerHTML = \`
    <input type="text" placeholder="Label (e.g., Food)" class="label-input" />
    <input type="number" placeholder="Amount" class="amount-input" />
    <button onclick="this.parentElement.remove(); updateTotal()">Delete</button>
  \`;
  entriesDiv.insertBefore(newEntry, entriesDiv.children[entriesDiv.children.length - 3]);
  updateTotal();
}

// Update total
document.querySelector(".entries").addEventListener("input", updateTotal);

function updateTotal() {
  const amounts = document.querySelectorAll(".amount-input");
  let total = 0;
  amounts.forEach(input => total += parseFloat(input.value) || 0);
  document.getElementById("dailyTotal").textContent = \`₱\${total}\`;
}

// Save day
function saveDay() {
  const month = months[monthSelect.value];
  const year = yearSelect.value;
  const day = daySelect.value;
  const key = \`\${year}-\${month}-\${day}\`;
  const labels = document.querySelectorAll(".label-input");
  const amounts = document.querySelectorAll(".amount-input");

  let data = [];
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].value && amounts[i].value) {
      data.push({ label: labels[i].value, amount: parseFloat(amounts[i].value) });
    }
  }
  localStorage.setItem(key, JSON.stringify(data));
  renderRecords();
}

// Render records
function renderRecords() {
  const records = document.getElementById("records");
  records.innerHTML = "";
  let keys = Object.keys(localStorage).filter(k => k.match(/^\d{4}-/));
  keys.sort();

  let allTotals = [];
  keys.forEach(key => {
    const data = JSON.parse(localStorage.getItem(key));
    let total = data.reduce((sum, item) => sum + item.amount, 0);
    allTotals.push({ date: key, total });

    const div = document.createElement("div");
    div.innerHTML = \`\${key}: ₱\${total.toFixed(2)}
      <button onclick="editRecord('\${key}')">Edit</button>
      <button onclick="deleteRecord('\${key}')">Delete</button>\`;
    records.appendChild(div);
  });

  drawChart(allTotals);
  const grandTotal = allTotals.reduce((sum, item) => sum + item.total, 0);
  document.getElementById("overallTotal").textContent = \`₱\${grandTotal.toFixed(2)}\`;
}

// Edit
function editRecord(key) {
  const data = JSON.parse(localStorage.getItem(key));
  document.querySelectorAll(".entry").forEach(e => e.remove());

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = \`
      <input type="text" class="label-input" value="\${item.label}" />
      <input type="number" class="amount-input" value="\${item.amount}" />
      <button onclick="this.parentElement.remove(); updateTotal()">Delete</button>\`;
    document.querySelector(".entries").insertBefore(div, document.querySelector(".entries").children[0]);
  });
  updateTotal();
}

// Delete
function deleteRecord(key) {
  localStorage.removeItem(key);
  renderRecords();
}

// Chart
let chart;
function drawChart(data) {
  const ctx = document.getElementById("spendingChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map(d => d.date),
      datasets: [{
        label: "Expenses",
        data: data.map(d => d.total),
        borderColor: "gold",
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

renderRecords();
