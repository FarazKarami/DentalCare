document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const usernameInput = document.getElementById("loginUsername");
  const passwordInput = document.getElementById("loginPassword");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showToast("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        window.location.href = "../../receptionistpage.html";
      } else {
        showToast("Invalid username or password!");
      }
    } catch (error) {
      showToast("Invalid username or password!");
    }
  });

  function showToast(message) {
    let toast = document.getElementById("toast");
    let toastMessage = document.getElementById("toastMessage");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className =
        "fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded shadow-lg text-sm z-50 transition-opacity duration-300";
      toast.innerHTML = `<span id="toastMessage">${message}</span>`;
      document.body.appendChild(toast);
    } else {
      toastMessage.textContent = message;
      toast.classList.remove("hidden");
    }

    setTimeout(() => toast.classList.add("hidden"), 3000);
  }
});