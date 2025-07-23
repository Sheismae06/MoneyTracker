document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  const expenseForm = document.getElementById("expense-form");
  const expenseFields = document.getElementById("expense-fields");
  const addMoreBtn = document.getElementById("add-more");
  const totalDisplay = document.getElementById("total");
  const trackList = document.getElementById("track-list");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const filterBtn = document.getElementById("filterBtn");

  function calculateTotal() {
    const amounts = expenseFields.querySelectorAll(".amount");
    let total = 0;
    amounts.forEach(input => {
      total += parseFloat(input.value) || 0;
    });
    totalDisplay.textContent = total.toFixed(2);
  }

  expenseFields.addEventListener("input", calculateTotal);

  addMoreBtn.addEventListener("click", () => {
    const row = document.createElement("div");
    row.className = "expense-row";
    row.innerHTML = `
      <input type="text" class="description" placeholder="Description" required />
      <input type="number" class="amount" placeholder="Amount" required />
    `;
    expenseFields.appendChild(row);
  });

  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedDate = dateInput.value;
    if (!selectedDate) return alert("Please select a date first.");

    const descriptions = document.querySelectorAll(".description");
    const amounts = document.querySelectorAll(".amount");

    const entries = [];
    descriptions.forEach((desc, i) => {
      const description = desc.value.trim();
      const amount = parseFloat(amounts[i].value);
      if (description && !isNaN(amount)) {
        entries.push({ description, amount });
      }
    });

    if (entries.length === 0) return alert("Please enter at least one valid expense.");

    const saved = JSON.parse(localStorage.getItem("expenses") || "{}");
    saved[selectedDate] = saved[selectedDate] || [];
    saved[selectedDate].push(...entries);
    localStorage.setItem("expenses", JSON.stringify(saved));

    expenseFields.innerHTML = `
      <div class="expense-row">
        <input type="text" class="description" placeholder="Description" required />
        <input type="number" class="amount" placeholder="Amount" required />
      </div>
    `;
    totalDisplay.textContent = "0.00";
    alert("Saved successfully!");
  });

  filterBtn.addEventListener("click", () => {
    const start = startDateInput.value;
    const end = endDateInput.value;
    if (!start || !end) return alert("Please select both start and end dates.");

    const saved = JSON.parse(localStorage.getItem("expenses") || "{}");
    const filtered = Object.entries(saved).filter(([date]) => {
      return date >= start && date <= end;
    });

    trackList.innerHTML = "";
    if (filtered.length === 0) {
      trackList.innerHTML = "<p>No data found for selected range.</p>";
      return;
    }

    filtered.forEach(([date, entries]) => {
      const dateBox = document.createElement("div");
      dateBox.className = "date-box";
      dateBox.innerHTML = `<h3>${date}</h3>`;
      entries.forEach((entry, idx) => {
        const entryDiv = document.createElement("div");
        entryDiv.className = "entry-row";
        entryDiv.innerHTML = `
          <span>${entry.description} - PHP ${entry.amount.toFixed(2)}</span>
          <button class="edit" data-date="${date}" data-idx="${idx}">✏️ Edit</button>
          <button class="delete" data-date="${date}" data-idx="${idx}">🗑️ Delete</button>
        `;
        dateBox.appendChild(entryDiv);
      });
      trackList.appendChild(dateBox);
    });
  });

  trackList.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("delete")) {
      const date = target.dataset.date;
      const idx = parseInt(target.dataset.idx);
      const saved = JSON.parse(localStorage.getItem("expenses") || "{}");
      if (confirm("Are you sure you want to delete this entry?")) {
        saved[date].splice(idx, 1);
        if (saved[date].length === 0) delete saved[date];
        localStorage.setItem("expenses", JSON.stringify(saved));
        filterBtn.click();
      }
    }

    if (target.classList.contains("edit")) {
      const date = target.dataset.date;
      const idx = parseInt(target.dataset.idx);
      const saved = JSON.parse(localStorage.getItem("expenses") || "{}");
      const entry = saved[date][idx];

      const newDesc = prompt("Edit description:", entry.description);
      const newAmount = prompt("Edit amount:", entry.amount);
      if (newDesc !== null && newAmount !== null && !isNaN(parseFloat(newAmount))) {
        saved[date][idx] = { description: newDesc.trim(), amount: parseFloat(newAmount) };
        localStorage.setItem("expenses", JSON.stringify(saved));
        filterBtn.click();
      }
    }
  });
});
