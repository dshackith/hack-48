import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubmitQuestionComponent } from './question/submit-question/submit-question.component';

const routes: Routes = [
  { path: 'submitQuestion', component: SubmitQuestionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
