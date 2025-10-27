// Advanced Authentication System Here:
// ----------------------------------------->
class AuthSystem {
  constructor() {
    this.users = JSON.parse(localStorage.getItem("flightmaster-users") || "[]");
    this.currentUser = JSON.parse(
      localStorage.getItem("flightmaster-current-user") || "null"
    );
    this.socialAuthInitialized = false;
    this.init();
  }

  init() {
    this.bindAuthEvents();
    this.updateAuthUI();
    this.setupAuthForms();
    this.initializeSocialAuth();
  }

  bindAuthEvents() {
    window.addEventListener("storage", (e) => {
      if (e.key === "flightmaster-current-user") {
        this.currentUser = JSON.parse(e.newValue);
        this.updateAuthUI();
      }
    });

    // Auth Submission From
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }

    if (signupForm) {
      signupForm.addEventListener("submit", (e) => this.handleSignup(e));
    }

    // Social Login Button
    document.addEventListener("click", (e) => {
      if (e.target.closest(".social-login")) {
        const button = e.target.closest(".social-login");
        const provider = button.dataset.provider;
        this.handleSocialLogin(provider, button);
      }
    });

    // Logout Button
    document.addEventListener("click", (e) => {
      if (e.target.closest('[onclick="logout()"]')) {
        this.logout();
      }
    });
  }

  // Validation
  setupAuthForms() {
    this.setupRealTimeValidation();

    // Password
    this.setupPasswordStrength();

    this.setupInputFormatting();
    this.setupFormAutoSave();
  }

  initializeSocialAuth() {
    console.log("Social authentication providers initialized");
    this.socialAuthInitialized = true;
  }

  handleLogin(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get("email").trim().toLowerCase();
    const password = formData.get("password");

    if (!this.validateLoginForm(email, password)) {
      return;
    }

    this.authenticateUser(email, password);
  }

  handleSignup(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = {
      firstName: formData.get("firstName").trim(),
      lastName: formData.get("lastName").trim(),
      email: formData.get("email").trim().toLowerCase(),
      phone: formData.get("phone").trim(),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      preferences: {
        newsletter: formData.get("newsletter") === "on",
        smsAlerts: formData.get("smsAlerts") === "on",
      },
      createdAt: new Date().toISOString(),
      userId: this.generateUserId(),
      lastLogin: null,
      bookings: [],
    };

    if (!this.validateSignupForm(userData)) {
      return;
    }

    this.registerUser(userData);
  }

  handleSocialLogin(provider, button) {
    if (!this.socialAuthInitialized) {
      this.showFormErrors(["Social authentication is not available"]);
      return;
    }

    this.setSocialButtonLoading(button, true);

    setTimeout(() => {
      this.setSocialButtonLoading(button, false);
      const socialUser = this.createSocialUser(provider);
      this.currentUser = socialUser;
      localStorage.setItem(
        "flightmaster-current-user",
        JSON.stringify(this.currentUser)
      );

      this.showAuthSuccess(`Signed in with ${this.getProviderName(provider)}!`);
      this.redirectAfterAuth();
    }, 2000);
  }

  createSocialUser(provider) {
    const providerNames = {
      google: "Google",
      facebook: "Facebook",
      github: "GitHub",
      twitter: "Twitter",
    };

    return {
      firstName: "Social",
      lastName: "User",
      email: `user@${provider}.com`,
      provider: provider,
      providerName: providerNames[provider],
      userId: `SOCIAL_${provider}_${Date.now()}`,
      isSocial: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
  }

  getProviderName(provider) {
    const names = {
      google: "Google",
      facebook: "Facebook",
      github: "GitHub",
      twitter: "Twitter",
    };
    return names[provider] || provider;
  }

  setSocialButtonLoading(button, loading) {
    if (loading) {
      button.classList.add("loading");
      button.disabled = true;
      const originalHTML = button.innerHTML;
      button.setAttribute("data-original-html", originalHTML);
      button.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Connecting...`;
    } else {
      button.classList.remove("loading");
      button.disabled = false;
      const originalHTML = button.getAttribute("data-original-html");
      if (originalHTML) {
        button.innerHTML = originalHTML;
      }
    }
  }

  validateLoginForm(email, password) {
    const errors = [];

    if (!this.isValidEmail(email)) {
      errors.push("Please enter a valid email address");
    }

    if (!password || password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    if (errors.length > 0) {
      this.showFormErrors(errors);
      return false;
    }

    return true;
  }

  validateSignupForm(userData) {
    const errors = [];

    if (!userData.firstName || userData.firstName.length < 2) {
      errors.push("First name must be at least 2 characters long");
    }

    if (!userData.lastName || userData.lastName.length < 2) {
      errors.push("Last name must be at least 2 characters long");
    }

    if (!this.isValidEmail(userData.email)) {
      errors.push("Please enter a valid email address");
    }

    if (this.userExists(userData.email)) {
      errors.push("An account with this email already exists");
    }

    if (!this.isValidPhone(userData.phone)) {
      errors.push("Please enter a valid phone number");
    }

    if (!this.isStrongPassword(userData.password)) {
      errors.push(
        "Password must be at least 8 characters with uppercase, lowercase, and numbers"
      );
    }

    if (userData.password !== userData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    if (errors.length > 0) {
      this.showFormErrors(errors);
      return false;
    }

    return true;
  }

  authenticateUser(email, password) {
    const user = this.users.find(
      (u) => u.email === email && u.password === this.hashPassword(password)
    );

    if (user) {
      user.lastLogin = new Date().toISOString();
      localStorage.setItem("flightmaster-users", JSON.stringify(this.users));

      this.currentUser = { ...user };
      delete this.currentUser.password;

      localStorage.setItem(
        "flightmaster-current-user",
        JSON.stringify(this.currentUser)
      );
      this.showAuthSuccess("Login successful! Redirecting...");
      this.redirectAfterAuth();
    } else {
      this.showFormErrors(["Invalid email or password"]);
    }
  }

  registerUser(userData) {
    userData.password = this.hashPassword(userData.password);
    delete userData.confirmPassword;

    this.users.push(userData);
    localStorage.setItem("flightmaster-users", JSON.stringify(this.users));

    this.currentUser = { ...userData };
    delete this.currentUser.password;

    localStorage.setItem(
      "flightmaster-current-user",
      JSON.stringify(this.currentUser)
    );
    this.showAuthSuccess("Account created successfully! Redirecting...");
    this.redirectAfterAuth();
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("flightmaster-current-user");
    this.updateAuthUI();
    this.showAuthSuccess("Logged out successfully");

    setTimeout(() => {
      window.location.href = "./index.html";
    }, 1500);
  }

  updateAuthUI() {
    const authButtons = document.querySelectorAll(".auth-buttons");
    const userMenus = document.querySelectorAll(".user-menu");

    authButtons.forEach((authButton) => {
      authButton.classList.toggle("hidden", !!this.currentUser);
    });

    userMenus.forEach((userMenu) => {
      userMenu.classList.toggle("hidden", !this.currentUser);
      if (this.currentUser) {
        const userNameElement = userMenu.querySelector(".user-name");
        if (userNameElement) {
          userNameElement.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        }
      }
    });
  }

  setupRealTimeValidation() {
    const forms = document.querySelectorAll("#loginForm, #signupForm");

    forms.forEach((form) => {
      const inputs = form.querySelectorAll("input[required]");

      inputs.forEach((input) => {
        input.addEventListener("blur", () => this.validateField(input));
        input.addEventListener("input", () => this.clearFieldError(input));
      });
    });
  }

  setupPasswordStrength() {
    const passwordInput = document.querySelector('input[name="password"]');
    if (!passwordInput) return;

    let strengthMeter = document.getElementById("password-strength-meter");
    if (!strengthMeter) {
      strengthMeter = document.createElement("div");
      strengthMeter.id = "password-strength-meter";
      strengthMeter.className = "password-strength mt-2 hidden";
      strengthMeter.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="strength-bar h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
            <div class="strength-progress h-full transition-all duration-500"></div>
          </div>
          <span class="strength-text text-sm font-medium"></span>
        </div>
      `;
      passwordInput.parentNode.appendChild(strengthMeter);
    }

    passwordInput.addEventListener("input", (e) => {
      const strength = this.calculatePasswordStrength(e.target.value);
      this.updatePasswordStrength(strengthMeter, strength);
    });
  }

  setupInputFormatting() {
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => {
        e.target.value = this.formatPhoneNumber(e.target.value);
      });
    }

    const nameInputs = document.querySelectorAll(
      'input[name="firstName"], input[name="lastName"]'
    );
    nameInputs.forEach((input) => {
      input.addEventListener("blur", (e) => {
        if (e.target.value) {
          e.target.value = this.capitalizeName(e.target.value);
        }
      });
    });
  }

  setupFormAutoSave() {
    const forms = document.querySelectorAll("#loginForm, #signupForm");

    forms.forEach((form) => {
      const inputs = form.querySelectorAll("input");

      inputs.forEach((input) => {
        input.addEventListener("input", () => {
          this.saveFormData(form);
        });
      });

      this.loadFormData(form);
    });
  }

  saveFormData(form) {
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    localStorage.setItem(`flightmaster-form-${form.id}`, JSON.stringify(data));
  }

  loadFormData(form) {
    const savedData = localStorage.getItem(`flightmaster-form-${form.id}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      Object.keys(data).forEach((key) => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
          input.value = data[key];
        }
      });
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }

  isStrongPassword(password) {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  }

  userExists(email) {
    return this.users.some((user) => user.email === email);
  }

  hashPassword(password) {
    return btoa(unescape(encodeURIComponent(password)));
  }

  generateUserId() {
    return "USER_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  }

  updatePasswordStrength(meter, strength) {
    const progress = meter.querySelector(".strength-progress");
    const text = meter.querySelector(".strength-text");

    const strengthLevels = {
      0: { width: "0%", color: "bg-red-500", text: "Very Weak" },
      1: { width: "20%", color: "bg-red-400", text: "Weak" },
      2: { width: "40%", color: "bg-yellow-500", text: "Fair" },
      3: { width: "60%", color: "bg-yellow-400", text: "Good" },
      4: { width: "80%", color: "bg-green-500", text: "Strong" },
      5: { width: "100%", color: "bg-green-600", text: "Very Strong" },
    };

    const level = strengthLevels[strength] || strengthLevels[0];

    progress.className = `strength-progress h-full transition-all duration-500 ${level.color}`;
    progress.style.width = level.width;
    text.textContent = level.text;
    text.className = `strength-text text-sm font-medium ${level.color.replace(
      "bg-",
      "text-"
    )}`;
    meter.classList.remove("hidden");
  }

  formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6)
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6,
      10
    )}`;
  }

  capitalizeName(name) {
    return name.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    switch (field.type) {
      case "email":
        isValid = this.isValidEmail(value);
        errorMessage = "Please enter a valid email address";
        break;
      case "tel":
        isValid = this.isValidPhone(value);
        errorMessage = "Please enter a valid phone number";
        break;
      case "password":
        isValid = this.isStrongPassword(value);
        errorMessage =
          "Password must be at least 8 characters with uppercase, lowercase, and numbers";
        break;
      default:
        if (field.required && !value) {
          isValid = false;
          errorMessage = "This field is required";
        }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  }

  showFieldError(field, message) {
    this.clearFieldError(field);

    field.classList.add("input-error");
    field.classList.remove("input-success");

    const errorElement = document.createElement("div");
    errorElement.className = "text-error text-sm mt-1 flex items-center gap-1";
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

    field.parentNode.appendChild(errorElement);
  }

  clearFieldError(field) {
    field.classList.remove("input-error", "input-success");
    const existingError = field.parentNode.querySelector(".text-error");
    if (existingError) {
      existingError.remove();
    }
  }

  showFormErrors(errors) {
    const errorContainer = document.getElementById("formErrors");
    if (errorContainer) {
      errorContainer.innerHTML = errors
        .map(
          (error) =>
            `<div class="alert alert-error mb-2"><i class="fas fa-exclamation-triangle mr-2"></i>${error}</div>`
        )
        .join("");
      errorContainer.classList.remove("hidden");
      errorContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  showAuthSuccess(message) {
    if (window.flightMasterApp) {
      window.flightMasterApp.showNotification(message, "success");
    } else {
      alert(message);
    }
  }

  redirectAfterAuth() {
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 2000);
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getUserBookings() {
    if (!this.currentUser) return [];
    const user = this.users.find((u) => u.userId === this.currentUser.userId);
    return user ? user.bookings || [] : [];
  }

  addUserBooking(booking) {
    if (!this.currentUser) return false;

    const userIndex = this.users.findIndex(
      (u) => u.userId === this.currentUser.userId
    );
    if (userIndex !== -1) {
      if (!this.users[userIndex].bookings) {
        this.users[userIndex].bookings = [];
      }
      this.users[userIndex].bookings.push(booking);
      localStorage.setItem("flightmaster-users", JSON.stringify(this.users));
      return true;
    }
    return false;
  }
  requireLoginForPayment() {
    if (!this.isAuthenticated()) {
      this.showFormErrors(["Please login to proceed with payment"]);
      setTimeout(() => (window.location.href = "./login.html"), 2000);
      return false;
    }
    return true;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.authSystem = new AuthSystem();
});

export default AuthSystem;
