// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("tracker-form");
  const saveBtn = document.getElementById("save-btn");
  const datePicker = document.getElementById("date-picker");
  const confirmation = document.getElementById("confirmation");
  const exportBtn = document.getElementById("export-btn");

  // Load saved track based on selected date
  datePicker.addEventListener("change", function () {
    const selectedDate = this.value;
    loadTrackForDate(selectedDate);
  });

  // On Save
  saveBtn.addEventListener("click", function () {
    const currentDate = new Date().toISOString().split("T")[0];
    const data = getFormData();
    if (Object.values(data).some(value => value !== "")) {
      localStorage.setItem(`track-${currentDate}`, JSON.stringify(data));
      showConfirmation("Your track today was successfully saved.");
      form.reset();
    } else {
      showConfirmation("Please fill in at least one field before saving.");
    }
  });

  // Export to file
  exportBtn.addEventListener("click", function () {
    let allData = "";
    for (let key in localStorage) {
      if (key.startsWith("track-")) {
        const date = key.replace("track-", "");
        const entry = JSON.parse(localStorage.getItem(key));
        allData += `📅 ${date}\n`;
        for (let field in entry) {
          allData += `• ${capitalize(field)}: ${entry[field]}\n`;
        }
        allData += "\n";
      }
    }

    const blob = new Blob([allData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "MoneyTracker_History.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  function getFormData() {
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value.trim();
    }
    return data;
  }

  function loadTrackForDate(date) {
    const data = localStorage.getItem(`track-${date}`);
    if (data) {
      const parsed = JSON.parse(data);
      for (const [key, value] of Object.entries(parsed)) {
        const field = form.querySelector(`[name="${key}"]`);
        if (field) field.value = value;
      }
      showConfirmation(`Loaded track from ${date}.`);
    } else {
      form.reset();
      showConfirmation(`No record found for ${date}.`);
    }
  }

  function showConfirmation(message) {
    confirmation.textContent = message;
    confirmation.style.display = "block";
    setTimeout(() => {
      confirmation.style.display = "none";
    }, 3000);
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Load today's track on page load
  const today = new Date().toISOString().split("T")[0];
  datePicker.value = today;
  loadTrackForDate(today);
});
