const Oauth2Controller = require('./controllers/oauth2.controller');
const VerifyKeyMiddleware = require('./middlewares/verify.oauth2.middlewares');
const AuthValidationMiddleware = require('./middlewares/validation.oauth2.middlewarees');
const config = require('../common/config/env.config');

exports.routesConfig = function (app) {
    app.post('/api/oauth2/insert', [
        Oauth2Controller.insert
    ]);

    app.post('/api/oauth2/login', [
        VerifyKeyMiddleware.hasAuthValidFields,
        VerifyKeyMiddleware.isApiKeyAndAppIdMatch,
        Oauth2Controller.login
    ]);

    app.post('/api/oauth2/refresh', [
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.verifyRefreshBodyField,
        AuthValidationMiddleware.validRefreshNeeded,
        Oauth2Controller.login
    ]);
};