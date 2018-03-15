import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../services/auth.service";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService) { }

  currentUser = {
    stats: {
      total_attempts: 0,
      total_correct: 0
    }
  };

  ngOnInit() {
    let authUser = this.authenticationService.getCurrentUser();
    if(authUser) {
      this.currentUser = authUser;
    }

    this.authenticationService.updateCurrentUser.subscribe(user => this.currentUser = user);
  }

}
