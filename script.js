// Category list
const categories = ["Food", "Bills", "Transportation", "Others"];

// Initialize totals for each category
const categoryTotals = {
  Food: 0,
  Bills: 0,
  Transportation: 0,
  Others: 0,
};

// Initialize Chart.js pie chart
const ctx = document.getElementById("expenseChart").getContext("2d");
const expenseChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: categories,
    datasets: [{
      label: "Expenses",
      data: categories.map(cat => categoryTotals[cat]),
      backgroundColor: ["#FFC107", "#2196F3", "#4CAF50", "#E91E63"],
      borderWidth: 1,
    }],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white",
        },
      },
    },
  },
});

// Handle form submission
document.getElementById("expenseForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (!isNaN(amount) && categories.includes(category)) {
    // Update total
    categoryTotals[category] += amount;

    // Update chart data
    expenseChart.data.datasets[0].data = categories.map(cat => categoryTotals[cat]);
    expenseChart.update();
  }

  // Reset the form
  document.getElementById("expenseForm").reset();
});
