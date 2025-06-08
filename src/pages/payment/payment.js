document.addEventListener("DOMContentLoaded", () => {
  const sessionsElement = document.getElementById("sessionCount");
  const paymentElement = document.getElementById("totalPayment");
  const errorElement = document.getElementById("errorMessage");

  // Replace this with your actual backend URL
  const apiURL = "http://localhost:3000/api/payments";

  fetch(apiURL)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch appointment summary");
      }
      return response.json();
    })
    .then(data => {
      sessionsElement.textContent = data.sessions;
      paymentElement.textContent = "$" + data.totalPayment.toFixed(2);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      errorElement.textContent = "Could not load payment details. Please try again later.";
    });
});