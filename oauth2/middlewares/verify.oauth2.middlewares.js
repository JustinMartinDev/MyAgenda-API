const ApiKeyElem = require('../../oauth2/models/apikey.model.js');
const crypto = require('crypto');

exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];
    if (req.body) {
        if (!req.body.appId) {
            errors.push('Missing appId field');
        }
        if (!req.body.apiKey) {
            errors.push('Missing apiKey field');
        }

        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing appId and apiKey fields'});
    }
};

exports.isApiKeyAndAppIdMatch = (req, res, next) => {
    ApiKeyElem.findByAppId(req.body.appId)
        .then((apiElem)=>{
            if(!apiElem[0]){
                res.status(400).json({error: "Invalid appId"});
            }else{
                let apiKeyField = apiElem[0].apiKey.split('$');
                let salt = apiKeyField[0];
                let hash = crypto.createHmac('sha512', salt).update(req.body.apiKey).digest("base64");

                if (hash === apiKeyField[1]) {
                    req.body = {
                        apiKeyId : apiElem[0]._id,
                        appId : apiElem[0]
                    };
                    console.log(req.body);
                    return next();
                } else {
                    return res.status(400).json({errors: "Invalid appId or apiKey"});
                }
            }
        });
};