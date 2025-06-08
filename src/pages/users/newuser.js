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

    if (/\d/.test(name)) {
      errorEl.textContent = "Name cannot contain numbers.";
      return;
    }

    if (!/^\d{10}$/.test(id)) {
      errorEl.textContent = "ID must be exactly 10 digits.";
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      errorEl.textContent = "Phone number must be exactly 10 digits.";
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
});