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
    contributor: q.contributor ? q.contributor.name : '',
    answers: q.answers ? q.answers.map(a => a.text) : null // There _should_ always be answers, but this plays it safe
  };

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
router.post("/randomQuestion/", function(req, res, next) {
  let previousQuestions = req.body;
  if(!previousQuestions) {
    previousQuestions = [];
  }

  Question
    .find({
      _id: {$nin: previousQuestions}
    })
    .limit(1)
    .exec(function(err, question) {
      if(err) return next(err);

      if(!question || !question.length) {
        // Pick some random question
        return Question.findOne().populate('contributor').exec(function(err, question) {
          if(err) return next(err);
          res.status(200);
          let retQuestion = formQuestionObject(question);
          retQuestion.clearPrevious = true;
          return res.json(retQuestion);
        });
      }

      Question.populate(question[0], 'contributor', function() {
        if(req.user) {
          req.user.questions.push(
            {
              question: question[0],
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

});

// Create new Question
router.post("/questions/", function(req, res, next) {
  // Strip out empty answers
  var json = req.body;
  if(json && json.answers) {
    var answers = [];
    _.each(json.answers, function(answer) {
      if(answer && answer.text) {
        answers.push(answer);
      }
    });
    json.answers = answers;
  }
  var question = new Question(json);
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
  let answerGiven = req.body.answer_given;

  // TODO - find if there's an existing answer

  let correctAnswer = 0;
  let correct = false;

  _.each(req.question.answers, function(answer, index) {
    if(answer.correct) {
      correctAnswer = index;
    }
  });

  if(answerGiven == correctAnswer) {
    correct = true;
  }

  // Find the already "asked" question
  let answer = null;
  if(req.user) {
    answer = req.user.questions.find(q => req.question.equals(q.question) && q.status == "asked");
  }

  if(!answer) {
    answer = {
      status: 'answered'
    }
  }

  answer.question = req.question;
  answer.status = 'answered';
  answer.time_answered = Date.now();
  answer.correct_answer= correctAnswer;
  answer.correct = correct;
  answer.sources = req.question.sources;

  let user = req.user;

  if(!user) {
    res.status(200);
    return res.json(answer);
  }

  // Registered user answering the question
  if(!user.stats.total_attempts) {
    user.stats.total_attempts = 0;
  }
  user.stats.total_attempts++;

  // Update stats
  if(correct) {
    if(!user.stats.total_correct) {
      user.stats.total_correct = 0;
    }
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

  let credentials = req.body;

  let options = {
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

        let profile = body.results[0];

        // Check if there is an existing user
        User.findOne({'jstor_id': profile.internalId})
          .exec(function(err, user) {
            if(err) return next(err);

            if(user && user._id) {
              // Exists
              res.status(200);
              return res.json(user);
            } else {
              // Create one
              let user = new User({
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
            }
          });

      });
    }
  );
});

// This line is required for use in other files
module.exports = router;
