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
    this.addAnswer();
  }

  updateSuccess: any;

  question = {
    text: "",
    answers: [],
    sources: [
        {url: "", citation: ""}
    ],
    type: "String"
  }

  public addAnswer = function() {
    this.question.answers.push({text: "", correct: false});
  }

  public removeAnswer = function(index) {
    this.question.answers.splice(index,1);
  }

  private submitQuestion = function() {
    console.log(this.questionApiService);
    this.questionApiService.submitQuestion(this.question)
    .subscribe(data => this.updateSuccess = data);
  }

}
