document.addEventListener("DOMContentLoaded", async () => {
  // Get the patient ID from the URL query string (?id=...)
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get("id");

  // Get form and input elements
  const nameInput = document.getElementById("patientName");
  const idInput = document.getElementById("patientId");
  const phoneInput = document.getElementById("patientPhone");
  const form = document.getElementById("editPatientForm");
  const errorEl = document.getElementById("error");

  let patient;

  // ✅ Fetch the patient data from the backend using the ID
  try {
    const res = await fetch(`/api/patients/${patientId}`);
    if (!res.ok) throw new Error("Not found");
    patient = await res.json(); // Parse the response JSON
  } catch (err) {
    // Show error if patient is not found
    errorEl.textContent = "Patient not found.";
    return;
  }

  // 🟢 Pre-fill form inputs with patient data
  nameInput.value = patient.name;
  idInput.value = patient.id;
  phoneInput.value = patient.phone;
  idInput.disabled = true; // ID should not be editable

  // 🔁 When the form is submitted
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    // ❌ Validation: name should not contain numbers
    if (/\d/.test(name)) {
      errorEl.textContent = "Name cannot contain numbers.";
      return;
    }

    // ❌ Validation: phone should be exactly 10 digits
    if (!/^\d{10}$/.test(phone)) {
      errorEl.textContent = "Phone number must be exactly 10 digits.";
      return;
    }

    // ✅ Send a PUT request to update the patient on the backend
    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }), // Updated fields
      });

      if (!res.ok) throw new Error("Update failed");

      // Show success message
      alert("Patient updated successfully!");
    } catch (err) {
      console.error(err);
      errorEl.textContent = "Failed to update patient."; // Show error to user
    }
  });
});