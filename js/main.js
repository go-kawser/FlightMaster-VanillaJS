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
    // Global click handler for dynamic elements
    document.addEventListener("click", (e) => {
      this.handleGlobalClick(e);
    });

    // Responsive window resize handler with debounce
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardNavigation(e);
    });

    // Online/offline detection
    window.addEventListener("online", () => this.handleOnlineStatus());
    window.addEventListener("offline", () => this.handleOfflineStatus());
  }

  initializeComponents() {
    // Initialize all main components
    this.initializeNavigation();
    this.initializeAnimations();
    this.initializeFormValidation();
    this.initializePerformanceMonitoring();
  }

  initializeNavigation() {
    // Smooth scrolling for anchor links
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

    // Mobile menu toggle enhancement
    this.setupMobileNavigation();

    // Active navigation highlighting
    this.setupActiveNavigation();
  }

  setupMobileNavigation() {
    const mobileMenuBtn = document.querySelector(
      '[data-drawer-toggle="mobile-menu"]'
    );
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleMobileMenu();
      });
    }

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".mobile-menu") &&
        !e.target.closest('[data-drawer-toggle="mobile-menu"]')
      ) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    const mobileMenu = document.querySelector(".mobile-menu");
    if (mobileMenu) {
      mobileMenu.classList.toggle("hidden");
      document.body.classList.toggle("mobile-menu-open");
    }
  }

  closeMobileMenu() {
    const mobileMenu = document.querySelector(".mobile-menu");
    if (mobileMenu) {
      mobileMenu.classList.add("hidden");
      document.body.classList.remove("mobile-menu-open");
    }
  }

  setupActiveNavigation() {
    // Update active nav based on scroll position
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
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document
      .querySelectorAll(".card, .feature-item, .destination-card")
      .forEach((el) => {
        observer.observe(el);
      });
  }

  initializeFormValidation() {
    // Global form validation patterns
    this.validationPatterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\+?[\d\s-()]{10,}$/,
      name: /^[a-zA-Z\s]{2,50}$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    };
  }

  initializePerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`${entry.name}: ${entry.value}`);
        }
      });

      observer.observe({
        entryTypes: ["navigation", "paint", "largest-contentful-paint"],
      });
    }
  }

  setupErrorHandling() {
    // Global error handler
    window.addEventListener("error", (e) => {
      console.error("Global error:", e.error);
      this.showNotification("An unexpected error occurred", "error");
    });

    // Unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (e) => {
      console.error("Unhandled promise rejection:", e.reason);
      this.showNotification("An unexpected error occurred", "error");
      e.preventDefault();
    });
  }

  handleGlobalClick(e) {
    // Handle theme selector clicks
    if (e.target.closest(".theme-option")) {
      const themeOption = e.target.closest(".theme-option");
      const theme = themeOption.dataset.theme;
      if (window.themeManager) {
        window.themeManager.applyTheme(theme);
      }
    }

    // Handle social login clicks
    if (e.target.closest(".social-login")) {
      const socialButton = e.target.closest(".social-login");
      const provider = socialButton.dataset.provider;
      if (window.authSystem) {
        window.authSystem.handleSocialLogin(provider);
      }
    }

    // Handle navigation active states
    if (e.target.closest("nav a")) {
      this.setActiveNavigation(e.target.closest("nav a"));
    }
  }

  handleResize() {
    // Handle responsive behavior
    const isMobile = window.innerWidth < 1024;
    document.body.classList.toggle("mobile-view", isMobile);

    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 1024) {
      this.closeMobileMenu();
    }
  }

  handleKeyboardNavigation(e) {
    // Escape key closes modals and dropdowns
    if (e.key === "Escape") {
      this.closeAllDropdowns();
      this.closeMobileMenu();
    }

    // Tab key navigation enhancement
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
    // Remove active class from all nav links
    document.querySelectorAll("nav a").forEach((link) => {
      link.classList.remove("active");
    });

    // Add active class to clicked link
    activeLink.classList.add("active");
  }

  closeAllDropdowns() {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      dropdown.removeAttribute("open");
    });
  }

  enhanceTabNavigation(e) {
    // Add focus management for better accessibility
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

  // Utility methods
  showNotification(message, type = "info") {
    // Remove existing notifications
    document
      .querySelectorAll(".notification")
      .forEach((notif) => notif.remove());

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <div class="alert alert-${type} shadow-lg max-w-md">
                <div>
                    <i class="fas fa-${this.getNotificationIcon(
                      type
                    )} mr-2"></i>
                    <span>${message}</span>
                </div>
                <button class="btn btn-sm btn-ghost" onclick="this.closest('.notification').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
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
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
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

  // Performance monitoring
  measurePerformance(name, callback) {
    const startTime = performance.now();
    const result = callback();
    const endTime = performance.now();

    console.log(`${name} took ${endTime - startTime} milliseconds`);
    return result;
  }

  // Local storage utilities
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

// Initialize the application when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.flightMasterApp = new FlightMasterApp();
  });
} else {
  window.flightMasterApp = new FlightMasterApp();
}

// Export for module usage
export default FlightMasterApp;
