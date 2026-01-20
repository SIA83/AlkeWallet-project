document.addEventListener("DOMContentLoaded", () => {
  const user = AlkeStorage.requireAuth("index.html");
  if (!user) return;

  const listEl = document.querySelector(".js-transactions-list");
  if (!listEl) return;

  const tx = (user.transactions || [])
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!tx.length) {
    listEl.innerHTML = `<li class="transaction-empty">No transactions yet</li>`;
    return;
  }

  listEl.innerHTML = "";
  tx.forEach((item) => {
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

    listEl.appendChild(li);
  });
});
