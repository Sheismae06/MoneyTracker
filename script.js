document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  const form = document.getElementById("expense-form");
  const addMoreBtn = document.getElementById("add-more");
  const expenseFields = document.getElementById("expense-fields");
  const totalDisplay = document.getElementById("total");
  const trackList = document.getElementById("track-list");

  let editingEntry = null;

  // Default to today's date
  dateInput.valueAsDate = new Date();

  function calculateTotal() {
    let total = 0;
    const amountInputs = document.querySelectorAll(".amount");
    amountInputs.forEach((input) => {
      total += parseFloat(input.value) || 0;
    });
    totalDisplay.textContent = total.toFixed(2);
  }

  function createExpenseRow(description = "", amount = "") {
    const row = document.createElement("div");
    row.className = "expense-row";

    const descInput = document.createElement("input");
    descInput.type = "text";
    descInput.className = "description";
    descInput.placeholder = "Description";
    descInput.value = description;

    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.className = "amount";
    amountInput.placeholder = "Amount";
    amountInput.value = amount;

    amountInput.addEventListener("input", calculateTotal);

    row.appendChild(descInput);
    row.appendChild(amountInput);

    return row;
  }

  addMoreBtn.addEventListener("click", () => {
    const newRow = createExpenseRow();
    expenseFields.appendChild(newRow);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = dateInput.value;
    if (!date) return alert("Please select a date");

    const expenses = [];
    const rows = expenseFields.querySelectorAll(".expense-row");

    rows.forEach((row) => {
      const description = row.querySelector(".description").value.trim();
      const amount = parseFloat(row.querySelector(".amount").value) || 0;
      if (description) {
        expenses.push({ description, amount });
      }
    });

    if (expenses.length === 0) return alert("Please enter at least one expense.");

    const data = JSON.parse(localStorage.getItem("expenses") || "{}");

    data[date] = expenses;
    localStorage.setItem("expenses", JSON.stringify(data));
    loadSavedTracks();
    form.reset();
    expenseFields.innerHTML = "";
    expenseFields.appendChild(createExpenseRow());
    calculateTotal();
  });

  function loadSavedTracks() {
    trackList.innerHTML = "";
    const data = JSON.parse(localStorage.getItem("expenses") || "{}");

    Object.keys(data).sort().reverse().forEach((date) => {
      const section = document.createElement("div");
      section.className = "track-date";

      const title = document.createElement("h3");
      title.textContent = date;
      section.appendChild(title);

      const list = document.createElement("ul");
      let total = 0;

      data[date].forEach((entry, idx) => {
        const item = document.createElement("li");
        item.innerHTML = `
          <strong>${entry.description}</strong> - PHP ${entry.amount.toFixed(2)}
          <button class="edit-btn" data-date="${date}" data-index="${idx}">✏️</button>
          <button class="delete-btn" data-date="${date}" data-index="${idx}">🗑️</button>
        `;
        total += entry.amount;
        list.appendChild(item);
      });

      const totalEl = document.createElement("p");
      totalEl.innerHTML = `<strong>Total:</strong> PHP ${total.toFixed(2)}`;

      section.appendChild(list);
      section.appendChild(totalEl);
      trackList.appendChild(section);
    });
  }

  trackList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const { date, index } = e.target.dataset;
      const data = JSON.parse(localStorage.getItem("expenses") || "{}");

      data[date].splice(index, 1);
      if (data[date].length === 0) delete data[date];

      localStorage.setItem("expenses", JSON.stringify(data));
      loadSavedTracks();
    }

    if (e.target.classList.contains("edit-btn")) {
      const { date, index } = e.target.dataset;
      const data = JSON.parse(localStorage.getItem("expenses") || "{}");
      const entry = data[date][index];

      // Pre-fill form
      dateInput.value = date;
      expenseFields.innerHTML = "";
      expenseFields.appendChild(createExpenseRow(entry.description, entry.amount));
      calculateTotal();

      // Remove the entry from the list before re-saving
      data[date].splice(index, 1);
      if (data[date].length === 0) delete data[date];
      localStorage.setItem("expenses", JSON.stringify(data));
      loadSavedTracks();
    }
  });

  // Initial load
  expenseFields.appendChild(createExpenseRow());
  loadSavedTracks();
});
