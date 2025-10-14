// Main Application Initialization
class FlightMasterApp {
  constructor() {
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (this.isInitialized) return;

    console.log("🚀 FlightMaster Pro Initialized");
    this.setupGlobalEventListeners();
    this.initializeComponents();
    this.setupErrorHandling();
    this.isInitialized = true;
  }

  setupGlobalEventListeners() {
    document.addEventListener("click", (e) => this.handleGlobalClick(e));

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    document.addEventListener("keydown", (e) =>
      this.handleKeyboardNavigation(e)
    );

    window.addEventListener("online", () => this.handleOnlineStatus());
    window.addEventListener("offline", () => this.handleOfflineStatus());
  }

  initializeComponents() {
    this.initializeNavigation();
    this.initializeAnimations();
    this.initializeFormValidation();
    this.initializePerformanceMonitoring();
  }

  initializeNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    this.setupMobileNavigation();
    this.setupActiveNavigation();
  }

  setupMobileNavigation() {
    const mobileMenuBtns = document.querySelectorAll(
      '[onclick="toggleMobileMenu()"]'
    );
    mobileMenuBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleMobileMenu();
      });
    });

    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".mobile-menu") &&
        !e.target.closest('[onclick="toggleMobileMenu()"]')
      ) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    const mobileMenus = document.querySelectorAll(".mobile-menu");
    mobileMenus.forEach((menu) => menu.classList.toggle("hidden"));
    document.body.classList.toggle("mobile-menu-open");
  }

  closeMobileMenu() {
    const mobileMenus = document.querySelectorAll(".mobile-menu");
    mobileMenus.forEach((menu) => menu.classList.add("hidden"));
    document.body.classList.remove("mobile-menu-open");
  }

  setupActiveNavigation() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  initializeAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll(".card, .feature-item, .destination-card")
      .forEach((el) => observer.observe(el));
  }

  initializeFormValidation() {
    this.validationPatterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\+?[\d\s-()]{10,}$/,
      name: /^[a-zA-Z\s]{2,50}$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      cardNumber: /^\d{16}$/,
      expiry: /^(0[1-9]|1[0-2])\/\d{2}$/,
      cvv: /^\d{3,4}$/,
    };
  }

  initializePerformanceMonitoring() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`${entry.name}: ${entry.value}ms`);
        }
      });

      observer.observe({
        entryTypes: ["navigation", "paint", "largest-contentful-paint"],
      });
    }
  }

  setupErrorHandling() {
    window.addEventListener("error", (e) => {
      console.error("Global error:", e.error);
      this.showNotification("An unexpected error occurred", "error");
    });

    window.addEventListener("unhandledrejection", (e) => {
      console.error("Unhandled promise rejection:", e.reason);
      this.showNotification("An unexpected error occurred", "error");
      e.preventDefault();
    });
  }

  handleGlobalClick(e) {
    if (e.target.closest('[onclick="toggleTheme()"]')) {
      toggleTheme();
    }

    if (e.target.closest(".social-login")) {
      const socialButton = e.target.closest(".social-login");
      const provider = socialButton.dataset.provider;
      if (window.authSystem) {
        window.authSystem.handleSocialLogin(provider, socialButton);
      }
    }

    if (e.target.closest("nav a")) {
      this.setActiveNavigation(e.target.closest("nav a"));
    }
  }

  handleResize() {
    const isMobile = window.innerWidth < 1024;
    document.body.classList.toggle("mobile-view", isMobile);

    if (window.innerWidth >= 1024) {
      this.closeMobileMenu();
    }
  }

  handleKeyboardNavigation(e) {
    if (e.key === "Escape") {
      this.closeAllDropdowns();
      this.closeMobileMenu();
    }

    if (e.key === "Tab") {
      this.enhanceTabNavigation(e);
    }
  }

  handleOnlineStatus() {
    this.showNotification("Connection restored", "success");
    document.body.classList.remove("offline");
  }

  handleOfflineStatus() {
    this.showNotification("You are currently offline", "error");
    document.body.classList.add("offline");
  }

  setActiveNavigation(activeLink) {
    document.querySelectorAll("nav a").forEach((link) => {
      link.classList.remove("active");
    });

    activeLink.classList.add("active");
  }

  closeAllDropdowns() {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      dropdown.removeAttribute("open");
    });
  }

  enhanceTabNavigation(e) {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }

  showNotification(message, type = "info") {
    document
      .querySelectorAll(".notification")
      .forEach((notif) => notif.remove());

    const notification = document.createElement("div");
    notification.className = `notification alert alert-${type} shadow-lg`;
    notification.innerHTML = `
      <i class="fas fa-${this.getNotificationIcon(type)} mr-2"></i>
      <span>${message}</span>
      <button onclick="this.closest('.notification').remove()">
        <i class="fas fa-times"></i>
      </button>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 5000);
  }

  getNotificationIcon(type) {
    const icons = {
      success: "check-circle",
      error: "exclamation-triangle",
      info: "info-circle",
      warning: "exclamation-circle",
    };
    return icons[type] || "info-circle";
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  measurePerformance(name, callback) {
    const startTime = performance.now();
    const result = callback();
    const endTime = performance.now();
    console.log(`${name} took ${endTime - startTime}ms`);
    return result;
  }

  setLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return false;
    }
  }

  getLocalStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  }

  removeLocalStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing from localStorage:", error);
      return false;
    }
  }
}

// Initialize the application
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.flightMasterApp = new FlightMasterApp();
  });
} else {
  window.flightMasterApp = new FlightMasterApp();
}

export default FlightMasterApp;
