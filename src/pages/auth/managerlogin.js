document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const usernameInput = document.getElementById("managerUsername");
  const passwordInput = document.getElementById("managerPassword");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showToast("Please enter both username and password.");
      return;
    }

    if (username === "admin" && password === "admin") {
      window.location.href = "../../managerpage.html";
    } else {
      showToast("Invalid username or password!");
    }
  });

  function showToast(message) {
    let toast = document.getElementById("toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className =
        "fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded shadow-lg text-sm z-50 transition-opacity duration-300";
      toast.innerHTML = `<span id="toastMessage">${message}</span>`;
      document.body.appendChild(toast);
    } else {
      toast.querySelector("#toastMessage").textContent = message;
      toast.classList.remove("hidden");
    }

    setTimeout(() => toast.classList.add("hidden"), 3000);
  }
});