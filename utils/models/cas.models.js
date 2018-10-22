class CAS {
    constructor(body, res, param){
        this.body = body;
        this.res = res;
        this.url = param.url;
        this.loginPOSTParam = {
            "_eventId": "submit",
            "lt": "",
            "submit": "LOGIN",
            "username": param.username,
            "password": param.password,
            "execution": "e1s1"
        };
    }

    prepareRequest(){
        // Create virtual windows to use Jquery
        var jsdom = require('jsdom').jsdom;
        var document = jsdom(this.body, {});
        var window = document.defaultView;
        var $ = require('jquery')(window);

        let ltInput = $('input[name="lt"]');

        if (ltInput.val() != null)
            this.loginPOSTParam.lt = ltInput.val();

        let executionInput = $("input[name='execution']");
        if (executionInput.val() != null)
            this.loginPOSTParam.execution = executionInput.val();
    }
    sendRequest(){
        request.post({ url: this.url, form: this.loginPOSTParam }, function (err, response, loginBody) {
            if (response && response.statusCode && !err) {
                this.analyseResponse(loginBody, response);
            } else {
                res.status = 500;
                res.json({
                    error: "login_request_fail",
                    message: "Error during check your login with University server."
                });
            }
        });
    }
    analyseResponse(loginBody, response){
        //Create virtual windows tu use JQuery
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

        if(error){
            this.res.status(401).send({error: error});
        }
        if (!error && success && jsession === "") {
            this.res.status(403).send({message: "Impossible to retrieve your session identifier"});
        } else if (!error && success && jsession !== "") {
            this.res.status(200).send({message: success.html(), session: jsession});
        } else {
            this.res.status(520).send({error: "Unknown error"});
        }
    }
};

module.exports = CAS;