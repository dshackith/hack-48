import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map'
import {environment} from "../../environments/environment";

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) {
  }

  @Output() updateCurrentUser: EventEmitter<any> = new EventEmitter();

  currentUser = null;

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiAddress}/authenticate`, {username: username, password: password})
      .map(user => {
        // login successful if there's a jwt token in the response
        if (user && user._id) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));

          this.currentUser = user;
          this.populateStats();

          this.updateCurrentUser.emit(user);
        }

        return user;
      });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.updateCurrentUser.emit(null);
  }

  getCurrentUser() {
    if(this.currentUser) {
      return this.currentUser;
    }
    if(localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

      this.populateStats();

      // Try to load the latest data for this user
      this.http.get<any>(`${environment.apiAddress}/currentUser`)
        .subscribe(user => {
          // login successful if there's a jwt token in the response
          if (user && user._id) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));

            this.currentUser = user;

            this.populateStats();

            this.updateCurrentUser.emit(user);
          }

          return user;
        });

      return this.currentUser;
    }

    return false;
  }

  populateStats() {
    if (this.currentUser && !this.currentUser.stats) {
      this.currentUser.stats = {
        total_attempts: 0,
        total_correct: 0,
      };
    }
  }
}