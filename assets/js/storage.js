const AlkeStorage = {
  KEYS: {
    USERS: "alke_users",
    CURRENT: "alke_current_user",
  },

  read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getUsers() {
    return AlkeStorage.read(AlkeStorage.KEYS.USERS, []);
  },

  setUsers(users) {
    AlkeStorage.write(AlkeStorage.KEYS.USERS, users);
  },

  getCurrentUser() {
    return AlkeStorage.read(AlkeStorage.KEYS.CURRENT, null);
  },

  setCurrentUser(user) {
    AlkeStorage.write(AlkeStorage.KEYS.CURRENT, user);
  },

  logout() {
    localStorage.removeItem(AlkeStorage.KEYS.CURRENT);
  },

  normalizeTxType(type) {
    return String(type).toLowerCase() === "in" ? "in" : "out";
  },

  normalizeUser(user) {
    const u = { ...user };

    u.balance = Number(u.balance) || 0;
    u.contacts = Array.isArray(u.contacts) ? u.contacts : [];
    u.transactions = Array.isArray(u.transactions) ? u.transactions : [];

    u.transactions = u.transactions.map((tx) => ({
      id: tx?.id ?? Date.now(),
      type: AlkeStorage.normalizeTxType(tx?.type),
      title: String(tx?.title || "").trim(),
      amount: Number(tx?.amount) || 0,
      note: String(tx?.note || "").trim(),
      date: tx?.date || new Date().toISOString(),
    }));

    return u;
  },

  syncUser(user) {
    const u = AlkeStorage.normalizeUser(user);
    const users = AlkeStorage.getUsers();

    const idx = users.findIndex((x) => x.id === u.id);
    if (idx !== -1) users[idx] = u;

    AlkeStorage.setUsers(users);
    AlkeStorage.setCurrentUser(u);
    return u;
  },

  getFreshUser() {
    const current = AlkeStorage.getCurrentUser();
    if (!current) return null;

    const users = AlkeStorage.getUsers();
    const found = users.find(
      (u) => u.id === current.id && u.email === current.email,
    );

    if (!found) {
      AlkeStorage.logout();
      return null;
    }

    return AlkeStorage.syncUser(found);
  },

  requireAuth(redirectTo = "index.html") {
    const user = AlkeStorage.getFreshUser();
    if (!user) {
      window.location.href = redirectTo;
      return null;
    }
    return user;
  },

  formatMoney(amount) {
    return `$${Number(amount || 0).toFixed(2)}`;
  },

  formatDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  addTx(user, { type, title, amount, note }) {
    const tx = {
      id: Date.now(),
      type: AlkeStorage.normalizeTxType(type),
      title: String(title || "").trim(),
      amount: Number(amount) || 0,
      note: String(note || "").trim(),
      date: new Date().toISOString(),
    };

    user.transactions = [tx, ...(user.transactions || [])];
  },

  deposit(amount) {
    const user = AlkeStorage.requireAuth();
    if (!user) return;

    const a = Number(amount);
    if (!a || a <= 0) throw new Error("INVALID_AMOUNT");

    user.balance += a;
    AlkeStorage.addTx(user, {
      type: "in",
      title: "Deposit",
      amount: a,
      note: "",
    });

    return AlkeStorage.syncUser(user);
  },

  sendMoney({ contactId, amount, note }) {
    const user = AlkeStorage.requireAuth();
    if (!user) return;

    const a = Number(amount);
    if (!a || a <= 0) throw new Error("INVALID_AMOUNT");
    if (a > user.balance) throw new Error("INSUFFICIENT_BALANCE");

    const contact = (user.contacts || []).find(
      (c) => String(c.id) === String(contactId),
    );
    if (!contact) throw new Error("CONTACT_NOT_FOUND");

    user.balance -= a;
    AlkeStorage.addTx(user, {
      type: "out",
      title: contact.name,
      amount: a,
      note,
    });

    return AlkeStorage.syncUser(user);
  },

  addContact({ name, email, phone }) {
    const user = AlkeStorage.requireAuth();
    if (!user) return;

    name = (name || "").trim();
    email = (email || "").trim();
    phone = (phone || "").trim();

    if (!name || !email || !phone) throw new Error("INVALID_CONTACT");

    user.contacts = [
      { id: Date.now(), name, email, phone },
      ...(user.contacts || []),
    ];
    return AlkeStorage.syncUser(user);
  },
};
