const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MyAgenda-API', {useNewUrlParser: true});
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    permissionLevel: Number
});

AccountSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
AccountSchema.set('toJSON', {
    virtuals: true
});

AccountSchema.findById = function (cb) {
    return this.model('Account').find({id: this.id}, cb);
};

const Accounts = mongoose.model('Account', AccountSchema);


exports.findByEmail = (email) => {
    return Accounts.find({email: email});
};
exports.findById = (id) => {
    return Accounts.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createAccount = (userData) => {
    const accounts = new Accounts(userData);
    return accounts.save();
};
exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Accounts.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.patchAccount = (id, userData) => {
    return Accounts.findById(id, function (err, user) {
            if (err) reject(err);
            for (let i in userData) {
                user[i] = userData[i];
            }
            user.save(function (err, updatedUser) {
                if (err) return reject(err);
                resolve(updatedUser);
            });
        });
    };
exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        Accounts.remove({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};