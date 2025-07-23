let trackData = JSON.parse(localStorage.getItem("trackData")) || [];

function saveTrack() {
  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (!date || !description || isNaN(amount)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  trackData.push({ date, description, amount });
  localStorage.setItem("trackData", JSON.stringify(trackData));
  document.getElementById("trackForm").reset();
  alert("Saved successfully!");
}

function renderTable(data) {
  const tableBody = document.getElementById("trackTableBody");
  tableBody.innerHTML = "";
  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.date}</td>
      <td>${item.description}</td>
      <td>₱${item.amount.toFixed(2)}</td>
      <td>
        <button onclick="editTrack(${index})">Edit</button>
        <button onclick="confirmDelete(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  const total = data.reduce((sum, item) => sum + item.amount, 0);
  document.getElementById("filteredTotal").innerText =
    data.length > 0
      ? `Total Amount: ₱${total.toFixed(2)}`
      : "No data found in selected range.";
}

function filterData() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const sortBy = document.getElementById("sortBy").value;

  if (!startDate || !endDate) {
    alert("Please select a start and end date.");
    return;
  }

  let filtered = trackData.filter(item => item.date >= startDate && item.date <= endDate);

  switch (sortBy) {
    case "dateAsc":
      filtered.sort((a, b) => a.date.localeCompare(b.date));
      break;
    case "dateDesc":
      filtered.sort((a, b) => b.date.localeCompare(a.date));
      break;
    case "amountAsc":
      filtered.sort((a, b) => a.amount - b.amount);
      break;
    case "amountDesc":
      filtered.sort((a, b) => b.amount - a.amount);
      break;
  }

  renderTable(filtered);
}

function resetFilter() {
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  document.getElementById("sortBy").value = "";
  renderTable(trackData);
  document.getElementById("filteredTotal").innerText = "";
}

function confirmDelete(index) {
  if (confirm("Are you sure you want to delete this entry?")) {
    deleteTrack(index);
  }
}

function deleteTrack(index) {
  trackData.splice(index, 1);
  localStorage.setItem("trackData", JSON.stringify(trackData));
  filterData();
}

function editTrack(index) {
  const newDate = prompt("Edit Date (YYYY-MM-DD):", trackData[index].date);
  const newDesc = prompt("Edit Description:", trackData[index].description);
  const newAmt = prompt("Edit Amount:", trackData[index].amount);

  if (newDate && newDesc && !isNaN(parseFloat(newAmt))) {
    trackData[index].date = newDate;
    trackData[index].description = newDesc;
    trackData[index].amount = parseFloat(newAmt);
    localStorage.setItem("trackData", JSON.stringify(trackData));
    filterData();
  } else {
    alert("Invalid input. Edit cancelled.");
  }
}

// Load all data on page load (optional)
// renderTable(trackData);
