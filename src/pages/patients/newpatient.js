document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form") || document;
  const nameInput = document.querySelector(
    'input[placeholder="Patient\'s name"]'
  );
  const idInput = document.querySelector("input[placeholder='Patient ID']");
  const phoneInput = document.querySelector("input[type='tel']");
  const dobInput = document.querySelector("input[type='date']");
  const noteInput = document.querySelector("textarea");

  //errors
  const nameError = document.getElementById("nameError");
  const idError = document.getElementById("idError");
  const phoneError = document.getElementById("phoneError");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = idInput.value.trim();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const dob = dobInput.value;
    const notes = noteInput.value.trim();

    // Front-end validations...
    if (!/^[A-Za-z\s]{1,50}$/.test(name)) {
      alert("Please use only English letters for the name.");
      return;
    }

    if (!/^\d{5,10}$/.test(id)) {
      alert("ID must be 5 to 10 digits.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Phone must be 10 digits.");
      return;
    }

    // ✅ Check ID in the database via API
    try {
      const res = await fetch(`/api/check-id?id=${id}`);
      const data = await res.json();

      if (data.exists) {
        alert("This ID already exists in the system.");
        return;
      }
    } catch (error) {
      console.error("Error checking ID:", error);
      alert("Could not verify ID. Please try again.");
      return;
    }

    // 🟢 If everything is valid and ID is new, proceed
    // Send to backend
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name, phone, dob, notes }),
      });

      if (!response.ok) {
        throw new Error("Failed to save patient.");
      }

      alert("Form submitted successfully!");
      window.location.href = "managerpatientlist.html";
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit. Please try again.");
    }

    // Reset form if needed
    idInput.value = "";
    nameInput.value = "";
    phoneInput.value = "";
    dobInput.value = "";
    noteInput.value = "";
  });

  // Only English letters and spaces in name
  nameInput.addEventListener("input", () => {
    nameInput.value = nameInput.value.replace(/[^a-zA-Z\s]/g, "");
    if (nameInput.value.length > 50) {
      nameError.classList.remove("hidden");
    } else {
      nameError.classList.add("hidden");
    }
  });

  // Only numbers in ID
  idInput.addEventListener("input", () => {
    idInput.value = idInput.value.replace(/\D/g, "");
    if (idInput.value.length != 10) {
      idError.textContent = "ID number must be exactly 10 digits.";
      idError.classList.remove("hidden");
    } else {
      idError.classList.add("hidden");
    }
  });

  // Only numbers in phone number
  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "");
    if (phoneInput.value.length != 10) {
      phoneError.textContent = "Phone number must be exactly 10 digits.";
      phoneError.classList.remove("hidden");
    } else {
      phoneError.classList.add("hidden");
    }
  });
});
