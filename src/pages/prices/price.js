document.addEventListener("DOMContentLoaded", async () => {
  const priceTable = document.getElementById("priceTableBody");

  try {
    const res = await fetch("/api/prices"); // ✅ Call to backend
    const prices = await res.json();

    prices.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.price}</td>
      `;
      priceTable.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to load prices:", error);
    alert("Error loading price list.");
  }
});