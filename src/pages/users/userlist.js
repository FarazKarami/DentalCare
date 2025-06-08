document.addEventListener("DOMContentLoaded", async () => {
  const userTable = document.getElementById("userTableBody");

  let users = [];

  try {
    const res = await fetch("/api/users");
    users = await res.json();
    users.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return;
  }

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.id}</td>
      <td>${user.phone}</td>
      <td>
        <button onclick="editUser('${user.id}')">Edit</button>
        <button onclick="deleteUser('${user.id}')">Delete</button>
      </td>
    `;
    userTable.appendChild(row);
  });

  window.editUser = function (id) {
    window.location.href = "edituser.html?id=" + id;
  };

  window.deleteUser = async function (id) {
    try {
      await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      location.reload();
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Error deleting user.");
    }
  };
});