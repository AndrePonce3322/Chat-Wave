import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ShareUserDataService } from 'src/app/services/shareuserdata.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  userData = {
    img: null as string | null | undefined,
    email: null as string | null | undefined,
    name: null as string | null | undefined,
  };

  menu = false;
  showOptions() {
    this.menu = !this.menu;
  }

  constructor(
    private authentication: AuthenticationService,
    private router: Router,
    private shareUserData: ShareUserDataService
  ) {}

  ngOnInit(): void {
    this.shareUserData.CurrentUser.subscribe((val) => {
      this.userData = {
        img: val.img,
        email: val.email,
        name: val.name,
      };
    });

    // If user is logged in, get user data from local storage
    if (window.localStorage.getItem('user')) {
      const info = JSON.parse(window.localStorage.getItem('user')!);
      this.userData = {
        email: info.email,
        name: info.name,
        img: info.img,
      };
    }
  }

  LogOut() {
    // Deleting user data from local storage
    window.localStorage.removeItem('user');
    this.authentication.Logout();
    this.router.navigate(['/']);
    this.userData = {
      img: null,
      email: null,
      name: null,
    };
  }

  GoToChat() {
    try {
      if (this.userData.email) {
        this.router.navigate(['/chat']);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
