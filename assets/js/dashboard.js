document.addEventListener("DOMContentLoaded", () => {
  const user = AlkeStorage.requireAuth("index.html");
  if (!user) return;

  const userNameEl = document.querySelector(".js-user-name");
  const balanceEl = document.querySelector(".js-balance");
  const transactionsListEl = document.querySelector(".js-transactions");

  if (userNameEl) userNameEl.textContent = user.name || "User";
  if (balanceEl) balanceEl.textContent = AlkeStorage.formatMoney(user.balance);

  const logoutBtn = document.querySelector(".js-logout");
  logoutBtn?.addEventListener("click", () => {
    AlkeStorage.logout();
    window.location.href = "index.html";
  });

  if (!transactionsListEl) return;

  const tx = (user.transactions || [])
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!tx.length) {
    transactionsListEl.innerHTML = `<li class="transaction-empty">No transactions yet</li>`;
    return;
  }

  transactionsListEl.innerHTML = "";
  tx.slice(0, 3).forEach((item) => {
    const li = document.createElement("li");
    li.className = `transaction-item transaction-item--${item.type}`;

    li.innerHTML = `
      <div>
        <div class="transaction-item__title">${item.title}</div>
        <div class="transaction-item__date">${AlkeStorage.formatDate(item.date)}</div>
      </div>
      <div class="transaction-item__amount">
        ${item.type === "in" ? "+" : "-"}${AlkeStorage.formatMoney(item.amount)}
      </div>
    `;

    transactionsListEl.appendChild(li);
  });
});
