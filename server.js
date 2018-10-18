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

router.route('/login/')
    .post(function(req, res) {
        //console.log(req);
        let param = req.query;
        console.log("======== LOGIN CALL ========\n");
        console.log("target : " + param.url + "\n");

        var j = request.jar();
        request.get(param.url, {jar : j}, function (error, response, body) {
            if(response && response.statusCode) {
                if (error || response.statusCode!==200)
                    res.json([{error: "failed_load_url", message: "Nous n'avons pas pu accéder à cet URL (code : " + response.statusCode + ")"}]);
                else
                    loginHTML(param, j, body);
            }
        });
        console.log("======= END =======")
    });

function loginHTML(param, cookie, body) {
    let ltInput = body.getElementByName("lt");
    var lt ="";
    if(ltInput.value != null)
        lt = ltInput.value;

    let executionInput = body.getElementByName("execution");
    var execution = "e1s1";
    if (executionInput.value != null)
        execution = executionInput.value;

    const params = {
        "_eventId": "submit",
        "lt": lt,
        "submit": "LOGIN",
        "username" : param.username,
        "password" : param.password,
        "execution": execution
    };

    request.post(param, {
        form: params,
        jar : j
        }, function (error, response, body) {
            if(response && response.statusCode) {
                if (error || response.statusCode!==200)
                    res.json([{error: "failed_load_url", message: "Nous n'avons pas pu accéder à cet URL (code : " + response.statusCode + ")"}]);
                else
                    res.json([{cookie: j.getCookieString(param), isLoged: true}]);
            }
    });
}
router.route('/redirectJSON/')
    .get(function(req, res) {
        //console.log(req);
        let url = req.query.url;
        console.log("======== REDIRECT CALL ========\n");
        console.log("target : " + url + "\n");
        request(url, function (error, response, body) {
            if(response && response.statusCode) {
                console.log(error);
                console.log(response.statusCode);
                if (error || response.statusCode!==200)
                    res.json([{error: "failed_load_url", message: "Nous n'avons pas pu accéder à cet URL (code : " + response.statusCode + ")"}]);
                else
                    res.json([{message: JSON.parse(body)}]);
            }
        });
        console.log("======= END =======");
    });

router.route('/redirectJSON/')
    .get(function(req, res) {
        //console.log(req);
        let url = req.query.url;
        console.log("======== REDIRECT CALL ========\n");
        console.log("target : " + url + "\n");
        request(url, function (error, response, body) {
            if(response && response.statusCode) {
                console.log(error);
                console.log(response.statusCode);
                if (error || response.statusCode!==200)
                    res.json([{error: "failed_load_url", message: "Nous n'avons pas pu accéder à cet URL (code : " + response.statusCode + ")"}]);
                else
                    res.json([{message: JSON.parse(body)}]);
            }
        });
        console.log("======= END =======");
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('API started on : ' + port);