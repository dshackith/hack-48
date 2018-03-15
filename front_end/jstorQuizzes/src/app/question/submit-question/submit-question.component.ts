import * as _ from 'underscore';
import { Component, OnInit } from '@angular/core';
import { QuestionApiService } from '../../question-api.service';
import { FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-submit-question',
  templateUrl: './submit-question.component.html',
  styleUrls: ['./submit-question.component.css']
})
export class SubmitQuestionComponent implements OnInit {

  constructor(
    private questionApiService: QuestionApiService
  ) { }

  ngOnInit() {
    this.newQuestion();
    this.addAnswer();
  }

  updateSuccess: any;

  question = {};

  public newQuestion = function() {
    this.question = {
      text: "",
      answers: [],
      sources: [
        {url: "", citation: ""}
      ],
      type: "String"
    }
  }

  public addAnswer = _.debounce(function() {
    this.question.answers.push({text: "", correct: false});
  }, 100);

  public removeAnswer = function(index) {
    this.question.answers.splice(index,1);
  }

  private submitQuestion = function() {
    console.log(this.questionApiService);
    this.questionApiService.submitQuestion(this.question)
    .subscribe(data => {
      this.updateSuccess = data;
      this.newQuestion();
    });
  }

  public log = function(item) {
    console.log(item);
  }

  public selectCorrect = function(i) {
    //this.log(i);
    let ii = 0;
    while (ii < this.question.answers.length) {
      //this.log(ii);
      ii != i ? this.question.answers[ii].correct = false: this.question.answers[i].correct = true;
      ii++;
    }
    //this.question.answers[i].correct = true;
    this.log(this.question.answers);
  }

}
