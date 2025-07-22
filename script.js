// ===== DOM References =====
const monthSelect = document.getElementById("monthSelect");
const salary1 = document.getElementById("salary1");
const salary2 = document.getElementById("salary2");
const expenses = document.getElementById("expenses");
const weeklyIncomes = document.getElementById("weeklyIncomes");
const addDebtBtn = document.getElementById("addDebt");
const debtsContainer = document.getElementById("debts");
const saveBtn = document.getElementById("saveData");
const exportBtn = document.getElementById("exportData");
const musicIcon = document.getElementById("musicIcon");
const audio = document.getElementById("bgMusic");
const chartCanvas = document.getElementById("summaryChart");
const sideIncomes = document.getElementById("sideIncomes");

// ===== Chart Setup =====
let summaryChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
        labels: ["Salary 1", "Salary 2", "Side Income", "Total Expenses"],
        datasets: [{
            label: "Budget Overview",
            backgroundColor: ["#FFD700", "#FFD700", "#98FB98", "#FF7F7F"],
            data: [0, 0, 0, 0]
        }]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
    }
});

// ===== Event Listeners =====
monthSelect.addEventListener("change", loadData);
addDebtBtn.addEventListener("click", addDebtField);
saveBtn.addEventListener("click", saveData);
exportBtn.addEventListener("click", exportData);
musicIcon.addEventListener("click", toggleMusic);

// ===== Functions =====

function saveData() {
    const data = {
        salary1: salary1.value,
        salary2: salary2.value,
        expenses: expenses.value,
        weeklyIncome: weeklyIncomes.value,
        sideIncome: sideIncomes.value,
        debts: Array.from(debtsContainer.querySelectorAll(".debt-row")).map(row => ({
            name: row.querySelector(".debt-name").value,
            total: row.querySelector(".debt-total").value,
            paid: row.querySelector(".debt-paid").value
        }))
    };
    localStorage.setItem(`budget_${monthSelect.value}`, JSON.stringify(data));
    updateChart();
    alert("✅ Data saved!");
}

function loadData() {
    const saved = localStorage.getItem(`budget_${monthSelect.value}`);
    if (saved) {
        const data = JSON.parse(saved);
        salary1.value = data.salary1 || "";
        salary2.value = data.salary2 || "";
        expenses.value = data.expenses || "";
        weeklyIncomes.value = data.weeklyIncome || "";
        sideIncomes.value = data.sideIncome || "";
        debtsContainer.innerHTML = "";
        (data.debts || []).forEach(debt => addDebtField(debt));
        updateChart();
    } else {
        salary1.value = "";
        salary2.value = "";
        expenses.value = "";
        weeklyIncomes.value = "";
        sideIncomes.value = "";
        debtsContainer.innerHTML = "";
        updateChart();
    }
}

function addDebtField(data = {}) {
    const row = document.createElement("div");
    row.classList.add("debt-row");
    row.innerHTML = `
        <input type="text" class="debt-name" placeholder="Debt name" value="${data.name || ""}">
        <input type="number" class="debt-total" placeholder="Total" value="${data.total || ""}">
        <input type="number" class="debt-paid" placeholder="Paid" value="${data.paid || ""}">
        <span class="debt-remaining">Remaining: ₱0</span>
        <button onclick="this.parentElement.remove(); updateChart();">❌</button>
    `;
    debtsContainer.appendChild(row);
    updateChart();
}

function exportData() {
    const data = {
        salary1: salary1.value,
        salary2: salary2.value,
        expenses: expenses.value,
        weeklyIncome: weeklyIncomes.value,
        sideIncome: sideIncomes.value,
        debts: Array.from(debtsContainer.querySelectorAll(".debt-row")).map(row => ({
            name: row.querySelector(".debt-name").value,
            total: row.querySelector(".debt-total").value,
            paid: row.querySelector(".debt-paid").value
        }))
    };

    let text = `📅 MONTH: ${monthSelect.value}\n\n`;
    text += `💼 SALARY 1: ₱${data.salary1}\n💼 SALARY 2: ₱${data.salary2}\n📋 EXPENSES:\n${data.expenses}\n\n`;
    text += `📆 WEEKLY INCOME:\n${data.weeklyIncome}\n\n💼 SIDE INCOME:\n${data.sideIncome}\n\n`;

    if (data.debts.length) {
        text += `📉 DEBTS:\n`;
        data.debts.forEach(debt => {
            const remaining = debt.total - debt.paid;
            text += `- ${debt.name}: ₱${debt.total} - ₱${debt.paid} = ₱${remaining} remaining\n`;
        });
    }

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Budget_${monthSelect.value}.txt`;
    link.click();
    URL.revokeObjectURL(url);
}

function updateChart() {
    let salaryOne = parseFloat(salary1.value) || 0;
    let salaryTwo = parseFloat(salary2.value) || 0;
    let sideIncomeTotal = 0;

    // Side income parsing (example format: Ukay - 100 capital + 250 profit)
    const lines = sideIncomes.value.split("\n");
    lines.forEach(line => {
        const match = line.match(/[-+]?[\d]+/g);
        if (match && match.length >= 2) {
            let capital = parseFloat(match[0]);
            let profit = parseFloat(match[1]);
            sideIncomeTotal += profit;
        }
    });

    let expensesList = expenses.value.split("\n");
    let expensesTotal = expensesList.reduce((sum, item) => {
        let num = parseFloat(item.match(/[\d.]+/)?.[0]) || 0;
        return sum + num;
    }, 0);

    summaryChart.data.datasets[0].data = [
        salaryOne,
        salaryTwo,
        sideIncomeTotal,
        expensesTotal
    ];
    summaryChart.update();

    // Update debt remaining
    debtsContainer.querySelectorAll(".debt-row").forEach(row => {
        const total = parseFloat(row.querySelector(".debt-total").value) || 0;
        const paid = parseFloat(row.querySelector(".debt-paid").value) || 0;
        const remaining = total - paid;
        row.querySelector(".debt-remaining").textContent = `Remaining: ₱${remaining}`;
    });
}

function toggleMusic() {
    if (audio.paused) {
        audio.play();
        musicIcon.classList.add("playing");
    } else {
        audio.pause();
        musicIcon.classList.remove("playing");
    }
}

// ===== Initialize =====
window.addEventListener("load", () => {
    loadData();
});
