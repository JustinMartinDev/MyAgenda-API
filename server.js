// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var request = require('request');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 3001;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    //todo logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'welcome to MyAgenda-API!' });
});
// more routes for our API will happen here

router.route('/redirectURL/')
    .get(function(req, res) {
        //console.log(req);
        let url = req.query.url;
        console.log("======== REDIRECT CALL ========\n");
        console.log("target : " + url + "\n");
        request(url, function (error, response, body) {
            if(response && response.statusCode) {
                if (error)
                    res.json([{hasError: true, error: error + " (code: " + response.statusCode + ")"}]);
                res.json([{hasError: false, response: response, message: body}]);
            }
        });
        console.log("======= END =======")
    });

router.route('/redirectJSON/')
    .get(function(req, res) {
        //console.log(req);
        let url = req.query.url;
        console.log("======== REDIRECT CALL ========\n");
        console.log("target : " + url + "\n");
        request(url, function (error, response, body) {
            if(response && response.statusCode) {
                if (error)
                    res.json([{hasError: true, error: error + " (code: " + response.statusCode + ")"}]);
                res.json([{hasError: false, response: response, message: JSON.parse(body)}]);
            }
        });
        console.log("======= END =======")
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('API started on : ' + port);