import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SubmitQuestionComponent } from './question/submit-question/submit-question.component';
import { QuestionApiService } from './question-api.service'

import { HttpClientModule, HttpClient, HttpResponse} from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    SubmitQuestionComponent
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
