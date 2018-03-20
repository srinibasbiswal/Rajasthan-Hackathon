var guid = require('guid');

function DB() {
    this.orders = [];
    this.itineraries = [];
}

DB.prototype.createOrder = function(userId) {
    this.orders.push({
        orderId: guid.raw(),
        userId: userId,
        status: 'pending'
    });
}

DB.prototype.getPendingOrders = function() {
    return this.orders.filter(order => order.status == 'pending');
}

DB.prototype.markOrderFulfilled = function(orderId) {
    for (var i = 0; i < this.orders.length; i++) {
        if (this.orders[i].orderId == orderId) {
            this.orders[i].status = 'fulfilled';
            break;
        }
    }
}

DB.prototype.createItinerary = function(userId, itinerary) {
    this.itineraries.push({
        itineraryId: guid.raw(),
        userId: userId,
        itinerary: itinerary,
        paymentStatus: 'pending'
    });
}

DB.prototype.markItineraryPaid = function(itineraryId) {
    for (var i = 0; i < this.itineraries.length; i++) {
        if (this.itineraries[i].itineraryId == itineraryId) {
            this.itineraries[i].status = 'paid';
            break;
        }
    }
}

DB.prototype.getPaidUserItinerary = function(userId) {
    return this.itineraries.filter(itinerary => itinerary.status == 'paid');
}

DB.prototype.getUserItineraries = function(userId) {
    return this.itineraries;
}

module.exports = DB;
