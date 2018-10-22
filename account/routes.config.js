const AccountController = require('./controllers/accounts.controller');
const PermissionMiddleware = require('../common/middlewares/authorization.permission.middlewares');
const ValidationMiddleware = require('../common/middlewares/authorization.validation.middlewares');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const FREE = config.permissionLevels.NORMAL_USER;

exports.routesConfig = function (app) {
    app.post('/api/accounts', [
        AccountController.insert
    ]);
    app.get('/api/accounts', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        AccountController.list
    ]);
    app.get('/api/accounts/:accountID', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        AccountController.getById
    ]);
    app.patch('/api/accounts/:accountID', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        AccountController.patchById
    ]);
    app.delete('/api/accounts/:accountID', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        AccountController.removeById
    ]);
};