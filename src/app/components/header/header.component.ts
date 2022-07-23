import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import User from 'src/app/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() logoutEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() loggedIn: boolean;
  @Input() loggedInUser: User;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  logout() {
    this.logoutEvent.emit();
  }

  toHomePage() {
    this.router.navigate(['']);
  }

}
