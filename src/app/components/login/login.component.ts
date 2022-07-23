import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user;
  public wrongUsernameOrPass: boolean;
  private readonly loginPath = `${environment.apiBaseUri}/auth/signup`;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private http: HttpClient
    ) {
    this.user = { };
  }

  ngOnInit() {
  }

  login(): void {
    // var body = {
    //   firstName:'demo',
    //   lastName:'user',
    //   username:'123456',
    //   password:'123456',
    //   role:'ROLE_ADMIN'
    // };
    // this.signin(body);
    this.authenticationService.login(this.user.username, this.user.password).subscribe(
      (loggedIn: boolean) => {
        if (loggedIn) {
          this.router.navigate(['/']);
        }
      }
    );
  }

  signin(body) {
    //  this.http.post(this.loginPath, body)
    //      .subscribe(
    //          res => console.log(res),
    //          error => console.log(error)
    //      )
 }
}

