import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SubmitQuestionComponent } from './question/submit-question/submit-question.component';
import { QuestionApiService } from './question-api.service'

import { HttpClientModule, HttpClient, HttpResponse} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AnswerQuestionComponent } from './question/answer-question/answer-question.component';
import { StatsComponent } from './stats/stats.component';


@NgModule({
  declarations: [
    AppComponent,
    SubmitQuestionComponent,
    AnswerQuestionComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    QuestionApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
