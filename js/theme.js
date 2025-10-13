// Advanced Theme Management System
class ThemeManager {
  constructor() {
    this.themes = ["light", "dark", "cupcake", "bumblebee", "emerald"];
    this.currentTheme = this.getSavedTheme();
    this.isTransitioning = false;
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.bindThemeEvents();
    this.setupThemeObserver();
    this.setupSystemPreference();
  }

  getSavedTheme() {
    const saved = localStorage.getItem("flightmaster-theme");
    if (saved && this.themes.includes(saved)) {
      return saved;
    }

    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  }

  applyTheme(theme) {
    if (this.isTransitioning || !this.themes.includes(theme)) {
      return;
    }

    this.isTransitioning = true;

    // Add transition class for smooth theme change
    document.documentElement.classList.add("theme-transition");

    setTimeout(() => {
      document.documentElement.setAttribute("data-theme", theme);
      this.currentTheme = theme;
      localStorage.setItem("flightmaster-theme", theme);

      this.updateThemeUI(theme);
      this.dispatchThemeChange(theme);
      this.applyCustomStyles(theme);

      // Remove transition class
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
        this.isTransitioning = false;
      }, 300);
    }, 50);
  }

  bindThemeEvents() {
    // Theme selector clicks
    document.addEventListener("click", (e) => {
      const themeOption = e.target.closest(".theme-option");
      if (themeOption) {
        const theme = themeOption.dataset.theme;
        this.applyTheme(theme);
        this.showThemeToast(theme);
      }
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "T") {
        e.preventDefault();
        this.cycleTheme();
      }
    });

    // Theme cycle button
    const themeCycleBtn = document.getElementById("theme-cycle");
    if (themeCycleBtn) {
      themeCycleBtn.addEventListener("click", () => this.cycleTheme());
    }
  }

  setupThemeObserver() {
    // Observe for theme-related changes in the document
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          this.handleThemeAttributeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }

  setupSystemPreference() {
    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleSystemThemeChange = (e) => {
        // Only apply system theme if no theme is saved
        if (!localStorage.getItem("flightmaster-theme")) {
          this.applyTheme(e.matches ? "dark" : "light");
        }
      };

      mediaQuery.addEventListener("change", handleSystemThemeChange);
    }
  }

  updateThemeUI(theme) {
    // Update theme selector in dropdowns
    document.querySelectorAll(".theme-option").forEach((option) => {
      const isActive = option.dataset.theme === theme;
      option.classList.toggle("active", isActive);
      option.classList.toggle("bg-primary", isActive);
      option.classList.toggle("text-primary-content", isActive);

      // Update aria-current for accessibility
      option.setAttribute("aria-current", isActive ? "true" : "false");
    });

    // Update theme toggle button if exists
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", `Current theme: ${theme}`);
      themeToggle.setAttribute(
        "title",
        `Current theme: ${theme}. Click to change.`
      );

      // Update icon based on theme
      const icon = themeToggle.querySelector("i");
      if (icon) {
        const icons = {
          light: "fa-sun",
          dark: "fa-moon",
          cupcake: "fa-palette",
          bumblebee: "fa-palette",
          emerald: "fa-palette",
        };
        icon.className = `fas ${icons[theme] || "fa-palette"}`;
      }
    }
  }

  cycleTheme() {
    const currentIndex = this.themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    const nextTheme = this.themes[nextIndex];
    this.applyTheme(nextTheme);
    this.showThemeToast(nextTheme);
  }

  showThemeToast(theme) {
    const themeNames = {
      light: "🌞 Light Theme",
      dark: "🌙 Dark Theme",
      cupcake: "🧁 Cupcake Theme",
      bumblebee: "🐝 Bumblebee Theme",
      emerald: "💎 Emerald Theme",
    };

    if (window.flightMasterApp) {
      window.flightMasterApp.showNotification(
        `Theme changed to ${themeNames[theme]}`
      );
    }
  }

  dispatchThemeChange(theme) {
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: {
          theme,
          timestamp: new Date().toISOString(),
          previousTheme: this.previousTheme,
        },
      })
    );

    this.previousTheme = theme;
  }

  applyCustomStyles(theme) {
    // Remove existing custom style element
    const existingStyle = document.getElementById("theme-custom-styles");
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add theme-specific custom styles
    const style = document.createElement("style");
    style.id = "theme-custom-styles";

    const customStyles = this.getCustomStyles(theme);
    style.textContent = customStyles;

    document.head.appendChild(style);
  }

  getCustomStyles(theme) {
    const styles = {
      dark: `
                .bg-gradient-custom {
                    background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
                }
                .text-gradient {
                    background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .navbar {
                    background: rgba(17, 24, 39, 0.8);
                }
            `,
      light: `
                .bg-gradient-custom {
                    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                }
                .navbar {
                    background: rgba(255, 255, 255, 0.8);
                }
            `,
      cupcake: `
                .bg-gradient-custom {
                    background: linear-gradient(135deg, #fae8ff 0%, #d8f2ff 100%);
                }
                .navbar {
                    background: rgba(251, 243, 255, 0.8);
                }
            `,
      bumblebee: `
                .bg-gradient-custom {
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                }
                .navbar {
                    background: rgba(254, 243, 199, 0.8);
                }
            `,
      emerald: `
                .bg-gradient-custom {
                    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
                }
                .navbar {
                    background: rgba(209, 250, 229, 0.8);
                }
            `,
    };

    return styles[theme] || styles.light;
  }

  handleThemeAttributeChange() {
    const newTheme = document.documentElement.getAttribute("data-theme");
    if (newTheme !== this.currentTheme) {
      this.currentTheme = newTheme;
      this.updateThemeUI(newTheme);
    }
  }

  // Theme analytics
  trackThemeUsage(theme) {
    const analyticsData = {
      event: "theme_changed",
      theme,
      previousTheme: this.previousTheme,
      timestamp: new Date().toISOString(),
      source: "theme_manager",
    };

    // Save to localStorage for demo purposes
    const events = JSON.parse(
      localStorage.getItem("flightmaster-analytics") || "[]"
    );
    events.push(analyticsData);
    localStorage.setItem("flightmaster-analytics", JSON.stringify(events));
  }

  // Utility methods
  getCurrentTheme() {
    return this.currentTheme;
  }

  getAvailableThemes() {
    return [...this.themes];
  }

  isDarkTheme() {
    return this.currentTheme === "dark";
  }

  // Reset to system preference
  resetToSystem() {
    localStorage.removeItem("flightmaster-theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    this.applyTheme(systemTheme);
  }

  // Get theme information
  getThemeInfo(theme) {
    const themeInfo = {
      light: {
        name: "Light",
        description: "Clean and bright theme",
        icon: "fa-sun",
      },
      dark: {
        name: "Dark",
        description: "Easy on the eyes in low light",
        icon: "fa-moon",
      },
      cupcake: {
        name: "Cupcake",
        description: "Sweet and delightful theme",
        icon: "fa-palette",
      },
      bumblebee: {
        name: "Bumblebee",
        description: "Warm and cheerful theme",
        icon: "fa-palette",
      },
      emerald: {
        name: "Emerald",
        description: "Fresh and natural theme",
        icon: "fa-palette",
      },
    };

    return themeInfo[theme] || themeInfo.light;
  }
}

// Initialize theme manager
document.addEventListener("DOMContentLoaded", () => {
  window.themeManager = new ThemeManager();
});

// Add CSS for theme transitions
const themeTransitionCSS = `
.theme-transition * {
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease !important;
}
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = themeTransitionCSS;
document.head.appendChild(styleSheet);

export default ThemeManager;
