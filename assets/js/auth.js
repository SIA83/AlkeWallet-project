document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".js-login-form");
  const registerForm = document.querySelector(".js-register-form");

  const showRegisterBtn = document.querySelector(".js-show-register");
  const showLoginBtn = document.querySelector(".js-show-login");
  const subtitle = document.querySelector(".js-auth-subtitle");

  const LOGIN_TEXT = "Enter your credentials to access your account";
  const REGISTER_TEXT = "Enter your credentials to create your account";

  function showRegister() {
    loginForm?.classList.add("hidden");
    registerForm?.classList.remove("hidden");
    if (subtitle) subtitle.textContent = REGISTER_TEXT;
  }

  function showLogin() {
    registerForm?.classList.add("hidden");
    loginForm?.classList.remove("hidden");
    if (subtitle) subtitle.textContent = LOGIN_TEXT;
  }

  showRegisterBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    showRegister();
  });

  showLoginBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });

  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = loginForm
      .querySelector('input[name="email"]')
      ?.value.trim()
      .toLowerCase();
    const password = loginForm
      .querySelector('input[name="password"]')
      ?.value.trim();

    if (!email || !password) return alert("Please fill in all fields");

    const users = AlkeStorage.getUsers();
    const found = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!found) return alert("Invalid email or password");

    AlkeStorage.setCurrentUser(AlkeStorage.normalizeUser(found));
    window.location.href = "dashboard.html";
  });

  registerForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = registerForm.querySelector('input[name="name"]')?.value.trim();
    const email = registerForm
      .querySelector('input[name="email"]')
      ?.value.trim()
      .toLowerCase();
    const password = registerForm
      .querySelector('input[name="password"]')
      ?.value.trim();
    const confirmPassword = registerForm
      .querySelector('input[name="confirmPassword"]')
      ?.value.trim();
    const agree = registerForm.querySelector('input[type="checkbox"]')?.checked;

    if (!name || !email || !password || !confirmPassword)
      return alert("Please fill in all fields");
    if (password.length < 6)
      return alert("Password must be at least 6 characters");
    if (password !== confirmPassword) return alert("Passwords do not match");
    if (!agree) return alert("You must agree with Privacy & Policy");

    const users = AlkeStorage.getUsers();
    if (users.some((u) => u.email === email))
      return alert("User already exists");

    const newUser = AlkeStorage.normalizeUser({
      id: Date.now(),
      name,
      email,
      password,
      balance: 0,
      contacts: [],
      transactions: [],
      createdAt: new Date().toISOString(),
    });

    users.push(newUser);
    AlkeStorage.setUsers(users);
    AlkeStorage.setCurrentUser(newUser);

    window.location.href = "dashboard.html";
  });
});
