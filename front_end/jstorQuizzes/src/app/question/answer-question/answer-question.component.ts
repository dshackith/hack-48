import { Component, OnInit } from '@angular/core';
import { QuestionApiService } from '../../question-api.service';
import { FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-answer-question',
  templateUrl: './answer-question.component.html',
  styleUrls: ['./answer-question.component.css']
})
export class AnswerQuestionComponent implements OnInit {

  constructor(
    private questionApiService: QuestionApiService
  ) { }

  ngOnInit() {
    this.getQuestion();
  }

  updateSuccess: any;

  question: any;

  private getQuestion = function() {
    console.log(this.questionApiService);
    this.questionApiService.getRandomQuestion()
    .subscribe(data => this.question = data);
  }

  public logAnswer = function (a) {
    console.log(a);
  }

}
