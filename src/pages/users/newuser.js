document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newUserForm");
  const nameInput = document.getElementById("userName");
  const idInput = document.getElementById("userId");
  const phoneInput = document.getElementById("userPhone");
  const errorEl = document.getElementById("error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const id = idInput.value.trim();
    const phone = phoneInput.value.trim();

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
    try {
      // Check if user with this ID already exists
      const res = await fetch(`/api/users?id=${id}`);
      const data = await res.json();
      if (data.exists) {
        errorEl.textContent = "A user with this ID already exists.";
        return;
      }
    } catch (err) {
      console.error("Failed to check ID:", err);
      errorEl.textContent = "Error checking ID.";
      return;
    }

    try {
      // Save new user to backend
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, id, phone }),
      });

      if (!res.ok) throw new Error("Failed to save user");

      alert("User added successfully!");
      form.reset();
    } catch (err) {
      console.error("Failed to save user:", err);
      errorEl.textContent = "Error saving user.";
    }
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