const ApiKeyModel = require('../models/apikey.model.js');
const crypto = require('crypto');
const hat = require('hat');
const cuid = require('cuid');
const jwtSecret = require('../../common/config/env.config.js').jwt_secret,
    jwt = require('jsonwebtoken');

exports.insert = (req, res) => {
    let apiKey = hat();
    let appId = ("API_ID_"+cuid()).toUpperCase();

    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(apiKey).digest("base64");

    let content = {
        appId:  appId,
        apiKey: hash
    };

    ApiKeyModel.createApiAccess(content)
        .then(() => {
            res.status(200).json(content);
        });
};

exports.getByAppId = (req, res) => {
    ApiKeyModel.findByAppId(req.params.API_ID)
        .then((result) => {
            res.status(200).json(result);
        });
};

exports.login = (req, res) => {
    try {
        let refreshId = req.body.appId + jwtSecret;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
        req.body.refreshKey = salt;
        let token = jwt.sign(req.body, jwtSecret);
        let b = new Buffer(hash);
        let refresh_token = b.toString('base64');
        res.status(201).json({accessToken: token, refreshToken: refresh_token});
    } catch (err) {
        console.log(err);
        res.status(500).json({errors: err});
    }
};
exports.refresh_token = (req, res) => {
    try {
        req.body = req.jwt;
        let token = jwt.sign(req.body, jwtSecret);
        res.status(200).json({id: token});
    } catch (err) {
        res.status(500).json({errors: err});
    }
};
/*exports.removeById = (req, res) => {
    AccountModel.removeById(req.params.accountID)
        .then((result)=>{
            res.status(204).send({});
        });
};*/