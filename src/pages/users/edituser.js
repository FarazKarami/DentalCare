document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");

  const nameInput = document.getElementById("userName");
  const idInput = document.getElementById("userId");
  const phoneInput = document.getElementById("userPhone");
  const form = document.getElementById("editUserForm");
  const errorEl = document.getElementById("error");

  let user;

  // ✅ Fetch user data from backend
  try {
    const res = await fetch(`/api/users/${userId}`);
    if (!res.ok) throw new Error("User not found.");
    user = await res.json();
  } catch (err) {
    errorEl.textContent = "User not found.";
    return;
  }

  // 🟢 Pre-fill form with user data
  nameInput.value = user.name;
  idInput.value = user.id;
  phoneInput.value = user.phone;
  idInput.disabled = true; // Don't allow editing the ID

  // 🔁 On form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    // ❌ Validation: Name must not contain numbers
    if (/\d/.test(name)) {
      errorEl.textContent = "Name cannot contain numbers.";
      return;
    }

    // ❌ Validation: Phone must be 10 digits
    if (!/^\d{10}$/.test(phone)) {
      errorEl.textContent = "Phone number must be exactly 10 digits.";
      return;
    }

    // ✅ Send update request to backend
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      if (!res.ok) throw new Error("Failed to update user.");

      alert("User updated successfully!");
    } catch (err) {
      console.error(err);
      errorEl.textContent = "Failed to update user.";
    }
  });
});