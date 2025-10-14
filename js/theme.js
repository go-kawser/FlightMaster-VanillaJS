// Theme Management System
class ThemeManager {
  constructor() {
    this.themes = ["light", "dark"];
    this.currentTheme = this.getSavedTheme();
    this.isTransitioning = false;
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.bindThemeEvents();
    this.setupSystemPreference();
  }

  getSavedTheme() {
    const saved = localStorage.getItem("flightmaster-theme");
    if (saved && this.themes.includes(saved)) {
      return saved;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  applyTheme(theme) {
    if (this.isTransitioning || !this.themes.includes(theme)) return;

    this.isTransitioning = true;

    document.documentElement.classList.add("theme-transition");

    setTimeout(() => {
      document.documentElement.setAttribute("data-theme", theme);
      this.currentTheme = theme;
      localStorage.setItem("flightmaster-theme", theme);

      this.updateThemeUI(theme);
      this.dispatchThemeChange(theme);
      this.applyCustomStyles(theme);

      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
        this.isTransitioning = false;
      }, 300);
    }, 50);
  }

  bindThemeEvents() {
    document.addEventListener("click", (e) => {
      if (e.target.closest("#theme-toggle")) {
        const current = this.currentTheme;
        const newTheme = current === "light" ? "dark" : "light";
        this.applyTheme(newTheme);
        this.showThemeToast(newTheme);
      }
    });
  }

  setupSystemPreference() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleSystemThemeChange = (e) => {
        if (!localStorage.getItem("flightmaster-theme")) {
          this.applyTheme(e.matches ? "dark" : "light");
        }
      };

      mediaQuery.addEventListener("change", handleSystemThemeChange);
    }
  }

  updateThemeUI(theme) {
    const themeToggleIcons = document.querySelectorAll("#theme-toggle i");
    themeToggleIcons.forEach((icon) => {
      icon.className =
        theme === "light" ? "fas fa-sun text-base" : "fas fa-moon text-base";
    });
  }

  showThemeToast(theme) {
    const themeNames = {
      light: "🌞 Light Theme",
      dark: "🌙 Dark Theme",
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
        detail: { theme },
      })
    );
  }

  applyCustomStyles(theme) {
    const existingStyle = document.getElementById("theme-custom-styles");
    if (existingStyle) existingStyle.remove();

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
        .navbar {
          background: rgba(17, 24, 39, 0.95);
        }
        .card {
          background: hsl(var(--b1));
          border-color: hsl(var(--bc) / 0.1);
        }
      `,
      light: `
        .bg-gradient-custom {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }
        .navbar {
          background: rgba(255, 255, 255, 0.95);
        }
      `,
    };

    return styles[theme] || styles.light;
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  isDarkTheme() {
    return this.currentTheme === "dark";
  }

  resetToSystem() {
    localStorage.removeItem("flightmaster-theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    this.applyTheme(systemTheme);
  }
}

// Initialize theme manager
document.addEventListener("DOMContentLoaded", () => {
  window.themeManager = new ThemeManager();
});

export default ThemeManager;
