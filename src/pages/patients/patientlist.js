document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("appointment-table-body");

  // Load patients from backend
  let patients = [];
  try {
    const res = await fetch("/api/patients"); // ✅ Replace with your actual backend endpoint
    patients = await res.json();
    patients.sort((a, b) => a.name.localeCompare(b.name));
    renderTable(patients);
  } catch (error) {
    console.error("Error loading patients:", error);
    alert("Could not load patient list.");
  }

  function renderTable(patients) {
    tableBody.innerHTML = "";

    patients.forEach((patient) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td class="p-3">${patient.name}</td>
        <td class="p-3">+98 ${patient.phone}</td>
        <td class="p-3 space-x-2">
          <button data-id="${patient.id}" class="edit-btn bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
          <button data-id="${patient.id}" class="delete-btn bg-red-500 text-white px-3 py-1 rounded">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    // Edit button → go to edit page with patient ID in query
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const patientId = e.target.dataset.id;
        window.location.href = `editpatient.html?id=${patientId}`;
      });
    });

    // Delete button → call backend to delete patient
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const patientId = e.target.dataset.id;
        if (confirm("Are you sure you want to delete this patient?")) {
          try {
            const res = await fetch(`/api/patients/${patientId}`, {
              method: "DELETE",
            });

            if (res.ok) {
              patients = patients.filter((p) => p.id !== patientId);
              renderTable(patients);
            } else {
              alert("Failed to delete patient.");
            }
          } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting patient.");
          }
        }
      });
    });
  }
});