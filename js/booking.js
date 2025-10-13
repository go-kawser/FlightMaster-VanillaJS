// ES6 Class for Advanced Flight Booking System
class FlightBookingSystem {
  constructor() {
    this.tickets = {
      firstClass: {
        count: 1,
        price: 150,
        element: "firstClass",
        label: "First Class",
      },
      economy: {
        count: 1,
        price: 100,
        element: "economy",
        label: "Economy Class",
      },
    };

    this.bookingData = {
      from: "",
      to: "",
      departure: "",
      return: "",
      passengers: 1,
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.calculateTotal();
    this.setupDateValidation();
    this.loadSavedData();
  }

  bindEvents() {
    // Event delegation for ticket buttons
    document.addEventListener("click", (e) => {
      if (e.target.closest(".ticket-increase")) {
        this.handleTicketChange(
          e.target.closest(".ticket-increase").dataset.type,
          true
        );
      }
      if (e.target.closest(".ticket-decrease")) {
        this.handleTicketChange(
          e.target.closest(".ticket-decrease").dataset.type,
          false
        );
      }
    });

    // Form input events
    ["flyingFrom", "flyingTo", "departureDate", "returnDate"].forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("input", (e) => {
          this.bookingData[id] = e.target.value;
          this.validateForm();
          this.saveToLocalStorage();
        });
      }
    });

    // Book now button
    document
      .getElementById("bookNowBtn")
      ?.addEventListener("click", () => this.handleBooking());

    // Enter key support
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && this.isFormValid()) {
        this.handleBooking();
      }
    });
  }

  handleTicketChange = (type, isIncrease) => {
    const ticketKey = type === "first" ? "firstClass" : "economy";
    const ticket = this.tickets[ticketKey];

    if (isIncrease) {
      ticket.count++;
      this.animateButton("increase", ticketKey);
    } else if (ticket.count > 0) {
      ticket.count--;
      this.animateButton("decrease", ticketKey);
    }

    this.updateTicketDisplay(ticket);
    this.calculateTotal();
    this.animateUpdate(ticket.element);
    this.saveToLocalStorage();
  };

  updateTicketDisplay(ticket) {
    const countElement = document.getElementById(`${ticket.element}Count`);
    const totalElement = document.getElementById(`${ticket.element}Total`);

    if (countElement && totalElement) {
      countElement.textContent = ticket.count;
      totalElement.textContent = this.formatCurrency(
        ticket.count * ticket.price
      );

      // Update accessibility
      countElement.setAttribute("aria-valuenow", ticket.count);
    }
  }

  calculateTotal() {
    const subtotal = Object.values(this.tickets).reduce(
      (sum, ticket) => sum + ticket.count * ticket.price,
      0
    );

    const vat = Math.round(subtotal * 0.1 * 100) / 100; // More precise calculation
    const grandTotal = subtotal + vat;

    this.updatePriceDisplay(subtotal, vat, grandTotal);
    this.validateForm();
  }

  updatePriceDisplay(subtotal, vat, grandTotal) {
    const elements = {
      subtotalPrice: subtotal,
      vatAmount: vat,
      grandTotal: grandTotal,
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = this.formatCurrency(value);
      }
    });
  }

  setupDateValidation() {
    const departureInput = document.getElementById("departureDate");
    const returnInput = document.getElementById("returnDate");

    if (departureInput && returnInput) {
      // Set minimum date to today
      const today = new Date().toISOString().split("T")[0];
      departureInput.min = today;
      returnInput.min = today;

      departureInput.addEventListener("change", () => {
        if (returnInput.value && returnInput.value < departureInput.value) {
          returnInput.value = "";
        }
        returnInput.min = departureInput.value;
      });
    }
  }

  validateForm() {
    const from = document.getElementById("flyingFrom")?.value.trim();
    const to = document.getElementById("flyingTo")?.value.trim();
    const departure = document.getElementById("departureDate")?.value;
    const bookBtn = document.getElementById("bookNowBtn");

    const hasTickets = Object.values(this.tickets).some(
      (ticket) => ticket.count > 0
    );
    const isValid = from && to && departure && hasTickets;

    if (bookBtn) {
      bookBtn.disabled = !isValid;
      bookBtn.classList.toggle("btn-disabled", !isValid);
      bookBtn.setAttribute("aria-disabled", !isValid);
    }

    return isValid;
  }

  isFormValid() {
    return this.validateForm();
  }

  handleBooking() {
    if (!this.isFormValid()) {
      this.showError(
        "Please fill in all required fields and select at least one ticket."
      );
      return;
    }

    const bookingData = this.collectBookingData();
    this.processBooking(bookingData);
  }

  collectBookingData() {
    return {
      from: document.getElementById("flyingFrom")?.value,
      to: document.getElementById("flyingTo")?.value,
      departure: document.getElementById("departureDate")?.value,
      return: document.getElementById("returnDate")?.value,
      tickets: { ...this.tickets },
      subtotal: document.getElementById("subtotalPrice")?.textContent,
      vat: document.getElementById("vatAmount")?.textContent,
      total: document.getElementById("grandTotal")?.textContent,
      timestamp: new Date().toISOString(),
      bookingId: this.generateBookingId(),
    };
  }

  processBooking(bookingData) {
    // Show loading state
    this.setLoadingState(true);

    // Simulate API call
    setTimeout(() => {
      this.setLoadingState(false);
      this.showBookingSuccess(bookingData);
      this.saveBooking(bookingData);
      this.resetForm();
    }, 2000);
  }

  setLoadingState(loading) {
    const bookBtn = document.getElementById("bookNowBtn");
    if (!bookBtn) return;

    if (loading) {
      bookBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
      bookBtn.disabled = true;
    } else {
      bookBtn.innerHTML = '<i class="fas fa-plane-departure mr-2"></i>Book Now';
      bookBtn.disabled = false;
    }
  }

  showBookingSuccess(bookingData) {
    // Create success modal
    const modal = document.createElement("div");
    modal.className = "modal modal-open";
    modal.innerHTML = `
            <div class="modal-box transform transition-all duration-500 scale-95 hover:scale-100">
                <h3 class="font-bold text-2xl text-success mb-4 flex items-center gap-2">
                    <i class="fas fa-check-circle"></i>
                    Booking Confirmed! 🎉
                </h3>
                <div class="space-y-3 mb-6">
                    <p class="font-semibold">Booking ID: <span class="text-primary">${
                      bookingData.bookingId
                    }</span></p>
                    <p><strong>Route:</strong> ${bookingData.from} → ${
      bookingData.to
    }</p>
                    <p><strong>Departure:</strong> ${new Date(
                      bookingData.departure
                    ).toLocaleDateString()}</p>
                    ${
                      bookingData.return
                        ? `<p><strong>Return:</strong> ${new Date(
                            bookingData.return
                          ).toLocaleDateString()}</p>`
                        : ""
                    }
                    <p><strong>Total:</strong> ${bookingData.total}</p>
                </div>
                <div class="modal-action">
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-check mr-2"></i>Great!
                    </button>
                    <button class="btn btn-outline" onclick="this.closest('.modal').remove(); window.print();">
                        <i class="fas fa-print mr-2"></i>Print Ticket
                    </button>
                </div>
            </div>
        `;
    document.body.appendChild(modal);
  }

  showError(message) {
    if (window.flightMasterApp) {
      window.flightMasterApp.showNotification(message, "error");
    } else {
      alert(message); // Fallback
    }
  }

  generateBookingId() {
    return (
      "FM" + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase()
    );
  }

  saveBooking(bookingData) {
    const bookings = JSON.parse(
      localStorage.getItem("flightmaster-bookings") || "[]"
    );
    bookings.push(bookingData);
    localStorage.setItem("flightmaster-bookings", JSON.stringify(bookings));
  }

  saveToLocalStorage() {
    const saveData = {
      tickets: this.tickets,
      bookingData: this.bookingData,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("flightmaster-draft", JSON.stringify(saveData));
  }

  loadSavedData() {
    try {
      const saved = JSON.parse(
        localStorage.getItem("flightmaster-draft") || "{}"
      );
      if (saved.tickets && saved.bookingData) {
        this.tickets = saved.tickets;
        this.bookingData = saved.bookingData;

        // Update UI with saved data
        Object.entries(this.tickets).forEach(([key, ticket]) => {
          this.updateTicketDisplay(ticket);
        });

        // Restore form values
        Object.entries(this.bookingData).forEach(([key, value]) => {
          const element = document.getElementById(key);
          if (element && value) element.value = value;
        });

        this.calculateTotal();
      }
    } catch (error) {
      console.warn("Failed to load saved data:", error);
    }
  }

  resetForm() {
    // Reset tickets to default
    Object.values(this.tickets).forEach((ticket) => {
      ticket.count = 1;
      this.updateTicketDisplay(ticket);
    });

    // Clear form fields
    ["flyingFrom", "flyingTo", "departureDate", "returnDate"].forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.value = "";
    });

    this.bookingData = {
      from: "",
      to: "",
      departure: "",
      return: "",
      passengers: 1,
    };

    this.calculateTotal();
    localStorage.removeItem("flightmaster-draft");
  }

  animateUpdate(elementId) {
    const element = document.getElementById(`${elementId}Count`);
    if (element) {
      element.classList.add("scale-125", "text-primary");
      setTimeout(() => {
        element.classList.remove("scale-125", "text-primary");
      }, 300);
    }
  }

  animateButton(action, type) {
    const button = document.querySelector(
      `.ticket-${action}[data-type="${type}"]`
    );
    if (button) {
      button.classList.add("btn-active");
      setTimeout(() => button.classList.remove("btn-active"), 150);
    }
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Advanced analytics
  trackBookingEvent(event, data) {
    if (typeof gtag !== "undefined") {
      gtag("event", event, data);
    }

    // Custom analytics
    const analyticsData = {
      event,
      ...data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    console.log("Analytics Event:", analyticsData);
  }
}

// Initialize booking system
document.addEventListener("DOMContentLoaded", () => {
  window.bookingSystem = new FlightBookingSystem();
});

export default FlightBookingSystem;
