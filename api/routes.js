'use strict';

var express = require('express');
var _ = require('underscore');
var router = express.Router();
var Question = require('./models/Question').Question;
var User = require('./models/User').User;

// Parameter setup - If the request param is defined with questionID, 
// this function will automatically populate the request with the corresponding Question
router.param('questionID', function(req,res,next,id){
	Question.findById(id, function(err, doc){
		if(err) return next(err);
		if(!doc) {
			err = new Error('Not Found');
			err.status = 404;
			return next(err);
		}
	})
	.exec(function(err, doc){
		req.question = doc;
		console.log(doc);
		return next();
	});
});

// Parameter setup - For User
router.param('userID', function(req,res,next,id){
	User.findById(id, function(err, doc){
		if(err) return next(err);
		if(!doc) {
			err = new Error('Not Found');
			err.status = 404;
			return next(err);
		}
	})
	.exec(function(err, doc){
		req.user = doc;
		console.log(doc);
		return next();
	});
});

// CRUD setup for Questions

// TODO - This API is probably not required, but useful for testing
router.get("/questions/", function(req, res, next){
	Question.find({})
				.sort({text: -1})
				.exec(function(err, question){
					if(err) return next(err);
					res.json(question);
				});
});

// View Question
router.get("/questions/:questionID", function(req, res, next){
	res.json(req.question);
});

// View random Question
router.get("/questions/random/", function(req, res, next){
	
	// Paramesh: We might also want the User ID passed in - because we may have to add this question to the "attempted" list.
	
	// From https://stackoverflow.com/questions/39277670/how-to-find-random-record-in-mongoose
	Question.count().exec(function (err, count) {
	
		// Random offset
		let random = Math.floor(Math.random() * count)
		
		Question.findOne()
			.skip(random)
			.sort({text: -1})
			.exec(function(err, question){
				if(err) return next(err);
				res.json(question);
			});
	})
});

// Create new Question
router.post("/questions/", function(req, res, next){
		var question = new Question(req.body);
		question.save(function(err, question){
			if(err) return next(err);
			res.status(200);
			res.json(question);
		});
});

// Update Question
router.put("/questions/:questionID", function(req, res, next){
	req.question.update(req.body, function(err, question){
		if(err) return next(err);
		res.status(200);
		res.json(question);
	});
});

// Delete Question
router.delete('/questions/:questionID', function(req, res, next){
	req.question.remove(function(err){
		if(err) return next(err);
		res.json({'result': 'success'});
	});
});


// TODO - Temporary
router.get("/users/", function(req, res, next){
	User.find({})
				.sort({text: -1})
				.exec(function(err, user){
					if(err) return next(err);
					res.json(user);
				});
});

// Get User
router.get("/users/:userID", function(req, res, next){
	res.json(req.user);
});

// Create new User
router.post("/users/", function(req, res, next){
		var user = new User(req.body);
		user.save(function(err, user){
			if(err) return next(err);
			res.status(200);
			res.json(user);
		});
});

// Update User
router.put("/users/:userID", function(req, res, next){
	req.user.update(req.body, function(err, user){
		if(err) return next(err);
		res.status(200);
		res.json(user);
	});
});

// Answer a question
router.post("/answer/:questionID/:userID", function(req, res, next){
	console.log(req.body);
	var answerGiven = req.body.answer_given;
	
	var user = req.user;

	// TODO - find if there's an existing answer

	var correctAnswer = 0;
	var correct = false;

	_.each(req.question.answers, function(answer, index) {
		if(answer.correct) {
			correctAnswer = index;
		}
	});

	if(answerGiven == correctAnswer) {
		correct = true;
	}

	var answer = {
		    question_id: req.question,
		    status: 'answered',
		    time_answered: Date.now(),
		    answer_given: answerGiven,
		    correct_answer: correctAnswer,
		    correct: correct
		};

	user.questions.push(answer);

	// Update stats
	if(correct) {
		user.stats.total_correct++;
		user.stats.total_attempts++; // TODO - this logic will move if the answer is already generated on Viewing the question
	}

	user.save(function(err, user){
		if(err) return next(err);
		res.status(200);
		res.json(answer);
	});
});


// This line is required for use in other files
module.exports  = router;
