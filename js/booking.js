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

    this.flightData = {
      from: [
        "New York, USA",
        "London, UK",
        "Tokyo, Japan",
        "Sydney, Australia",
        "Dubai, UAE",
      ],
      to: [
        "Paris, France",
        "Bangkok, Thailand",
        "Singapore",
        "Rome, Italy",
        "Barcelona, Spain",
      ],
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.calculateTotal();
    this.setupDateValidation();
    this.setupAutoComplete();
    this.loadSavedData();
    this.setupFlightSearch();
  }

  bindEvents() {
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

    document
      .getElementById("bookNowBtn")
      ?.addEventListener("click", () => this.handleBooking());

    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && this.isFormValid()) {
        this.handleBooking();
      }
    });
  }

  setupAutoComplete() {
    this.setupFieldAutoComplete("flyingFrom", this.flightData.from);
    this.setupFieldAutoComplete("flyingTo", this.flightData.to);
  }

  setupFieldAutoComplete(fieldId, options) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    let list;

    field.addEventListener("input", (e) => {
      const value = e.target.value.toLowerCase();

      if (list) list.remove();

      if (!value) return;

      const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(value)
      );

      if (filteredOptions.length === 0) return;

      list = document.createElement("ul");
      list.className =
        "autocomplete-list absolute z-10 bg-base-100 border border-base-300 rounded-lg shadow-lg mt-1 w-full max-h-60 overflow-y-auto";

      filteredOptions.forEach((option) => {
        const item = document.createElement("li");
        item.className = "px-4 py-2 hover:bg-base-200 cursor-pointer";
        item.textContent = option;
        item.addEventListener("click", () => {
          field.value = option;
          this.bookingData[fieldId] = option;
          list.remove();
          this.validateForm();
        });
        list.appendChild(item);
      });

      field.parentNode.appendChild(list);
    });

    document.addEventListener("click", (e) => {
      if (list && !field.contains(e.target) && !list.contains(e.target)) {
        list.remove();
      }
    });
  }

  setupFlightSearch() {
    const searchButton = document.getElementById("searchFlights");
    if (searchButton) {
      searchButton.addEventListener("click", () => this.performFlightSearch());
    }
  }

  performFlightSearch() {
    if (!this.isFormValid()) {
      this.showError("Please fill in all required fields");
      return;
    }

    this.showLoading("Searching for flights...");

    setTimeout(() => {
      this.hideLoading();
      this.displayFlightResults();
    }, 2000);
  }

  displayFlightResults() {
    const results = this.generateMockFlightResults();

    const resultsContainer = document.getElementById("flightResults");
    if (resultsContainer) {
      resultsContainer.innerHTML = this.generateFlightResultsHTML(results);
      resultsContainer.classList.remove("hidden");
    }
  }

  generateMockFlightResults() {
    return [
      {
        airline: "Sky Airlines",
        flightNumber: "SKY123",
        departure: "08:00 AM",
        arrival: "11:00 AM",
        duration: "3h 00m",
        price: 350,
        stops: 0,
      },
      {
        airline: "Global Airways",
        flightNumber: "GLB456",
        departure: "12:30 PM",
        arrival: "04:30 PM",
        duration: "4h 00m",
        price: 275,
        stops: 1,
      },
      {
        airline: "Express Air",
        flightNumber: "EXP789",
        departure: "06:00 PM",
        arrival: "09:30 PM",
        duration: "3h 30m",
        price: 420,
        stops: 0,
      },
    ];
  }

  generateFlightResultsHTML(flights) {
    return `
      <div class="space-y-4">
        <h3 class="text-2xl font-bebas text-primary mb-4">Available Flights</h3>
        ${flights
          .map(
            (flight) => `
          <div class="card bg-base-100 shadow-lg border border-base-300">
            <div class="card-body">
              <div class="flex flex-col lg:flex-row justify-between items-center">
                <div class="flex-1">
                  <h4 class="font-bold text-lg">${flight.airline}</h4>
                  <p class="text-sm text-base-content/70">${
                    flight.flightNumber
                  }</p>
                </div>
                <div class="flex-1 text-center">
                  <div class="text-lg font-bold">${flight.departure} - ${
              flight.arrival
            }</div>
                  <div class="text-sm">${flight.duration} • ${
              flight.stops
            } stop${flight.stops !== 1 ? "s" : ""}</div>
                </div>
                <div class="flex-1 text-right">
                  <div class="text-2xl font-bold text-primary">$${
                    flight.price
                  }</div>
                  <button class="btn btn-primary btn-sm mt-2" onclick="window.bookingSystem.selectFlight(${JSON.stringify(
                    flight
                  ).replace(/"/g, "&quot;")})">
                    Select
                  </button>
                </div>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  selectFlight(flight) {
    this.selectedFlight = flight;
    this.showNotification(
      `Selected ${flight.airline} flight ${flight.flightNumber}`,
      "success"
    );

    const total = this.calculateFlightTotal();
    document.getElementById("grandTotal").textContent = `$${total}`;
  }

  calculateFlightTotal() {
    const ticketTotal = Object.values(this.tickets).reduce(
      (sum, ticket) => sum + ticket.count * ticket.price,
      0
    );

    const flightPrice = this.selectedFlight ? this.selectedFlight.price : 0;
    const subtotal = ticketTotal + flightPrice;
    const vat = Math.round(subtotal * 0.1);

    return subtotal + vat;
  }

  handleTicketChange(type, isIncrease) {
    const ticketKey = type === "first" ? "firstClass" : "economy";
    const ticket = this.tickets[ticketKey];

    if (isIncrease) {
      ticket.count++;
    } else if (ticket.count > 0) {
      ticket.count--;
    }

    this.updateTicketDisplay(ticket);
    this.calculateTotal();
    this.saveToLocalStorage();
  }

  updateTicketDisplay(ticket) {
    const countElement = document.getElementById(`${ticket.element}Count`);
    const totalElement = document.getElementById(`${ticket.element}Total`);

    if (countElement && totalElement) {
      countElement.textContent = ticket.count;
      totalElement.textContent = this.formatCurrency(
        ticket.count * ticket.price
      );
    }
  }

  calculateTotal() {
    const subtotal = Object.values(this.tickets).reduce(
      (sum, ticket) => sum + ticket.count * ticket.price,
      0
    );

    const vat = Math.round(subtotal * 0.1 * 100) / 100;
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

    if (window.authSystem && !window.authSystem.isAuthenticated()) {
      this.showError("Please login to book.");
      setTimeout(() => (window.location.href = "./login.html"), 2000);
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
      flight: this.selectedFlight,
      subtotal: document.getElementById("subtotalPrice")?.textContent,
      vat: document.getElementById("vatAmount")?.textContent,
      total: document.getElementById("grandTotal")?.textContent,
      timestamp: new Date().toISOString(),
      bookingId: this.generateBookingId(),
      status: "confirmed",
    };
  }

  processBooking(booking) {
    this.setLoadingState(true);

    setTimeout(() => {
      this.setLoadingState(false);
      this.showBookingSuccess(booking);
      this.saveBooking(booking);
      this.trackBookingEvent("booking_completed", booking);
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
    const modal = document.createElement("div");
    modal.className = "modal modal-open";
    modal.innerHTML = `
      <div class="modal-box transform transition-all duration-500 scale-95 hover:scale-100 max-w-2xl">
        <h3 class="font-bold text-2xl text-success mb-4 flex items-center gap-2">
          <i class="fas fa-check-circle"></i>
          Booking Confirmed! 🎉
        </h3>
        <div class="space-y-4 mb-6">
          <div class="bg-base-200 p-4 rounded-lg">
            <p class="font-semibold text-lg">Booking ID: <span class="text-primary">${
              bookingData.bookingId
            }</span></p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="font-semibold">Route</p>
              <p>${bookingData.from} → ${bookingData.to}</p>
            </div>
            <div>
              <p class="font-semibold">Departure</p>
              <p>${new Date(bookingData.departure).toLocaleDateString()}</p>
            </div>
            ${
              bookingData.return
                ? `
            <div>
              <p class="font-semibold">Return</p>
              <p>${new Date(bookingData.return).toLocaleDateString()}</p>
            </div>
            `
                : ""
            }
            <div>
              <p class="font-semibold">Total</p>
              <p class="text-lg font-bold text-primary">${bookingData.total}</p>
            </div>
          </div>
          
          ${
            bookingData.flight
              ? `
          <div class="bg-base-300 p-3 rounded">
            <p class="font-semibold">Flight Details</p>
            <p>${bookingData.flight.airline} - ${bookingData.flight.flightNumber}</p>
            <p>${bookingData.flight.departure} - ${bookingData.flight.arrival}</p>
          </div>
          `
              : ""
          }
          
          <div class="bg-base-200 p-3 rounded">
            <p class="font-semibold">Tickets</p>
            ${Object.values(bookingData.tickets)
              .map((ticket) =>
                ticket.count > 0
                  ? `<p>${ticket.count} × ${ticket.label}</p>`
                  : ""
              )
              .join("")}
          </div>
        </div>
        <div class="modal-action flex gap-2">
          <button class="btn btn-primary flex-1" onclick="this.closest('.modal').remove(); window.bookingSystem.showPaymentModal('${
            bookingData.bookingId
          }')">
            <i class="fas fa-credit-card mr-2"></i>Proceed to Pay
          </button>
          <button class="btn btn-outline" onclick="this.closest('.modal').remove(); window.print();">
            <i class="fas fa-print mr-2"></i>Print Ticket
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  showPaymentModal(bookingId) {
    if (!window.authSystem.requireLoginForPayment()) return;

    const modal = document.createElement("div");
    modal.className = "payment-modal";
    modal.innerHTML = `
      <div class="payment-card">
        <h3 class="font-bold text-2xl text-primary mb-4">Payment Details</h3>
        <form id="paymentForm" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Card Number</span>
            </label>
            <input type="text" name="cardNumber" placeholder="1234 5678 9012 3456" class="input input-bordered input-primary" required>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Expiry Date</span>
              </label>
              <input type="text" name="expiry" placeholder="MM/YY" class="input input-bordered input-primary" required>
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">CVV</span>
              </label>
              <input type="text" name="cvv" placeholder="123" class="input input-bordered input-primary" required>
            </div>
          </div>
          <button type="submit" class="btn btn-primary w-full">Pay Now</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    const paymentForm = modal.querySelector("#paymentForm");
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.processPayment(bookingId, modal);
    });
  }

  processPayment(bookingId, modal) {
    // Simulate payment
    this.showLoading("Processing payment...");

    setTimeout(() => {
      this.hideLoading();
      modal.remove();
      this.showNotification(
        "Payment successful! Receipt sent to email.",
        "success"
      );
      // Update booking status to paid
      const bookings = JSON.parse(
        localStorage.getItem("flightmaster-bookings") || "[]"
      );
      const booking = bookings.find((b) => b.bookingId === bookingId);
      if (booking) {
        booking.status = "paid";
        localStorage.setItem("flightmaster-bookings", JSON.stringify(bookings));
      }
    }, 3000);
  }

  showError(message) {
    if (window.flightMasterApp) {
      window.flightMasterApp.showNotification(message, "error");
    } else {
      alert(message);
    }
  }

  showNotification(message, type = "info") {
    if (window.flightMasterApp) {
      window.flightMasterApp.showNotification(message, type);
    }
  }

  showLoading(message) {
    const overlay = document.createElement("div");
    overlay.className = "loading-overlay";
    overlay.innerHTML = `
      <div class="bg-base-100 p-6 rounded-lg shadow-xl flex items-center gap-4">
        <div class="loading-spinner"></div>
        <span class="text-lg font-semibold">${message}</span>
      </div>
    `;
    overlay.id = "loading-overlay";
    document.body.appendChild(overlay);
  }

  hideLoading() {
    const overlay = document.getElementById("loading-overlay");
    if (overlay) overlay.remove();
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

    if (window.authSystem && window.authSystem.isAuthenticated()) {
      window.authSystem.addUserBooking(bookingData);
    }
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

        Object.entries(this.tickets).forEach(([key, ticket]) => {
          this.updateTicketDisplay(ticket);
        });

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
    Object.values(this.tickets).forEach((ticket) => {
      ticket.count = 1;
      this.updateTicketDisplay(ticket);
    });

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

    this.selectedFlight = null;

    const resultsContainer = document.getElementById("flightResults");
    if (resultsContainer) {
      resultsContainer.classList.add("hidden");
    }

    this.calculateTotal();
    localStorage.removeItem("flightmaster-draft");
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  trackBookingEvent(event, data) {
    const analyticsData = {
      event,
      ...data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    console.log("Analytics Event:", analyticsData);

    const events = JSON.parse(
      localStorage.getItem("flightmaster-analytics") || "[]"
    );
    events.push(analyticsData);
    localStorage.setItem("flightmaster-analytics", JSON.stringify(events));
  }

  getBookingHistory() {
    const bookings = JSON.parse(
      localStorage.getItem("flightmaster-bookings") || "[]"
    );
    return bookings.filter(
      (booking) =>
        !window.authSystem ||
        (window.authSystem.isAuthenticated() &&
          booking.userId === window.authSystem.getCurrentUser()?.userId)
    );
  }

  cancelBooking(bookingId) {
    const bookings = JSON.parse(
      localStorage.getItem("flightmaster-bookings") || "[]"
    );
    const bookingIndex = bookings.findIndex(
      (booking) => booking.bookingId === bookingId
    );

    if (bookingIndex !== -1) {
      bookings[bookingIndex].status = "cancelled";
      bookings[bookingIndex].cancelledAt = new Date().toISOString();
      localStorage.setItem("flightmaster-bookings", JSON.stringify(bookings));
      return true;
    }

    return false;
  }
}

// Initialize booking system
document.addEventListener("DOMContentLoaded", () => {
  window.bookingSystem = new FlightBookingSystem();
});

export default FlightBookingSystem;
