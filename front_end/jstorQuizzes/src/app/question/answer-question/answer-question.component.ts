import { Component, OnInit } from '@angular/core';
import { QuestionApiService } from '../../question-api.service';
import { FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';
import {AuthenticationService} from "../../services/auth.service";

@Component({
  selector: 'app-answer-question',
  templateUrl: './answer-question.component.html',
  styleUrls: ['./answer-question.component.css']
})
export class AnswerQuestionComponent implements OnInit {

  constructor(
    private questionApiService: QuestionApiService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.getQuestion();

    let authUser = this.authenticationService.getCurrentUser();
    if (authUser) {
      this.currentUser = authUser;
    }

    this.authenticationService.updateCurrentUser.subscribe(user => this.currentUser = user);
  }

  updateSuccess: any;

  question: any;

  currentUser = null;

  previousQuestions = [];

  private getQuestion = function() {
    this.questionApiService.getRandomQuestion(this.previousQuestions)
    .subscribe(data => {
      this.question = data;
      if(data.clearPrevious) {
        this.previousQuestions = [];
      }
      this.previousQuestions.push(data._id)
    });
  }

  public logAnswer = function (a) {
    this.questionApiService.answerQuestion(this.question._id, a)
    .subscribe(data => {
      this.updateSuccess = data;

      if(this.currentUser && this.currentUser.stats) {
        this.currentUser.stats.total_attempts++;
        if (this.currentUser && data.correct) {
          this.currentUser.stats.total_correct++;
        }
      }

      this.getQuestion();
    });

  }

}
