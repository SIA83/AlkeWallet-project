document.addEventListener("DOMContentLoaded", () => {
  AlkeStorage.requireAuth("index.html");

  const form = document.querySelector(".js-deposit-form");
  const input = form?.querySelector('input[type="number"]');

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = Number(input?.value);
    if (!amount || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      AlkeStorage.deposit(amount);
      window.location.href = "dashboard.html";
    } catch (err) {
      if (err?.message === "INVALID_AMOUNT") {
        alert("Enter a valid amount");
        return;
      }
      alert("Something went wrong");
    }
  });
});
