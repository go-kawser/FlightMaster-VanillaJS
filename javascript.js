 // start function-----------------------------------------------------------------------
 function handleBuyTicket(ticket, isIncrease) {
    const ticketCount = getInputValue(ticket);
    let ticketNewCount = ticketCount;
    if (isIncrease == true) {
        ticketNewCount = ticketCount + 1;
    }
    if (isIncrease == false && ticketCount > 0) {
        ticketNewCount = ticketCount - 1;
    }
    document.getElementById(ticket + '-count').value = ticketNewCount;
    let ticketTotal = 0;
    if (ticket == 'ticket') {
        ticketTotal = ticketNewCount * 150;
    }
    if (ticket == 'low-ticket') {
        ticketTotal = ticketNewCount * 100;
    }
    document.getElementById(ticket + '-total').innerText = 'First Class($150) $' + ticketTotal;
    calculateTotal();
}

function calculateTotal() {
    const ticketCount = getInputValue('ticket');
    const lowTicketCount = getInputValue('low-ticket');
    const totalPrice = ticketCount * 150 + lowTicketCount * 100;
    document.getElementById('total-price').innerText = '$' + totalPrice;
    const vat = Math.round(totalPrice * 0.1);
    document.getElementById('tax-amount').innerText = '$' + vat;
    const grandTotal = totalPrice + vat;
    document.getElementById('grand-total').innerText = '$' + grandTotal;
}

function getInputValue (ticket){
const ticketInput = document.getElementById(ticket + '-count');
const ticketCount = parseInt(ticketInput.value);
return ticketCount;
}

// end function------------------------------------------------------------------------------------



// first class ticket buy now 
// function handleTicketChange(isIncrease) {
//     const ticketInput = document.getElementById('ticket-count');
//     const ticketCount = parseInt(ticketInput.value);
//     let ticketNewCount = ticketCount;
//     if (isIncrease == true) {
//         ticketNewCount = ticketCount + 1;
//     }
//     if (isIncrease == false && ticketCount > 0) {
//         ticketNewCount = ticketCount - 1;
//     }
//     ticketInput.value = ticketNewCount;
//     const totalTicket = ticketNewCount * 150;
//     document.getElementById('ticket-total').innerText = 'First Class($150) $' + totalTicket;
// }
// // economy ticket buy now
// function handleLowTicketChange(isIncrease) {
//     const lowTicketInput = document.getElementById('low-ticket-count');
//     const lowTicketCount = parseInt(lowTicketInput.value);
//     let ticketNewCount = lowTicketCount;
//     if (isIncrease == true) {
//         lowTicketNewCount = lowTicketCount + 1;
//     }
//     if (isIncrease == false && lowTicketCount > 0) {
//         lowTicketNewCount = lowTicketCount - 1;
//     }
//     lowTicketInput.value = lowTicketNewCount;
//     const lowTotalTicket = lowTicketNewCount * 100;
//     document.getElementById('low-ticket-total').innerText = 'First Class($100) $' + lowTotalTicket;
// }