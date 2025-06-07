document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("appointment-modal");
  const openBtn = document.getElementById("new-appointment-btn");
  const closeBtn = document.getElementById("close-modal");
  const form = document.getElementById("appointment-form");
  const tableBody = document.getElementById("appointment-table-body");
  const dateFilter = document.getElementById("date-filter");
  const customRangeSection = document.getElementById("custom-range");
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");

  // Modal open/close
  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const patientName = document.getElementById("patient-name").value.trim();
    const appointmentDate = document.getElementById("appointment-date").value;
    const appointmentTime = document.getElementById("appointment-time").value;

    try {
      const response = await fetch(`/api/check-patient?name=${encodeURIComponent(patientName)}`);
      const data = await response.json();

      if (!data.exists) {
        alert("Error: Patient not found in the database.");
        return;
      }

      const newRow = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = patientName;

      const dateCell = document.createElement("td");
      dateCell.textContent = appointmentDate;

      const timeCell = document.createElement("td");
      timeCell.textContent = appointmentTime;

      const dentistCell = document.createElement("td");
      dentistCell.textContent = form.elements[3].value;

      const treatmentCell = document.createElement("td");
      treatmentCell.textContent = form.elements[4].value;

      const statusCell = document.createElement("td");
      statusCell.textContent = form.elements[5].value;

      const actionCell = document.createElement("td");
      actionCell.innerHTML = '<button class="text-red-500">Delete</button>';

      newRow.append(nameCell, dateCell, timeCell, dentistCell, treatmentCell, statusCell, actionCell);
      tableBody.appendChild(newRow);

      form.reset();
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      sortAppointments();
      filterAppointments();
    } catch (error) {
      alert("Error checking patient. Please try again later.");
      console.error(error);
    }
  });

  function sortAppointments() {
    const rows = Array.from(tableBody.querySelectorAll("tr"));

    rows.sort((a, b) => {
      const aDate = new Date(`${a.children[1].textContent}T${a.children[2].textContent}`);
      const bDate = new Date(`${b.children[1].textContent}T${b.children[2].textContent}`);
      return aDate - bDate;
    });

    tableBody.innerHTML = "";
    rows.forEach(row => tableBody.appendChild(row));
  }

  dateFilter.addEventListener("change", () => {
    if (dateFilter.value === "custom") {
      customRangeSection.classList.remove("hidden");
    } else {
      customRangeSection.classList.add("hidden");
      filterAppointments();
    }
  });

  [startDateInput, endDateInput].forEach(input =>
    input.addEventListener("change", filterAppointments)
  );

  function filterAppointments() {
    const rows = tableBody.querySelectorAll("tr");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let start = null;
    let end = null;

    if (dateFilter.value === "today") {
      start = new Date(today);
      end = new Date(today);
      end.setHours(23, 59, 59);
    } else if (dateFilter.value === "this-week") {
      const day = today.getDay(); // Sunday = 0
      start = new Date(today);
      start.setDate(today.getDate() - day);
      end = new Date(today);
      end.setDate(today.getDate() + (6 - day));
      end.setHours(23, 59, 59);
    } else if (dateFilter.value === "custom") {
      if (!startDateInput.value || !endDateInput.value) return;
      start = new Date(startDateInput.value);
      end = new Date(endDateInput.value);
      end.setHours(23, 59, 59);
    }

    rows.forEach(row => {
      const dateText = row.children[1].textContent;
      const rowDate = new Date(dateText);
      rowDate.setHours(0, 0, 0, 0);

      const show = !start || (rowDate >= start && rowDate <= end);
      row.style.display = show ? "" : "none";
    });
  }
});