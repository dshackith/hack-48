'use strict';

var express = require('express');
var request = require('request');
var config = require('./dbConfig');
var _ = require('underscore');
var router = express.Router();
var Question = require('./models/Question').Question;
var User = require('./models/User').User;

function formQuestionObject(q) {
  let result = {
    _id: q._id,
    text: q.text,
    answers: q.answers ? q.answers.map(a => a.text) : null // There _should_ always be answers, but this plays it safe
  }

  return result;
}

// Parameter setup - If the request param is defined with questionID, 
// this function will automatically populate the request with the corresponding Question
router.param('questionID', function(req, res, next, id) {
  Question.findById(id, function(err, doc) {
    if(err) return next(err);
    if(!doc) {
      err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }
  })
    .exec(function(err, doc) {
      req.question = doc;
      console.log(doc);
      return next();
    });
});

// CRUD setup for Questions

// TODO - This API is probably not required, but useful for testing
router.get("/questions/", function(req, res, next) {
  Question.find({})
    .sort({text: -1})
    .exec(function(err, question) {
      if(err) return next(err);
      res.json(question);
    });
});

// View Question
router.get("/questions/:questionID", function(req, res, next) {
  res.json(req.question);
});

// View random Question
router.get("/randomQuestion/", function(req, res, next) {

  Question.aggregate(
    {$sample: {size: 1}}
  )
    .exec(function(err, question) {
      if(err) return next(err);

      if(req.user) {
        req.user.questions.push(
          {
            question_id: question[0]._id,
            status: "asked"
          }
        );

        req.user.update(req.user, function(err, user) {
          if(err) return next(err);
          res.status(200);
          res.json(formQuestionObject(question[0]));
        });
      } else {
        res.json(formQuestionObject(question[0]))
      }

    });

});

// Create new Question
router.post("/questions/", function(req, res, next) {
  var question = new Question(req.body);
  if(req.user) {
    question.contributor = user;
  }

  question.save(function(err, question) {
    if(err) return next(err);
    res.status(200);
    res.json(question);
  });
});

// Update Question
router.put("/questions/:questionID", function(req, res, next) {
  req.question.update(req.body, function(err, question) {
    if(err) return next(err);
    res.status(200);
    res.json(question);
  });
});

// Delete Question
router.delete('/questions/:questionID', function(req, res, next) {
  req.question.remove(function(err) {
    if(err) return next(err);
    res.json({'result': 'success'});
  });
});


// TODO - Temporary
router.get("/users/", function(req, res, next) {
  User.find({})
    .sort({text: -1})
    .exec(function(err, user) {
      if(err) return next(err);
      res.json(user);
    });
});

// Get User
router.get("/users/:userID", function(req, res, next) {
  res.status(200);
  res.json(req.user);
});

// Create new User
router.post("/users/", function(req, res, next) {
  var user = new User(req.body);
  user.save(function(err, user) {
    if(err) return next(err);
    res.status(200);
    res.json(user);
  });
});

// Update User
router.put("/users/:userID", function(req, res, next) {
  req.user.update(req.body, function(err, user) {
    if(err) return next(err);
    res.status(200);
    res.json(user);
  });
});

// Get Current User
router.get("/currentUser", function(req, res, next) {
  res.status(200);
  res.json(req.user);
});

// Answer a question
router.post("/answer/:questionID", function(req, res, next) {
  var answerGiven = req.body.answer_given;

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
    question: req.question,
    status: 'answered',
    time_answered: Date.now(),
    correct_answer: correctAnswer,
    correct: correct,
    sources: req.question.sources
  };

  // TODO move user login to session instead of passing an ID
  if(!user) {
    res.status(200);
    res.json(answer);
  }

  // Registered user answering the question
  var user = req.user;

  user.questions.push(answer);

  // Update stats
  if(correct) {
    user.stats.total_correct++;
  }

  user.save(function(err, user) {
    if(err) return next(err);
    res.status(200);
    res.json(answer);
  });
});

// Authentication Request
router.post("/authenticate", function(req, res, next) {
  if(req.user) {
    res.status(200);
    return res.json(user);
  }

  var credentials = req.body;

  var options = {
    uri: config.iacLoginURL + '/api/login',
    method: 'POST',
    json: credentials
  };

  request(options, function(error, response, body) {

      if(error) {
        console.error('Login failed:', error);
        return next(error);
      }

      options = {
        url: config.iacProfileURL + '/search/byUsername?username=' + credentials.username,
        method: 'GET',
        json: true
      };

      // Now get more user information by search
      request(options, function(error, response, body) {

        if(error || !body || !body.size) {
          console.error('Unable to get user profile:', error);
          return next(error);
        }

        var profile = body.results[0];

        // Woohoo - Now create this user inside our app
        var user = new User({
          jstor_username: profile.credentials,
          jstor_id: profile.internalId,
          name: profile.contactName,
          email: profile.contact
        });

        user.save(function(err, user) {
          if(err) return next(err);
          res.status(200);
          res.json(user);
        });
      });
    }
  );
});

// This line is required for use in other files
module.exports = router;
