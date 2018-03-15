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

  private getQuestion = function() {
    this.questionApiService.getRandomQuestion()
    .subscribe(data => this.question = data);
  }

  public logAnswer = function (a) {
    this.questionApiService.answerQuestion(this.question._id, a)
    .subscribe(data => {
      this.updateSuccess = data;

      this.currentUser.stats.total_attempts++;
      if (this.currentUser && data.correct) {
        this.currentUser.stats.total_correct++;
      }

      this.getQuestion();
    });

  }

}
