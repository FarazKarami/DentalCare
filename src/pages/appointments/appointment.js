document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("appointment-modal");
  const openBtn = document.getElementById("new-appointment-btn");
  const closeBtn = document.getElementById("close-modal");
  const form = document.getElementById("appointment-form");
  const tableBody = document.getElementById("appointment-table-body");
  let editAppointmentId = null; // Track if we're editing an existing appointment

  // Open modal for new appointment
  openBtn.addEventListener("click", () => {
    editAppointmentId = null; // New appointment mode
    form.reset();
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  // Load all appointments from backend on page load
  async function loadAppointments() {
    try {
      const response = await fetch("/api/appointments");
      const appointments = await response.json();

      tableBody.innerHTML = "";
      appointments.forEach(addAppointmentRow);
      sortAppointments();
    } catch (error) {
      console.error("Error loading appointments:", error);
      alert("Failed to load appointments from server.");
    }
  }

  // Add a row to the table with listeners
  function addAppointmentRow(appointment) {
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td class="p-3">${appointment.patientName}</td>
      <td class="p-3">${appointment.date}</td>
      <td class="p-3">${appointment.time}</td>
      <td class="p-3">${appointment.dentist}</td>
      <td class="p-3">${appointment.treatment}</td>
      <td class="p-3">${appointment.status}</td>
      <td class="p-3 space-x-2">
        <button class="edit-btn text-blue-600 hover:underline" data-id="${appointment.id}">Edit</button>
        <button class="delete-btn text-red-600 hover:underline" data-id="${appointment.id}">Delete</button>
      </td>
    `;

    addActionListeners(newRow);
    tableBody.appendChild(newRow);
  }

  // Attach Edit/Delete event listeners
  function addActionListeners(row) {
    const deleteBtn = row.querySelector(".delete-btn");
    const editBtn = row.querySelector(".edit-btn");

    deleteBtn.addEventListener("click", async () => {
      const id = deleteBtn.dataset.id;
      if (confirm("Are you sure you want to delete this appointment?")) {
        try {
          const response = await fetch(`/api/appointments/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            row.remove();
          } else {
            alert("Failed to delete appointment.");
          }
        } catch (error) {
          alert("Error deleting appointment.");
          console.error(error);
        }
      }
    });

    editBtn.addEventListener("click", () => {
      const id = editBtn.dataset.id;
      editAppointmentId = id;

      // Fill form with appointment data
      const cells = row.children;
      document.getElementById("patient-name").value = cells[0].textContent;
      document.getElementById("appointment-date").value = cells[1].textContent;
      document.getElementById("appointment-time").value = cells[2].textContent;
      form.elements[3].value = cells[3].textContent; // dentist
      form.elements[4].value = cells[4].textContent; // treatment
      form.elements[5].value = cells[5].textContent; // status

      modal.classList.remove("hidden");
      modal.classList.add("flex");
    });
  }

  // Form submission for Add or Edit
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const patientName = document.getElementById("patient-name").value.trim();
    const appointmentDate = document.getElementById("appointment-date").value;
    const appointmentTime = document.getElementById("appointment-time").value;
    const dentist = form.elements[3].value;
    const treatment = form.elements[4].value;
    const status = form.elements[5].value;

    try {
      // Verify patient exists
      const checkResponse = await fetch(`/api/check-patient?name=${encodeURIComponent(patientName)}`);
      const checkData = await checkResponse.json();

      if (!checkData.exists) {
        alert("Error: Patient not found in the database.");
        return;
      }

      const appointmentData = {
        patientName,
        date: appointmentDate,
        time: appointmentTime,
        dentist,
        treatment,
        status,
      };

      if (editAppointmentId) {
        // Edit existing appointment - PUT
        const response = await fetch(`/api/appointments/${editAppointmentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appointmentData),
        });

        if (!response.ok) {
          alert("Failed to update appointment.");
          return;
        }

        // Update the row in the table
        const rows = Array.from(tableBody.querySelectorAll("tr"));
        const rowToUpdate = rows.find(row => row.querySelector(".edit-btn").dataset.id === editAppointmentId);
        if (rowToUpdate) {
          rowToUpdate.children[0].textContent = patientName;
          rowToUpdate.children[1].textContent = appointmentDate;
          rowToUpdate.children[2].textContent = appointmentTime;
          rowToUpdate.children[3].textContent = dentist;
          rowToUpdate.children[4].textContent = treatment;
          rowToUpdate.children[5].textContent = status;
        }

      } else {
        // Add new appointment - POST
        const response = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appointmentData),
        });

        if (!response.ok) {
          alert("Failed to add appointment.");
          return;
        }

        const newAppointment = await response.json();
        addAppointmentRow(newAppointment);
      }

      form.reset();
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      sortAppointments();

    } catch (error) {
      alert("Error processing appointment.");
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

  // Initial load
  loadAppointments();
});