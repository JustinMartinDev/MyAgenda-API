const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MyAgenda-API', {useNewUrlParser: true});
const Schema = mongoose.Schema;

const ApiKeySchema = new Schema({
    appId : String,
    apiKey : String
});

ApiKeySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ApiKeySchema.set('toJSON', {
    virtuals: true
});

ApiKeySchema.findById = function (cb) {
    return this.model('ApiKeyTable').find({id: this.id}, cb);
};

const ApiKeyElem = mongoose.model('ApiKeyTable', ApiKeySchema);

exports.findByAppId = (appId) => {
    return ApiKeyElem.find({appId: appId});
};
exports.createApiAccess = (apiData) => {
    const apiElem = new ApiKeyElem(apiData);
    return apiElem.save();
};