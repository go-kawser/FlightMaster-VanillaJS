# FlightMaster Pro

<p align="center">
  <strong>Vanilla JavaScript Flight Booking SPA</strong>
</p>

<p align="center">
  A modular, local-first flight booking interface built with
  <strong>HTML5, CSS3, JavaScript ES Modules, Tailwind CSS, and daisyUI</strong>.
</p>

<p align="center">
  Designed to demonstrate realistic booking workflows, client-side architecture,
  authentication UX, local persistence, responsive design, theming, and
  production-oriented frontend engineering practices.
</p>

<p align="center">

  <a href="https://md-abu-kayser.github.io/flightmaster-vanillajs/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2EA44F?style=for-the-badge&logo=github&logoColor=white" alt="Live Demo" />
  </a>

  <a href="https://github.com/md-abu-kayser/flightmaster-vanillajs" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository" />
  </a>

  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-2563EB?style=for-the-badge" alt="MIT License" />
  </a>

  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
    <img src="https://img.shields.io/badge/JavaScript-ES2020%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111827" alt="JavaScript ES2020+ Documentation" />
  </a>

  <a href="https://tailwindcss.com/docs" target="_blank">
    <img src="https://img.shields.io/badge/Tailwind%20CSS-Utility-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS Documentation" />
  </a>

  <a href="https://daisyui.com/docs/" target="_blank">
    <img src="https://img.shields.io/badge/daisyUI-Components-5A0EF8?style=for-the-badge" alt="daisyUI Documentation" />
  </a>

</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#data-model">Data Model</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#security">Security</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#roadmap">Roadmap</a>
</p>

---

## Overview

**FlightMaster Pro** is a browser-based flight booking prototype built without a frontend framework.

The project demonstrates how a reasonably complex user flow can be organized using:

- Native JavaScript ES modules
- Class-based domain modules
- Local persistence
- Responsive UI components
- Progressive form validation
- Theme management
- Booking workflows
- Client-side state orchestration

The application intentionally uses a **local-first architecture** so the complete experience can be explored without requiring a backend server.

The result is a self-contained frontend prototype suitable for:

- Portfolio presentation
- Frontend architecture demonstrations
- UI/UX experimentation
- JavaScript practice
- Client prototype discussions
- Future API integration

---

# Project Philosophy

The project follows a simple principle:

> **Build the complete user experience first, while keeping infrastructure boundaries clear enough to replace later.**

The application therefore separates:

```text
User Interface
      ↓
Application Orchestration
      ↓
Domain Modules
      ↓
Local Persistence
      ↓
Future Backend / External APIs
```

This makes the project useful as both a standalone frontend prototype and a starting point for a larger booking application.

---

# Product Experience

A typical booking journey looks like:

```text
Landing Page
    ↓
Search Flights
    ↓
View Mock Results
    ↓
Select Flight
    ↓
Review Booking
    ↓
Calculate Fare
    ↓
Simulated Payment
    ↓
Booking Confirmation
    ↓
Booking History
    ↓
Cancellation / Management
```

Authentication can be used alongside the booking workflow:

```text
Sign Up
   ↓
Sign In
   ↓
Authenticated Session
   ↓
Booking Experience
   ↓
Persistent Local Data
```

---

# Features

## Flight Search

The application provides a mock flight-search workflow designed to emulate the structure of a real booking experience.

The current implementation generates mock flight results locally through:

```text
js/booking.js
```

and specifically exposes a replaceable mock-search boundary.

---

## Booking Workflow

The booking system includes:

- Flight selection
- Ticket selection
- Fare calculation
- Subtotal calculation
- VAT calculation
- Total calculation
- Booking confirmation
- Payment modal simulation
- Booking history
- Booking cancellation

The core booking logic is encapsulated in:

```text
FlightBookingSystem
```

within:

```text
js/booking.js
```

---

## Local Authentication

The application demonstrates a complete authentication-oriented user experience including:

- Sign up
- Sign in
- Password-strength feedback
- Form validation
- Form autosave
- Social-login simulation
- Local user persistence

Authentication responsibilities are isolated in:

```text
js/auth.js
```

through:

```text
AuthSystem
```

---

## Important Authentication Limitation

This is a **frontend demonstration**, not a production authentication system.

The current demo stores authentication data locally and uses a simple base64-based encoding helper.

```text
User
 ↓
AuthSystem
 ↓
localStorage
```

Base64 is **not encryption and is not password hashing**.

For production use, this layer should be replaced by:

```text
Browser
   ↓
HTTPS
   ↓
Backend Authentication API
   ↓
Secure Password Hashing
   ↓
Database
```

The current repository explicitly documents this limitation.

---

## Theme System

FlightMaster Pro includes light/dark theme switching with system-preference support.

The theme system is isolated in:

```text
js/theme.js
```

through:

```text
ThemeManager
```

The module is responsible for applying and synchronizing theme state rather than allowing theme logic to spread through the application.

---

## Responsive UI

The interface is designed for:

- Desktop
- Tablet
- Mobile

Tailwind CSS and daisyUI provide the primary component and responsive styling foundation, while custom styles are maintained in:

```text
styles/main.css
```

The repository describes this as the main custom styling layer.

---

## Progressive Form Validation

Form interactions provide validation feedback before submitting data.

Typical flow:

```text
Input
  ↓
Validate
  ↓
Show feedback
  ↓
Correct input
  ↓
Continue
```

This is particularly useful for:

- Authentication forms
- Booking information
- Payment simulation

---

## Autosave

Form state can be persisted locally to improve the user experience when navigating through multi-step flows.

This is implemented as a frontend convenience feature, not as durable server-side persistence.

---

## Offline Awareness

The application includes client-side awareness of connectivity state.

The intent is to provide better UX when network connectivity changes, while core local-first data remains accessible.

---

## Keyboard & Accessibility Helpers

The application includes keyboard-oriented helpers and interaction support as part of its centralized application orchestration.

These responsibilities are associated with:

```text
FlightMasterApp
```

in:

```text
js/main.js
```

---

# Architecture

## High-Level Architecture

```text
┌───────────────────────────────────────────────────────┐
│                    Presentation Layer                 │
│                                                       │
│ HTML │ Tailwind CSS │ daisyUI │ Main Styles           │
└───────────────────────────┬───────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────┐
│                 Application Layer                     │
│                                                       │
│ FlightMasterApp                                       │
│ Global Events │ Notifications │ Keyboard UX          │
└───────────────┬──────────────┬──────────────┬─────────┘
                │              │              │
                ▼              ▼              ▼
        ┌────────────┐  ┌──────────────┐  ┌────────────┐
        │ AuthSystem │  │ BookingSystem│  │ThemeManager│
        └──────┬─────┘  └──────┬───────┘  └─────┬──────┘
               │               │                │
               └───────────────┼────────────────┘
                               ▼
                    ┌──────────────────────┐
                    │   Local Persistence  │
                    │     localStorage     │
                    └──────────────────────┘
```

The repository deliberately separates authentication, booking, theme, and application orchestration into focused modules.

---

# Module Responsibilities

| Module                | Responsibility                                                                      |
| --------------------- | ----------------------------------------------------------------------------------- |
| `FlightMasterApp`     | Application bootstrap, global events, notifications, keyboard/accessibility helpers |
| `AuthSystem`          | Registration, login, validation, local user/session behavior                        |
| `FlightBookingSystem` | Flight search, fare calculation, booking lifecycle, persistence                     |
| `ThemeManager`        | Theme selection and system preference synchronization                               |
| `main.css`            | Custom styling and design-system extensions                                         |
| HTML pages            | Presentation and route-level entry points                                           |

---

# Application Architecture Principles

## Single Responsibility

Each major JavaScript module has a focused responsibility.

```text
Authentication
    ≠
Booking
    ≠
Theme
    ≠
App Orchestration
```

---

## ES Module Design

The project avoids a frontend framework and instead organizes behavior through native JavaScript modules.

This makes the application:

- Easy to inspect
- Easy to debug
- Easy to extend
- Low in runtime dependencies

---

## Replaceable Boundaries

Important external-facing concerns are kept behind specific methods.

For example:

```text
Mock Flight Search
       ↓
generateMockFlightResults()
```

can later become:

```text
Real Flight API
       ↓
fetchFlightResults()
```

The current repository explicitly identifies the mock flight generator as an integration point.

---

# Data Model

The current application uses `localStorage` as its persistence layer.

Important storage keys include:

```text id="xj5x1b"
flightmaster-users
flightmaster-bookings
flightmaster-analytics
```

These keys are documented as useful points for development and DevTools inspection.

---

# Persistence Architecture

The current local-first flow is:

```text
UI
 ↓
Domain Module
 ↓
localStorage
```

A future production architecture could become:

```text
UI
 ↓
Domain / API Service
 ↓
Backend API
 ↓
Database
```

This means the current local persistence can serve as a prototype data source without defining the final production infrastructure.

---

# Booking Lifecycle

The booking state can conceptually move through:

```text
SEARCHED
   ↓
SELECTED
   ↓
REVIEWED
   ↓
PAYMENT_PENDING
   ↓
CONFIRMED
   ↓
COMPLETED / CANCELLED
```

The current implementation simulates this flow entirely in the browser.

---

# Pricing Model

The booking workflow calculates:

```text
Subtotal
   +
VAT
   =
Total
```

The current project describes VAT and total calculation as part of its mock booking workflow.

For a production implementation, pricing should be validated server-side so the browser cannot be trusted as the authority for final amounts.

---

# Payment Architecture

## Current Implementation

The payment experience is simulated through a frontend modal.

```text
Booking
  ↓
Payment Modal
  ↓
Simulated Processing
  ↓
Confirmation
```

No real payment transaction should be inferred from the current interface.

---

## Production Architecture

A real payment implementation should move the sensitive workflow to a trusted backend:

```text
Browser
   ↓
Create Payment Intent
   ↓
Backend
   ↓
Payment Provider
   ↓
Webhook
   ↓
Backend Verification
   ↓
Order Confirmation
```

The current repository explicitly identifies payment processing as simulation-only and recommends replacing it with a secure gateway integration before real transactions.

---

# Quick Links

| Resource              | Location                               |
| --------------------- | -------------------------------------- |
| Main application      | [`index.html`](./index.html)           |
| Login                 | [`login.html`](./login.html)           |
| Signup                | [`signup.html`](./signup.html)         |
| Main styles           | [`styles/main.css`](./styles/main.css) |
| Application bootstrap | [`js/main.js`](./js/main.js)           |
| Authentication        | [`js/auth.js`](./js/auth.js)           |
| Booking system        | [`js/booking.js`](./js/booking.js)     |
| Theme manager         | [`js/theme.js`](./js/theme.js)         |
| Static images         | [`images/`](./images/)                 |

These are the principal entry points documented by the project.

---

# Repository Structure

```text id="hmecxg"
flightmaster-vanillajs/
│
├── index.html
├── login.html
├── signup.html
│
├── styles/
│   └── main.css
│
├── js/
│   ├── main.js
│   ├── auth.js
│   ├── booking.js
│   └── theme.js
│
├── images/
│   └── ...
│
├── LICENSE
└── README.md
```

---

# Getting Started

## Prerequisites

You only need:

- A modern web browser
- Git
- Optional static local server

Recommended browsers:

- Chrome
- Firefox
- Edge
- Safari

---

# Clone the Repository

```bash id="fno7x3"
git clone https://github.com/md-abu-kayser/flightmaster-vanillajs.git
```

Enter the project:

```bash id="3a8j5j"
cd flightmaster-vanillajs
```

---

# Run Locally

Because FlightMaster Pro is a static frontend application, you can open:

```text id="3o2f0h"
index.html
```

directly in a browser.

However, using a local HTTP server is recommended for a more realistic development environment.

---

# Local Server

For example:

```bash id="eblx6i"
npx http-server .
```

Then open the URL shown by the server.

Using a local server also helps avoid browser restrictions that can affect some static-file workflows.

---

# Exploring the Application

Recommended evaluation flow:

```text id="w6f5hi"
1. Open the landing page
2. Switch between themes
3. Search for a flight
4. Select a result
5. Review fare calculations
6. Continue through the booking flow
7. Explore authentication
8. Inspect booking history
9. Test cancellation
10. Resize the browser and verify responsive behavior
```

---

# Development Inspection

For deeper technical inspection, browser DevTools can be used.

### Application Storage

Inspect:

```text id="qu3k2j"
localStorage
├── flightmaster-users
├── flightmaster-bookings
└── flightmaster-analytics
```

These are documented project storage points.

### Performance

Useful browser panels:

- Performance
- Network
- Application
- Console
- Lighthouse

---

# Security

## Current Security Model

The current project is a **demo/prototype**.

Local storage is used for user and booking data, and authentication uses a simple client-side demonstration approach.

Therefore:

> **Do not use the current authentication, password handling, local storage, or simulated payment workflow for real customer data or financial transactions.**

---

# Production Security Migration

A production implementation should introduce:

```text
HTTPS
   ↓
Secure Backend API
   ↓
Password Hashing
   ↓
Session / Token Management
   ↓
Database
   ↓
Authorization
```

Additional protections should include:

- Input validation
- Rate limiting
- CSRF protection where appropriate
- Secure cookie configuration where applicable
- Server-side authorization
- Audit logging
- Secrets management
- Payment-provider verification
- Database-level constraints

---

# Privacy Considerations

Because the demo stores data in browser storage:

- Data is tied to the current browser/profile
- Clearing storage can remove the data
- Data is not inherently synchronized across devices
- Local storage should not be treated as secure storage

For a multi-device application, persistence should move to a backend database. The existing project documentation explicitly identifies this migration path.

---

# Accessibility

The application includes keyboard-oriented helpers and accessibility-related UX handling in the application orchestration layer.

For a production release, accessibility should additionally be validated through:

```text
Semantic HTML
+
Keyboard Navigation
+
Focus Management
+
Screen Reader Testing
+
Color Contrast
+
Accessible Form Errors
```

Recommended audit tools:

- Lighthouse
- axe DevTools
- WAVE

---

# Responsive Design

The interface is intended to work across:

```text
Mobile
  ↓
Tablet
  ↓
Desktop
```

Responsive behavior is primarily handled through Tailwind CSS and custom CSS extensions.

Recommended manual test widths:

```text
320px
375px
768px
1024px
1280px
1440px
```

---

# Performance

The project's local-first architecture removes the need for an application backend during the demo.

Performance considerations include:

- Small modular JavaScript files
- Native browser execution
- CSS-based UI behavior where practical
- Local data persistence
- Lightweight static deployment

Future optimizations could include:

- Asset compression
- Image lazy loading
- JavaScript minification
- CSS minification
- Resource preloading
- Caching strategies
- API request caching

---

# Extensibility

The project intentionally exposes several integration points.

## Flight Search

Current:

```text id="u0jjph"
generateMockFlightResults()
```

Future:

```text id="lw29u5"
Flight Search API
```

---

## Authentication

Current:

```text id="o79s8s"
AuthSystem
   ↓
localStorage
```

Future:

```text id="r5rfyz"
AuthSystem
   ↓
REST / GraphQL API
   ↓
Identity Service
```

The project documentation explicitly identifies OAuth/social-login simulation and backend authentication as future integration areas.

---

## Persistence

Current:

```text id="g0l67v"
localStorage
```

Future options:

```text id="2f5zup"
REST API
GraphQL API
IndexedDB
PostgreSQL
MongoDB
```

---

# Testing Strategy

The current repository is primarily a browser-based prototype.

A more mature implementation should introduce automated tests around the core business logic.

## Unit Tests

Test isolated functions such as:

- Fare calculation
- VAT calculation
- Input validation
- Booking state transitions
- Theme selection
- Data persistence helpers

## Integration Tests

Test flows such as:

```text
Search
   ↓
Select
   ↓
Book
   ↓
Persist
```

## End-to-End Tests

A future E2E suite could validate:

```text
Sign Up
   ↓
Login
   ↓
Search Flight
   ↓
Book
   ↓
Confirm
   ↓
View History
```

---

# Quality Gates

For a production-oriented evolution, changes should pass:

```text
Lint
  ↓
Type / Static Validation
  ↓
Unit Tests
  ↓
Integration Tests
  ↓
Build
  ↓
Deployment
```

Although the current project is vanilla JavaScript, linting can still be introduced with ESLint and browser tests with Playwright or Cypress.

---

# Deployment

FlightMaster Pro is suitable for static hosting.

The current live deployment is available on GitHub Pages:

```text
https://md-abu-kayser.github.io/flightmaster-vanillajs/
```

---

# Static Deployment Architecture

```text
Git Repository
      ↓
Static Hosting
      ↓
HTML / CSS / JS / Images
      ↓
Browser
```

No server-side runtime is required for the current demo.

---

# Production Evolution

A production booking platform would likely evolve toward:

```text
                        Web Client
                            │
                            ▼
                      API Gateway
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
       Auth Service    Flight Service   Booking Service
            │               │               │
            └───────────────┼───────────────┘
                            ▼
                       Database
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
      Payments          Notifications      Analytics
```

The current project can be viewed as the frontend experience layer for such a future system.

---

# Recommended Production Stack

A future backend implementation could introduce:

| Layer          | Possible Technology                |
| -------------- | ---------------------------------- |
| Frontend       | React / Next.js / Vanilla JS       |
| API            | Node.js / Express                  |
| Database       | PostgreSQL                         |
| Cache          | Redis                              |
| Authentication | Secure server-side identity system |
| Payments       | Payment provider API               |
| Search         | Dedicated flight/search API        |
| Deployment     | Docker + Cloud Platform            |
| Monitoring     | Logs + Metrics + Error Tracking    |
| CI/CD          | GitHub Actions                     |

These are potential evolution paths, not dependencies of the current project.

---

# Roadmap

## User Experience

```text
[ ] Improved flight filters
[ ] Sort by price
[ ] Sort by duration
[ ] Flight detail view
[ ] Multi-step checkout
[ ] Passenger management
[ ] Seat selection UI
[ ] Baggage selection
```

## Account Features

```text
[ ] Backend authentication
[ ] Profile management
[ ] Persistent accounts
[ ] Multi-device synchronization
[ ] Password recovery
[ ] Real OAuth providers
```

## Booking

```text
[ ] Real flight API
[ ] Server-side fare calculation
[ ] Booking persistence
[ ] Booking reference generation
[ ] Real cancellation workflow
[ ] Email confirmation
```

## Payments

```text
[ ] Real payment provider
[ ] Server-side payment verification
[ ] Webhook processing
[ ] Refund workflow
```

## Engineering

```text
[ ] Automated unit tests
[ ] E2E testing
[ ] ESLint
[ ] CI/CD
[ ] Error monitoring
[ ] Analytics dashboard
```

---

# Engineering Standards

The project should preserve these principles as it grows:

```text
✓ Small focused modules
✓ Explicit integration boundaries
✓ Reusable UI behavior
✓ Predictable data structures
✓ Defensive input validation
✓ Clear user feedback
✓ Responsive design
✓ Accessibility awareness
✓ No secrets in source control
✓ Production limitations documented honestly
```

---

# Why This Project Matters

FlightMaster Pro demonstrates that a useful application architecture does not require a frontend framework.

It shows how vanilla JavaScript can still support:

```text
Modular Architecture
        +
Stateful Workflows
        +
Authentication UX
        +
Persistence
        +
Responsive UI
        +
Theme Management
        +
Business Logic
```

The most valuable aspect of the project is not the mock booking data itself.

It is the architectural separation that makes the prototype **replaceable**:

```text
Mock Search
    → Real Flight API

Local Auth
    → Backend Auth

localStorage
    → Database

Payment Simulation
    → Payment Gateway

Static Frontend
    → Production Client
```

---

# Project Limitations

For technical accuracy, the current implementation has several intentional limitations:

| Area               | Current State          | Production Replacement     |
| ------------------ | ---------------------- | -------------------------- |
| Authentication     | Local demo             | Server-side authentication |
| Password handling  | Demonstration encoding | Secure password hashing    |
| Persistence        | `localStorage`         | Database                   |
| Flight data        | Mock generation        | Flight API                 |
| Payment            | Simulated              | Payment provider           |
| Multi-device state | Not supported          | Backend synchronization    |
| Authorization      | Client-side oriented   | Server-side enforcement    |

The repository itself documents these limitations and integration points.

---

# Contributing

Contributions are welcome.

## Development Process

```text
Create Issue
     ↓
Create Branch
     ↓
Implement Change
     ↓
Test Browser Behavior
     ↓
Review Responsive Layout
     ↓
Check Accessibility
     ↓
Commit
     ↓
Pull Request
```

---

# Branch Naming

Recommended:

```text
feature/flight-filters
feature/booking-history
feature/theme-system
fix/mobile-navigation
fix/booking-calculation
refactor/auth-module
docs/readme-update
```

---

# Commit Convention

Use Conventional Commit-style messages.

Examples:

```text
feat(booking): add booking cancellation flow
feat(auth): add local session persistence
feat(theme): add system preference detection
fix(search): handle empty flight results
fix(ui): improve mobile navigation
refactor(booking): simplify fare calculation
docs(readme): improve architecture documentation
test(booking): add fare calculation coverage
chore: update project tooling
```

---

# Pull Request Checklist

Before opening a PR:

```text
[ ] Feature works locally
[ ] No console errors
[ ] Desktop layout verified
[ ] Mobile layout verified
[ ] Keyboard interactions verified
[ ] Existing workflow still works
[ ] No secrets committed
[ ] Documentation updated
[ ] Commit message is meaningful
```

---

# Developer Notes

For deeper evaluation, inspect the following modules:

### `js/main.js`

Application orchestration, global event handling, notifications, and UX helpers.

### `js/auth.js`

Authentication-oriented client logic, validation, local persistence, and user flows.

### `js/booking.js`

Flight search, booking lifecycle, fare calculations, and booking persistence.

### `js/theme.js`

Theme state and system preference synchronization.

The repository explicitly identifies these four modules as its principal application entry points.

---

# Documentation & Learning Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [ECMAScript Specification](https://tc39.es/ecma262/)
- [Tailwind CSS](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/)
- [Font Awesome](https://fontawesome.com/)
- [GitHub Pages](https://pages.github.com/)

---

# License

This project is licensed under the **MIT License**.

See [LICENSE](./LICENSE) for the complete license text.

---

# Maintainer

<p align="center">
  <strong>Md Abu Kayser</strong>
</p>

<p align="center">
  Full-Stack Engineer
</p>

<p align="center">
  <a href="https://github.com/md-abu-kayser">
    GitHub
  </a>
  •
  <a href="mailto:abu.kayser.official@gmail.com">
    Email
  </a>
</p>

---

# Project Information

| Property     | Details                  |
| ------------ | ------------------------ |
| Project      | FlightMaster Pro         |
| Repository   | `flightmaster-vanillajs` |
| Type         | Vanilla JavaScript SPA   |
| UI           | Tailwind CSS + daisyUI   |
| Architecture | Native ES Modules        |
| Persistence  | `localStorage`           |
| Deployment   | GitHub Pages             |
| License      | MIT                      |
| Maintainer   | Md Abu Kayser            |

---

<p align="center">
  <a href="#flightmaster-pro">⬆ Back to top</a>
</p>

<p align="center">
  <strong>Search. Select. Book. Experience the workflow.</strong>
</p>

<p align="center">
  Built with HTML, CSS, JavaScript, and a focus on maintainable frontend architecture.
</p>
