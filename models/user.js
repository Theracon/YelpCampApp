var mongoose = require('mongoose'),
    userSchema = new mongoose.Schema({
        username: String,
        password: String,
    }),
    passportLocalMongoose = require('passport-local-mongoose');

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);