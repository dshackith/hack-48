'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    
    text: String,
    answers: [ {text: String, correct: Boolean, total_attempts: Number, total_correct: Number} ],
    sources: [
        {url: String, citation: String}
    ],
    type: String,
    categories: [],
    contributor: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    stats: {
        total_attempts: Number,
        total_correct: Number
    }

});

var Question = mongoose.model('Question', QuestionSchema);

module.exports.Question = Question;

module.exports.QuestionSchema = QuestionSchema;