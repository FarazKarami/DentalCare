document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get("id");
  const nameInput = document.getElementById("patientName");
  const idInput = document.getElementById("patientId");
  const phoneInput = document.getElementById("patientPhone");
  const form = document.getElementById("editPatientForm");
  const errorEl = document.getElementById("error");

  let patients = JSON.parse(localStorage.getItem("patients")) || [];
  const patient = patients.find(p => p.id === patientId);

  if (!patient) {
    errorEl.textContent = "Patient not found.";
    return;
  }

  nameInput.value = patient.name;
  idInput.value = patient.id;
  phoneInput.value = patient.phone;
  idInput.disabled = true;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (/\d/.test(name)) {
      errorEl.textContent = "Name cannot contain numbers.";
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      errorEl.textContent = "Phone number must be exactly 10 digits.";
      return;
    }

    patient.name = name;
    patient.phone = phone;

    localStorage.setItem("patients", JSON.stringify(patients));
    alert("Patient updated successfully!");
  });
});