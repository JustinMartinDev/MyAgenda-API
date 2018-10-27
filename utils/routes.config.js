const UtilsController = require('./controllers/utils.controller');
const PermissionMiddleware = require('../common/middlewares/authorization.permission.middlewares');
const ValidationMiddleware = require('../common/middlewares/authorization.validation.middlewares');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const FREE = config.permissionLevels.NORMAL_USER;

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

    /*
    app.get('/api/redirect', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        AccountController.list
    ]);
    app.get('/accounts/:accountID', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        AccountController.getById
    ]);
    app.patch('/accounts/:accountID', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        AccountController.patchById
    ]);
    app.delete('/accounts/:accountID', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        AccountController.removeById
    ]);*/
};