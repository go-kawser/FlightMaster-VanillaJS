// ES6 Class for Flight Booking System
class FlightBookingSystem {
  constructor() {
    this.tickets = {
      firstClass: { count: 1, price: 150, element: "firstClass" },
      economy: { count: 1, price: 100, element: "economy" },
    };
    this.init();
  }

  init() {
    this.bindEvents();
    this.calculateTotal();
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

    // Book now button
    document
      .getElementById("bookNowBtn")
      ?.addEventListener("click", () => this.handleBooking());

    // Form inputs
    ["flyingFrom", "flyingTo", "departureDate", "returnDate"].forEach((id) => {
      document
        .getElementById(id)
        ?.addEventListener("input", () => this.validateForm());
    });
  }

  handleTicketChange = (type, isIncrease) => {
    const ticket = this.tickets[type === "first" ? "firstClass" : "economy"];

    if (isIncrease) {
      ticket.count++;
    } else if (ticket.count > 0) {
      ticket.count--;
    }

    this.updateTicketDisplay(ticket);
    this.calculateTotal();
    this.animateUpdate(ticket.element);
  };

  updateTicketDisplay(ticket) {
    const countElement = document.getElementById(`${ticket.element}Count`);
    const totalElement = document.getElementById(`${ticket.element}Total`);

    if (countElement && totalElement) {
      countElement.textContent = ticket.count;
      totalElement.textContent = `$${ticket.count * ticket.price}`;
    }
  }

  calculateTotal() {
    const subtotal = Object.values(this.tickets).reduce(
      (sum, ticket) => sum + ticket.count * ticket.price,
      0
    );

    const vat = Math.round(subtotal * 0.1);
    const grandTotal = subtotal + vat;

    this.updatePriceDisplay(subtotal, vat, grandTotal);
    this.validateForm();
  }

  updatePriceDisplay(subtotal, vat, grandTotal) {
    const subtotalElement = document.getElementById("subtotalPrice");
    const vatElement = document.getElementById("vatAmount");
    const grandTotalElement = document.getElementById("grandTotal");

    if (subtotalElement) subtotalElement.textContent = `$${subtotal}`;
    if (vatElement) vatElement.textContent = `$${vat}`;
    if (grandTotalElement) grandTotalElement.textContent = `$${grandTotal}`;
  }

  animateUpdate(elementId) {
    const element = document.getElementById(`${elementId}Count`);
    if (element) {
      element.classList.add("scale-125");
      setTimeout(() => element.classList.remove("scale-125"), 300);
    }
  }

  validateForm() {
    const from = document.getElementById("flyingFrom")?.value.trim();
    const to = document.getElementById("flyingTo")?.value.trim();
    const departure = document.getElementById("departureDate")?.value;
    const bookBtn = document.getElementById("bookNowBtn");

    const isValid =
      from &&
      to &&
      departure &&
      Object.values(this.tickets).some((ticket) => ticket.count > 0);

    if (bookBtn) {
      bookBtn.disabled = !isValid;
      bookBtn.classList.toggle("btn-disabled", !isValid);
    }
  }

  handleBooking() {
    const bookingData = {
      from: document.getElementById("flyingFrom")?.value,
      to: document.getElementById("flyingTo")?.value,
      departure: document.getElementById("departureDate")?.value,
      return: document.getElementById("returnDate")?.value,
      tickets: { ...this.tickets },
      total: document.getElementById("grandTotal")?.textContent,
    };

    // Show success animation
    this.showBookingSuccess(bookingData);
  }

  showBookingSuccess(bookingData) {
    const bookBtn = document.getElementById("bookNowBtn");
    const originalText = bookBtn.innerHTML;

    bookBtn.innerHTML = '<i class="fas fa-check"></i> Booked Successfully!';
    bookBtn.classList.remove("btn-primary");
    bookBtn.classList.add("btn-success");

    setTimeout(() => {
      bookBtn.innerHTML = originalText;
      bookBtn.classList.remove("btn-success");
      bookBtn.classList.add("btn-primary");

      // Show confirmation modal
      this.showConfirmationModal(bookingData);
    }, 1500);
  }

  showConfirmationModal(bookingData) {
    // Create and show a confirmation modal
    const modal = document.createElement("div");
    modal.className = "modal modal-open";
    modal.innerHTML = `
            <div class="modal-box">
                <h3 class="font-bold text-lg text-success">Booking Confirmed! 🎉</h3>
                <p class="py-4">Your flight from ${bookingData.from} to ${bookingData.to} has been successfully booked.</p>
                <div class="modal-action">
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Great!</button>
                </div>
            </div>
        `;
    document.body.appendChild(modal);
  }
}

// Initialize the booking system when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new FlightBookingSystem();
});

// Export for module usage
export default FlightBookingSystem;
