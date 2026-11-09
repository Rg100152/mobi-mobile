// ==========================================
// Mobi Mobile - Mock Authentication
// Developer: Raj Gautam
// ==========================================

(function () {
  "use strict";

  const IS_IN_PAGES = window.location.pathname.includes("/pages/");
  const BASE = IS_IN_PAGES ? "../" : "./";

  function saveUser(user) {
    localStorage.setItem("mobi_user", JSON.stringify(user));
  }

  function getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem("mobi_user")) || null;
    } catch (err) {
      return null;
    }
  }

  function registerUser(name, email, password) {
    if (!name || !email || !password) {
      return { success: false, message: "All fields are required." };
    }

    const user = {
      id: "u_" + Date.now(),
      name: name,
      email: email,
      isLoggedIn: true,
      joinedDate: new Date().toISOString()
    };

    saveUser(user);
    return { success: true, message: "Registration successful!" };
  }

  function loginUser(email, password) {
    if (!email || !password) {
      return { success: false, message: "Email and password are required." };
    }

    const existing = getStoredUser();

    if (!existing) {
      const fallbackName = email.split("@")[0] || "Explorer";
      return registerUser(fallbackName, email, password);
    }

    if (existing.email === email) {
      existing.isLoggedIn = true;
      saveUser(existing);
      return { success: true, message: "Login successful!" };
    }

    return {
      success: false,
      message: "No account found with this email. Please register first."
    };
  }

  function logoutUser() {
    localStorage.removeItem("mobi_user");
    window.location.href = BASE + "index.html";
  }

  function isLoggedIn() {
    const user = getStoredUser();
    return Boolean(user && user.isLoggedIn === true);
  }

  function showError(form, message) {
    let box = form.querySelector(".form-error");
    if (!box) {
      box = document.createElement("div");
      box.className = "form-error";
      form.prepend(box);
    }
    box.textContent = message;
    box.style.display = "block";
  }

  document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const result = loginUser(email, password);

        if (result.success) {
          window.location.href = "dashboard.html";
        } else {
          showError(loginForm, result.message);
        }
      });
    }

    if (registerForm) {
      registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const result = registerUser(name, email, password);

        if (result.success) {
          window.location.href = "dashboard.html";
        } else {
          showError(registerForm, result.message);
        }
      });
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        logoutUser();
      });
    }

    const dashboard = document.getElementById("dashboard");
    if (dashboard) {
      if (!isLoggedIn()) {
        window.location.href = "login.html";
        return;
      }
      const user = getStoredUser();
      const nameEl = document.getElementById("dashboard-name");
      const emailEl = document.getElementById("dashboard-email");
      const joinedEl = document.getElementById("dashboard-joined");
      if (nameEl) nameEl.textContent = user.name;
      if (emailEl) emailEl.textContent = user.email;
      if (joinedEl && user.joinedDate) {
        joinedEl.textContent = new Date(user.joinedDate).toLocaleDateString();
      }
    }
  });

  window.MobiAuth = {
    registerUser: registerUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
    isLoggedIn: isLoggedIn
  };
})();
