import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpResponse} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';

@Injectable()
export class QuestionApiService {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute) { }

  public submitQuestion = function (question) {
    return this.http.post(`${environment.apiAddress}/questions/`, question)
    .map((res:HttpResponse <any>) => res);
  }

  public getRandomQuestion = function (question) {
    return this.http.get(`${environment.apiAddress}/randomQuestion/`)
    .map((res:HttpResponse <any>) => res);
  }


}
