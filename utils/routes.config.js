const UtilsController = require('./controllers/utils.controller');
const ValidationMiddleware = require('../common/middlewares/authorization.validation.middlewares');

exports.routesConfig = function (app) {
    app.post('/api/loginCAS', [
        UtilsController.loginCAS
    ]);

    app.get('/api/redirectJSON', [
        UtilsController.getJSON
    ]);

    app.get('/api/redirectHTML', [
        UtilsController.getHTML
    ]);
};