import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {SubmitQuestionComponent} from './question/submit-question/submit-question.component';
import {QuestionApiService} from './question-api.service'
import {AuthenticationService} from './services/auth.service'

import {HttpClientModule, HttpClient, HttpResponse, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AnswerQuestionComponent} from './question/answer-question/answer-question.component';
import {StatsComponent} from './stats/stats.component';
import {LoginComponent} from './login/login.component';
import {AuthInterceptor} from "./auth.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    SubmitQuestionComponent,
    AnswerQuestionComponent,
    StatsComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    QuestionApiService,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
