document.addEventListener('DOMContentLoaded', () => {
  const incomeInput = document.getElementById('income');
  const expensesInput = document.getElementById('expenses');
  const savingsDisplay = document.getElementById('savings');
  const datePicker = document.getElementById('datePicker');
  const saveBtn = document.getElementById('saveBtn');
  const trackLog = document.getElementById('trackLog');

  // Set today's date as default
  const today = new Date().toISOString().split('T')[0];
  datePicker.value = today;

  function updateSavings() {
    const income = parseFloat(incomeInput.value) || 0;
    const expenses = parseFloat(expensesInput.value) || 0;
    const savings = income - expenses;
    savingsDisplay.textContent = `₱ ${savings.toFixed(2)}`;
  }

  function saveData() {
    const date = datePicker.value;
    const data = {
      income: incomeInput.value,
      expenses: expensesInput.value,
    };
    localStorage.setItem(`moneyData-${date}`, JSON.stringify(data));
    showSavedMessage();
    renderLog(date);
  }

  function loadData(date) {
    const saved = JSON.parse(localStorage.getItem(`moneyData-${date}`));
    if (saved) {
      incomeInput.value = saved.income;
      expensesInput.value = saved.expenses;
    } else {
      incomeInput.value = '';
      expensesInput.value = '';
    }
    updateSavings();
    renderLog(date);
  }

  function renderLog(date) {
    const saved = JSON.parse(localStorage.getItem(`moneyData-${date}`));
    if (saved) {
      trackLog.innerHTML = `
        <div class="log-entry">
          <h4>📅 ${date}</h4>
          <p>💰 Income: ₱ ${saved.income}</p>
          <p>💸 Expenses: ₱ ${saved.expenses}</p>
          <p>💼 Savings: ₱ ${(saved.income - saved.expenses).toFixed(2)}</p>
        </div>
      `;
    } else {
      trackLog.innerHTML = `<p class="no-log">No tracking found for this date.</p>`;
    }
  }

  function showSavedMessage() {
    saveBtn.textContent = "✔ Saved!";
    saveBtn.disabled = true;
    setTimeout(() => {
      saveBtn.textContent = "Save";
      saveBtn.disabled = false;
    }, 1500);
  }

  // Event Listeners
  incomeInput.addEventListener('input', updateSavings);
  expensesInput.addEventListener('input', updateSavings);
  datePicker.addEventListener('change', () => loadData(datePicker.value));
  saveBtn.addEventListener('click', saveData);

  // Initial Load
  loadData(today);
});
