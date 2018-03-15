'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    jstor_id: String,
    jstor_username: String,
    name: String,
    stats: {
        total_attempts: Number,
        total_correct: Number,
        total_added: Number,
    },
    questions: [
                {
                    answer_order: [Number], // For multiple choice only
                    question_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Question'},
                    status: String,
                    time_asked: {type: Date, default: Date.now},
                    time_answered: Date,
                    answer_given: Number,
                    correct_answer: Number,
                    correct: Boolean
                }
            ]
});

var User = mongoose.model('User', UserSchema);

module.exports.User = User;

module.exports.UserSchema = UserSchema;