// Advanced Theme Management System
class ThemeManager {
  constructor() {
    this.themes = ["light", "dark", "cupcake", "bumblebee", "emerald"];
    this.currentTheme = this.getSavedTheme();
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.bindThemeEvents();
    this.setupThemeObserver();
  }

  getSavedTheme() {
    return (
      localStorage.getItem("flightmaster-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  }

  applyTheme(theme) {
    if (!this.themes.includes(theme)) {
      theme = "light";
    }

    document.documentElement.setAttribute("data-theme", theme);
    this.currentTheme = theme;
    localStorage.setItem("flightmaster-theme", theme);

    this.updateThemeSelector(theme);
    this.dispatchThemeChange(theme);
    this.applyCustomStyles(theme);
  }

  bindThemeEvents() {
    // Theme selector clicks
    document.addEventListener("click", (e) => {
      const themeElement = e.target.closest("[data-theme]");
      if (themeElement) {
        const theme = themeElement.dataset.theme;
        this.applyTheme(theme);
        this.showThemeToast(theme);
      }
    });

    // System theme preference changes
    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (!localStorage.getItem("flightmaster-theme")) {
            this.applyTheme(e.matches ? "dark" : "light");
          }
        });
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "t") {
        e.preventDefault();
        this.cycleTheme();
      }
    });
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

  updateThemeSelector(currentTheme) {
    document.querySelectorAll("[data-theme]").forEach((item) => {
      const isActive = item.dataset.theme === currentTheme;
      item.classList.toggle("active", isActive);
      item.classList.toggle("bg-primary", isActive);
      item.classList.toggle("text-primary-content", isActive);

      // Update aria-current for accessibility
      item.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  cycleTheme() {
    const currentIndex = this.themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.applyTheme(this.themes[nextIndex]);
    this.showThemeToast(this.themes[nextIndex]);
  }

  showThemeToast(theme) {
    const themeNames = {
      light: "🌞 Light",
      dark: "🌙 Dark",
      cupcake: "🧁 Cupcake",
      bumblebee: "🐝 Bumblebee",
      emerald: "💎 Emerald",
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
            `,
      light: `
                .bg-gradient-custom {
                    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                }
            `,
      cupcake: `
                .bg-gradient-custom {
                    background: linear-gradient(135deg, #fae8ff 0%, #d8f2ff 100%);
                }
            `,
      bumblebee: `
                .bg-gradient-custom {
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                }
            `,
      emerald: `
                .bg-gradient-custom {
                    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
                }
            `,
    };

    return styles[theme] || styles.light;
  }

  handleThemeAttributeChange() {
    const newTheme = document.documentElement.getAttribute("data-theme");
    if (newTheme !== this.currentTheme) {
      this.currentTheme = newTheme;
      this.updateThemeSelector(newTheme);
    }
  }

  // Theme analytics
  trackThemeUsage(theme) {
    const analyticsData = {
      theme,
      previousTheme: this.previousTheme,
      timestamp: new Date().toISOString(),
      source: "theme_manager",
    };

    console.log("Theme Change:", analyticsData);
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
}

// Initialize theme manager
document.addEventListener("DOMContentLoaded", () => {
  window.themeManager = new ThemeManager();
});

export default ThemeManager;
