document.addEventListener("DOMContentLoaded", () => {
  const user = AlkeStorage.requireAuth("index.html");
  if (!user) return;

  const listEl = document.querySelector(".js-contacts-list");
  const formEl = document.querySelector(".js-contact-form");

  function renderContacts(u) {
    if (!listEl) return;

    const contacts = u.contacts || [];
    listEl.innerHTML = "";

    if (!contacts.length) {
      listEl.innerHTML = `<li class="transaction-empty">No contacts yet</li>`;
      return;
    }

    contacts.forEach((contact) => {
      const li = document.createElement("li");
      li.className = "contact-item";

      const initial = (contact.name || "?").trim().slice(0, 1).toUpperCase();

      li.innerHTML = `
        <div class="bi bi-people"></div>
        <div>
          <div class="contact-name">${contact.name}</div>
          <div class="contact-email">${contact.email}</div>
          <div class="contact-phone">${contact.phone}</div>
        </div>
      `;
      listEl.appendChild(li);
    });
  }

  renderContacts(user);

  formEl?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = formEl.querySelector('input[type="text"]')?.value.trim();
    const email = formEl.querySelector('input[type="email"]')?.value.trim();
    const phone = formEl.querySelector('input[type="tel"]')?.value.trim();

    if (!name || !email || !phone) {
      alert("Fill in all fields");
      return;
    } else {
      try {
        AlkeStorage.addContact({ name, email, phone });
        formEl.reset();
        renderContacts(AlkeStorage.getFreshUser());
      } catch (err) {
        if (err?.message === "INVALID_CONTACT")
          return alert("Fill in all fields");
        alert("Something went wrong");
      }
    }
  });
});
