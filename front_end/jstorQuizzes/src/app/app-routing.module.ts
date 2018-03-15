import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubmitQuestionComponent } from './question/submit-question/submit-question.component';
import { AnswerQuestionComponent } from './question/answer-question/answer-question.component';
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
    {path: '', redirectTo: '/answerQuestion', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'submitQuestion', component: SubmitQuestionComponent},
    {path: 'answerQuestion', component: AnswerQuestionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
