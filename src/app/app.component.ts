import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication/authentication.service';
import { Router, NavigationError, NavigationEnd, NavigationStart } from '@angular/router';
import User from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'eobrazovanje-client';
  loggedIn = false;
  loggedInUser = { };

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
    ) {

    router.events.subscribe( (event ) => {
      if (event instanceof NavigationStart) {
          // TODO:
          // Show loading indicator
      }
      if (event instanceof NavigationEnd) {
          // TODO:
          // Hide loading indicator

          // check logged in state after any routing event
          this.loggedIn = this.isLoggedIn();
          this.loggedInUser = this.getLoggedInUser();
      }
      if (event instanceof NavigationError) {
          // TODO:
          // Hide loading indicator
      }
    });
  }

  ngOnInit() {
    this.loggedIn = this.isLoggedIn();
    if (!this.loggedIn) {
      this.router.navigate(['/login']);
    }
    this.loggedInUser = this.getLoggedInUser();
  }

  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  getLoggedInUser(): User {
    return this.authenticationService.getCurrentUser();
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
