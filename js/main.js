// Main Application Initialization
class FlightMasterApp {
  constructor() {
    this.init();
  }

  init() {
    console.log("FlightMaster Pro Initialized");
    this.setupGlobalEventListeners();
    this.initializeComponents();
  }

  setupGlobalEventListeners() {
    // Global click handler for dynamic elements
    document.addEventListener("click", (e) => {
      this.handleGlobalClick(e);
    });

    // Responsive window resize handler
    window.addEventListener("resize", () => {
      this.handleResize();
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardNavigation(e);
    });
  }

  initializeComponents() {
    // Initialize all main components
    this.initializeNavigation();
    this.initializeAnimations();
    this.initializeFormValidation();
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
  }

  setupMobileNavigation() {
    const mobileMenuBtn = document.querySelector(".dropdown");
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    // Close mobile menu when clicking outside
    document.addEventListener("click", () => {
      const openDropdown = document.querySelector(".dropdown[open]");
      if (openDropdown) {
        openDropdown.removeAttribute("open");
      }
    });
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
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll(".card, .feature-item").forEach((el) => {
      observer.observe(el);
    });
  }

  initializeFormValidation() {
    // Global form validation patterns
    this.validationPatterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\+?[\d\s-()]{10,}$/,
      name: /^[a-zA-Z\s]{2,50}$/,
    };
  }

  handleGlobalClick(e) {
    // Handle theme selector clicks
    if (e.target.closest("[data-theme]")) {
      const theme = e.target.closest("[data-theme]").dataset.theme;
      this.switchTheme(theme);
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
  }

  handleKeyboardNavigation(e) {
    // Escape key closes modals and dropdowns
    if (e.key === "Escape") {
      this.closeAllDropdowns();
    }

    // Tab key navigation enhancement
    if (e.key === "Tab") {
      this.enhanceTabNavigation(e);
    }
  }

  switchTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("flightmaster-theme", theme);

    // Dispatch theme change event
    window.dispatchEvent(
      new CustomEvent("themeChanged", { detail: { theme } })
    );
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
    const notification = document.createElement("div");
    notification.className = `toast toast-top toast-center z-50`;
    notification.innerHTML = `
            <div class="alert alert-${type} flex">
                <span>${message}</span>
                <button class="btn btn-sm btn-ghost" onclick="this.closest('.toast').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 5000);
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
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.flightMasterApp = new FlightMasterApp();
});

// Export for module usage
export default FlightMasterApp;
