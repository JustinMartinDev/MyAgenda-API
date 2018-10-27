var request = require("request");
const CAS = require("../models/cas.models");

exports.loginCAS = (req, res) => {
    console.log(req.body);
    request.get(req.body.url, function (error, response, body) {
        if (response && response.statusCode) {
            if (error || response.statusCode !== 200) {
                res.status(response.statusCode).json({error: "Nous n'avons pas pu accéder à cet URL (code : " + response.statusCode + ")"});
            }
            else {
                var casProcess = new CAS(body, res, req.body);
                casProcess.prepareRequest();
                casProcess.sendRequest();
            }
        }
    });
};

exports.getJSON = (req, res) => {
    const option = {
        url : req.query.url,
        method : 'GET'
    };
    request(option, function (error, response, body) {
        if (response && response.statusCode) {
            console.log(response.statusCode);
            if (error || response.statusCode !== 200) {
                res.status(response.statusCode).send({error: "Nous n'avons pas pu accéder à cet URL (code : " + response.statusCode + ")"});
            }
            else {
                try {
                    res.status(200).send({message: JSON.parse(body)});
                } catch (e) {
                    res.status(406).send({error: "Le fichier n'est pas convertible en JSON"})
                }
            }
        }
    });
};

exports.getHTML = (req, res) => {
    console.log("======== REDIRECT CALL ========\n");
    console.log("target : " + url + "\n");
    request(req.query.url, function (error, response, body) {
        if (response && response.statusCode) {
            if (error || response.statusCode !== 200)
                res.status(404).send({ error: "Nous n'avons pas pu accéder à cet URL (code : " + response.statusCode + ")" });
            else
                res.status(200).send({message: body});
        }
    });
    console.log("======= END =======");
};

/*
function loginHTML(param, urlLogin, res, body) {
    var lt = "";
    var execution = "e1s1";

    var jsdom = require('jsdom').jsdom;
    var document = jsdom(body, {});
    var window = document.defaultView;
    var $ = require('jquery')(window);

    let ltInput = $('input[name="lt"]');

    if (ltInput.val() != null)
        lt = ltInput.val();

    let executionInput = $("input[name='execution']");
    if (executionInput.val() != null)
        execution = executionInput.val();

    const newParams = {
        "_eventId": "submit",
        "lt": lt,
        "submit": "LOGIN",
        "username": param.username,
        "password": param.password,
        "execution": execution
    };

    request.post({ url: param.url, form: newParams }, function (err, response, loginBody) {
        if (response && response.statusCode && !err) {
            var jsdom = require('jsdom').jsdom;
            var document = jsdom(loginBody, {});
            var window = document.defaultView;
            var $ = require('jquery')(window);

            var error = $('.errors');
            var success = $('.success');

            var cookies = response.headers['set-cookie'][0];
            var jsession = "";
            if (cookies) {
                var matchJSession = cookies.match(/JSESSIONID=(.*)/);
                if (matchJSession.length > 1) {
                    jsession = matchJSession[1].split(';')[0];
                }
            }

            if (!error && success && jsssion == "") {
                res.json({
                    success: false,
                    message: "Impossible to retrieve your session identifier"
                });
            } else if (!error && sucess && jsession != "") {
                res.json({
                    success: true,
                    message: success.innerHTML,
                    session: jsession
                });
            } else {
                res.json({
                    success: false,
                    message: "Unknown error"
                });
            }
        } else {
            res.status = 500;
            res.json({
                error: "login_request_fail",
                message: "Error during check your login with University server."
            });
        }
    });
    */