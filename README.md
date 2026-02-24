# FlightMaster Pro - Vanilla JavaScript SPA for Flight Booking (Tailwind, DaisyUI, Local-first)

## Plain docs links

- HTML (MDN) docs: [https://developer.mozilla.org/en-US/docs/Web/HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- CSS (MDN) docs: [https://developer.mozilla.org/en-US/docs/Web/CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- Tailwind CSS docs: [https://tailwindcss.com/docs/](https://tailwindcss.com/docs/)
- PostCSS docs / postcss.config: [https://postcss.org/](https://postcss.org/)
- daisyUI docs: [https://daisyui.com/](https://daisyui.com/)
- Google Fonts docs: [https://fonts.google.com/](https://fonts.google.com/)
- Font Awesome docs: [https://fontawesome.com/](https://fontawesome.com/)
- JavaScript (MDN) docs: [https://developer.mozilla.org/en-US/docs/Web/JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- ECMAScript (spec, ECMA-262) docs: [https://www.ecma-international.org/publications-and-standards/standards/ecma-262/](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)

---

FlightMaster Pro is a polished, modular, and production-minded single-page booking demo built with vanilla JavaScript, Tailwind + DaisyUI, and progressive UX patterns. It showcases advanced client-side architecture for authentication, booking workflows, theming, and performant UI interactions-ideal for portfolio presentation or as a baseline for production prototypes.

## Badges

- **Feature-rich**
- **Modular ES Modules**
- **Local-first-localStorage**
- **Compatible with modern browsers**

## Quick Links

- Live demo --> only local: open [index.html](index.html)
- Sign in: [login.html](login.html)
- Sign up: [signup.html](signup.html)
- Styles: [styles/main.css](styles/main.css)
- JavaScript modules:
  - [`FlightMasterApp`](js/main.js) - [js/main.js](js/main.js)
  - [`FlightBookingSystem`](js/booking.js) - [js/booking.js](js/booking.js)
  - [`AuthSystem`](js/auth.js) - [js/auth.js](js/auth.js)
  - [`ThemeManager`](js/theme.js) - [js/theme.js](js/theme.js)
- Images folder: [images/](images/)

### Why this project stands out

- Clean vanilla-ES module architecture (no frameworks) that is easy to audit and extend.
- Real-world UX: debounced resize, keyboard accessibility helpers, progressive form validation, autosave, and offline awareness.
- Modularity: auth, booking, theme, and app orchestration separated into focused classes - see [`AuthSystem.registerUser`](js/auth.js), [`FlightBookingSystem.processBooking`](js/booking.js), and [`ThemeManager.applyTheme`](js/theme.js).
- Developer-friendly: clear localStorage data models, analytics hooks, and performance observers for profiling.

### Core features

- Authentication: Email/password sign up and sign in, social login simulation, password-strength meter, form autosave and validation. (See [`AuthSystem`](js/auth.js).)
- Booking flow: Flight search mock, ticket selection, subtotal/VAT/total calc, booking confirmation modal, payment modal simulation, booking history and cancellation. (See [`FlightBookingSystem`](js/booking.js).)
- Theming: Smooth light/dark theming with system preference support and dynamic CSS injection. (See [`ThemeManager`](js/theme.js).)
- App orchestrator: Global event handling, notification UX, keyboard navigation, and accessibility helpers. (See [`FlightMasterApp`](js/main.js).)
- Responsive UI: Tailwind + DaisyUI for high-fidelity, accessible components; custom CSS extensions in [styles/main.css](styles/main.css).

### Project structure

- [index.html](index.html) - Landing page and booking UI
- [login.html](login.html) - Login page wired to auth module
- [signup.html](signup.html) - Signup page wired to auth module
- [styles/main.css](styles/main.css) - Custom design system and utilities
- [js/main.js](js/main.js) - Application bootstrap and `FlightMasterApp`
- [js/auth.js](js/auth.js) - Authentication class `AuthSystem`
- [js/booking.js](js/booking.js) - Booking class `FlightBookingSystem`
- [js/theme.js](js/theme.js) - Theme manager `ThemeManager`
- [images/](images/) - static assets

### Project Git and Link

1. **git repo clone:**

```
git clone https://github.com/md-abu-kayser/flightmaster-vanillajs.git

```

2. **github Live Link:**

```
https://md-abu-kayser.github.io/flightmaster-vanillajs/

```

### Recommended dev workflow

- Use browser DevTools to inspect performance panels and Network for analytics stored in localStorage keys:
  - flightmaster-bookings
  - flightmaster-users
  - flightmaster-analytics
- Toggle theme and inspect injected styles: see [`ThemeManager.applyCustomStyles`](js/theme.js).

### Important implementation notes (for evaluators and clients)

- Auth is local-first and for demo purposes only - passwords are encoded with a simple base64 helper (`AuthSystem.hashPassword`) and must be replaced with real server-side auth and hashing for production.
- Payment flow is simulated. Replace `showPaymentModal` / `processPayment` with a secure gateway integration before accepting real payments.
- Data persistence relies on localStorage; for multi-user or multi-device sync, wire a backend API.

### Extensibility and integration points

- Replace mock flight search in [`FlightBookingSystem.generateMockFlightResults`](js/booking.js) with API calls.
- Integrate OAuth providers where `AuthSystem.handleSocialLogin` simulates social auth.
- Swap localStorage for indexedDB or remote API with minimal changes - save/load helpers are centralized.

### Contributing

- Pull requests welcome. Keep changes scoped to modules:
  - UI tweaks --> [styles/main.css](styles/main.css)
  - Behavior --> [js/\*.js](js/)
- Follow semantic commit messages and include screenshots or short recordings for UI changes.

### Security and Privacy

- Demo stores user data locally for UX; do not treat this as production-ready storage.
- Remove or replace demo encodings and simulated providers before production roll-out.

### Appendix: Notable symbols and entry points

- [`FlightMasterApp`](js/main.js) - Application bootstrap and global UX helpers. See [js/main.js](js/main.js).
- [`AuthSystem`](js/auth.js) - All auth flows, validation and user management. See [js/auth.js](js/auth.js).
- [`FlightBookingSystem`](js/booking.js) - Booking workflows, search, and local persistence. See [js/booking.js](js/booking.js).
- [`ThemeManager`](js/theme.js) - Advanced theme handling with system preference sync. See [js/theme.js](js/theme.js).

### License

- This project is licensed under the terms of the **[MIT License](./LICENSE)**.
- You may replace or update the license as needed for client or proprietary projects.

---

### Contact and Maintainer

- **_Name:_** Md Abu Kayser - Full-Stack Engineer
- **_Project:_** _FlightMaster-VanillaJS_
- **_Maintainer:_** [md-abu-kayser](https://github.com/md-abu-kayser)
- **_GitHub:_** [github.com/abu.kayser-official](https://github.com/md-abu-kayser)
- **_Email:_** [abu.kayser.official@gmail.com](mailto:abu.kayser.official@gmail.com)

If you’d like this README tailored for a specific purpose - such as **hiring managers**, **open-source contributors**, or **client deliverables** - feel free to request a custom tone or format.

---

**Thank you for reviewing this project!**

- Enjoy showcasing FlightMaster Pro - it's designed to impress with clear architecture, polished UX, and ready-to-extend modules.

---
