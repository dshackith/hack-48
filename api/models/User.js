'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    jstor_user: String,
    stats: {
        total_attempts: Number,
        total_correct: Number,
        total_added: Number,
    }
});

var User = mongoose.model('User', UserSchema);

module.exports.User = User;

module.exports.UserSchema = UserSchema;