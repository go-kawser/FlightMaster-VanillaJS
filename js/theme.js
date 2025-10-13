// Theme Management System
class ThemeManager {
  constructor() {
    this.themes = ["light", "dark", "cupcake", "bumblebee", "emerald"];
    this.currentTheme = localStorage.getItem("theme") || "light";
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.bindThemeEvents();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.currentTheme = theme;
    localStorage.setItem("theme", theme);

    // Update theme selector UI
    this.updateThemeSelector(theme);
  }

  bindThemeEvents() {
    // Theme selector clicks
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-theme]")) {
        const theme = e.target.closest("[data-theme]").dataset.theme;
        this.applyTheme(theme);
        this.showThemeToast(theme);
      }
    });

    // System theme preference
    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (!localStorage.getItem("theme")) {
            this.applyTheme(e.matches ? "dark" : "light");
          }
        });
    }
  }

  updateThemeSelector(currentTheme) {
    document.querySelectorAll("[data-theme]").forEach((item) => {
      if (item.dataset.theme === currentTheme) {
        item.classList.add("active", "bg-primary", "text-primary-content");
      } else {
        item.classList.remove("active", "bg-primary", "text-primary-content");
      }
    });
  }

  showThemeToast(theme) {
    // Create toast notification
    const toast = document.createElement("div");
    toast.className = `toast toast-top toast-center z-50`;
    toast.innerHTML = `
            <div class="alert alert-success flex">
                <span>Theme changed to ${theme}</span>
            </div>
        `;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2000);
  }

  // Cycle through themes
  cycleTheme() {
    const currentIndex = this.themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.applyTheme(this.themes[nextIndex]);
  }
}

// Initialize theme manager
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager();
});

export default ThemeManager;
