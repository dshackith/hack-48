import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(public authenticationService: AuthenticationService) { }

  currentUser = null;

  ngOnInit() {
    let authUser = this.authenticationService.getCurrentUser();
    if(authUser) {
      this.currentUser = authUser;
    }

    this.authenticationService.updateCurrentUser.subscribe(user => this.currentUser = user);
  }

  logout() {
    this.authenticationService.logout();
  }
}
