document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");
  const nameInput = document.getElementById("userName");
  const idInput = document.getElementById("userId");
  const phoneInput = document.getElementById("userPhone");
  const form = document.getElementById("editUserForm");
  const errorEl = document.getElementById("error");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.id === userId);

  if (!user) {
    errorEl.textContent = "User not found.";
    return;
  }

  nameInput.value = user.name;
  idInput.value = user.id;
  phoneInput.value = user.phone;
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

    user.name = name;
    user.phone = phone;

    localStorage.setItem("users", JSON.stringify(users));
    alert("User updated successfully!");
  });
});