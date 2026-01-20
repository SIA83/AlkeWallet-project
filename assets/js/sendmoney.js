document.addEventListener("DOMContentLoaded", () => {
  const user = AlkeStorage.requireAuth("index.html");
  if (!user) return;

  const balanceEl = document.querySelector(".js-balance");
  const sendForm = document.querySelector(".js-send-form");
  const contactSelect = document.querySelector(".js-contact-select");

  if (balanceEl) balanceEl.textContent = AlkeStorage.formatMoney(user.balance);

  function renderContacts() {
    if (!contactSelect) return;

    const contacts = user.contacts || [];
    contactSelect.innerHTML = `<option value="">Select contact</option>`;

    if (!contacts.length) {
      contactSelect.innerHTML += `<option value="" disabled>No contacts yet</option>`;
      return;
    }

    contacts.forEach((c) => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = c.name;
      contactSelect.appendChild(option);
    });
  }

  renderContacts();

  sendForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const amountInput = sendForm.querySelector(
      'input[name="sendmoney-amount"]',
    );
    const noteInput = sendForm.querySelector('input[name="sendmoney-note"]');

    const amount = Number(amountInput?.value);
    const note = (noteInput?.value || "").trim();

    if (!contactSelect?.value) {
      alert("Please select a contact");
      return;
    }
    if (!amount || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      AlkeStorage.sendMoney({ contactId: contactSelect.value, amount, note });
      window.location.href = "dashboard.html";
    } catch (err) {
      if (err?.message === "INSUFFICIENT_BALANCE")
        return alert("Insufficient balance");
      if (err?.message === "CONTACT_NOT_FOUND")
        return alert("Contact not found");
      if (err?.message === "INVALID_AMOUNT")
        return alert("Enter a valid amount");
      alert("Something went wrong");
    }
  });
});
