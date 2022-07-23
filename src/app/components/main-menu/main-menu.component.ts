import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  // styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  currentUser: any;
  userRole: any;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userRole = this.currentUser.roles[0];
  }

}
