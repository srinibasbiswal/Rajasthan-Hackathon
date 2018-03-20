var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var DialogflowApp = require('actions-on-google').DialogflowApp;
var DB = require('./db');

var server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());
server.use(express.static('static'));
server.engine('html', require('ejs').renderFile);
server.set('view engine', 'html');

var db = new DB();

server.get('/', function(req, res) {
    res.render('login.html');
});

server.get('/pending-orders', function(req, res) {
    res.render('pendingOrders.html');
});

server.get('/itinerary-list', function(req, res) {
    res.render('itinerary_list.html');
});

server.post('/hook', function (req, res) {
    var app = new DialogflowApp({request: req, response: res});
    var result = req.body.result;

    var userId = req.body.sessionId;
    if (req.body.originalRequest) {
        userId = req.body.originalRequest.data.user.userId;
    }
    console.log(userId + ' requested for ' + result.action);

    if (result.action == '07_distance') {
        db.createOrder(userId);
        db.createItinerary(userId, {cost: '9000'});
        return res.json({
            speech: 'Your travel itinerary will soon be ready. Anything more?',
            displayText: 'Your travel itinerary will soon be ready. Anything more?'
        });
    } else if (result.action == '08_itinerary') {
        if (db.getUserItineraries().length == 0) {
            console.log("no itineraries");
            return res.json({
                speech: 'Your itinerary isn\'t ready yet.',
                displayText: 'Your itinerary isn\'t ready yet.'
            });
        } else if (db.getPaidUserItinerary().length != 0) {
            console.log("paid itinerary");
            var list = app.buildList('Jaipur itinerary');
            app.askWithList('Here is your itinerary', list);
        }
    }
});

var port = process.env.PORT || 8000;
server.listen(port, function () {
    console.log('Server running on port ' + port);
});
