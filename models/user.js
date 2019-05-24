
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//var mongooseUniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt-nodejs');
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

//userSchema.plugin(mongooseUniqueValidator);
//already handled by passport
module.exports = mongoose.model('User', userSchema);