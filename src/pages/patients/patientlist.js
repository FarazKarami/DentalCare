document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("appointment-table-body");

  // Load patients from localStorage and sort by name
  let patients = JSON.parse(localStorage.getItem("patients") || "[]");
  patients.sort((a, b) => a.name.localeCompare(b.name));
  renderTable(patients);

  function renderTable(patients) {
    tableBody.innerHTML = "";

    patients.forEach((patient, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td class="p-3">${patient.name}</td>
        <td class="p-3">+98 ${patient.phone}</td>
        <td class="p-3 space-x-2">
          <button data-index="${index}" class="edit-btn bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
          <button data-index="${index}" class="delete-btn bg-red-500 text-white px-3 py-1 rounded">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    // Add click listeners
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const patient = patients[index];

        localStorage.setItem("editPatientIndex", index);
        localStorage.setItem("editPatientData", JSON.stringify(patient));

        window.location.href = "editpatient.html";
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (confirm("Are you sure you want to delete this patient?")) {
          patients.splice(index, 1);
          localStorage.setItem("patients", JSON.stringify(patients));
          renderTable(patients);
        }
      });
    });
  }
});