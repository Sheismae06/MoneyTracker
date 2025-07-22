document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("expense-form");
  const addMoreBtn = document.getElementById("add-more");
  const dateInput = document.getElementById("date");
  const totalDisplay = document.getElementById("total");
  const trackList = document.getElementById("track-list");
  const yearFilter = document.getElementById("yearFilter");
  const monthFilter = document.getElementById("monthFilter");
  const dayFilter = document.getElementById("dayFilter");
  const filterBtn = document.getElementById("filterBtn");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Populate filter dropdowns
  function populateFilters() {
    for (let y = 2025; y <= 3000; y++) {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      yearFilter.appendChild(opt);
    }

    months.forEach((month, index) => {
      const opt = document.createElement("option");
      opt.value = index + 1;
      opt.textContent = month;
      monthFilter.appendChild(opt);
    });

    for (let d = 1; d <= 31; d++) {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      dayFilter.appendChild(opt);
    }
  }

  populateFilters();

  // Add more expense fields
  addMoreBtn.addEventListener("click", () => {
    const newRow = document.createElement("div");
    newRow.classList.add("expense-row");
    newRow.innerHTML = `
      <input type="text" class="description" placeholder="Description" required />
      <input type="number" class="amount" placeholder="Amount" required />
    `;
    document.getElementById("expense-fields").appendChild(newRow);
  });

  // Save expenses
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedDate = dateInput.value;
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    const rows = document.querySelectorAll(".expense-row");
    const entries = [];

    let total = 0;

    rows.forEach(row => {
      const description = row.querySelector(".description").value.trim();
      const amount = parseFloat(row.querySelector(".amount").value);

      if (description && !isNaN(amount)) {
        entries.push({ description, amount });
        total += amount;
      }
    });

    if (entries.length === 0) {
      alert("Please enter at least one valid expense.");
      return;
    }

    const data = JSON.parse(localStorage.getItem("expenses") || "{}");
    data[selectedDate] = entries;
    localStorage.setItem("expenses", JSON.stringify(data));

    alert("Expenses saved!");
    totalDisplay.textContent = total.toFixed(2);
    loadTracks();
  });

  // Load and display saved expenses
  function loadTracks(filter = {}) {
    trackList.innerHTML = "";
    const data = JSON.parse(localStorage.getItem("expenses") || "{}");

    const filteredDates = Object.keys(data).filter(date => {
      const [year, month, day] = date.split("-").map(Number);

      if (filter.year && filter.year !== year) return false;
      if (filter.month && filter.month !== month) return false;
      if (filter.day && filter.day !== day) return false;
      return true;
    });

    if (filteredDates.length === 0) {
      trackList.innerHTML = "<p>No records found for the selected filter.</p>";
      return;
    }

    filteredDates.forEach(date => {
      const entry = document.createElement("div");
      entry.classList.add("track-entry");
      entry.innerHTML = `<h4>${date}</h4>`;
      const ul = document.createElement("ul");
      let total = 0;
      data[date].forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.description}: PHP ${item.amount.toFixed(2)}`;
        ul.appendChild(li);
        total += item.amount;
      });
      entry.appendChild(ul);
      entry.innerHTML += `<strong>Total: PHP ${total.toFixed(2)}</strong>`;
      trackList.appendChild(entry);
    });
  }

  // Filter button
  filterBtn.addEventListener("click", () => {
    const filter = {
      year: parseInt(yearFilter.value),
      month: parseInt(monthFilter.value),
      day: parseInt(dayFilter.value)
    };

    if (!filter.year || !filter.month || !filter.day) {
      alert("Please select full date for filtering.");
      return;
    }

    loadTracks(filter);
  });

  loadTracks(); // Load initial
});
