import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataBaseService } from 'src/app/services/database.service';
import { ShareUserDataService } from 'src/app/services/shareuserdata.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(
    private authentication: AuthenticationService,
    private router: Router,
    private shareUserData: ShareUserDataService,
    private DataBaseSVC: DataBaseService
  ) {}

  private auth = getAuth();

  showLogInButtons = true;

  ngOnInit(): void {
    if (this.auth.currentUser) {
      const bodyData = {
        _id: this.auth.currentUser.uid,
        email: this.auth.currentUser.email,
        name: this.auth.currentUser.displayName,
        img: this.auth.currentUser.photoURL,
      };

      // Set to the observable and local storage
      this.shareUserData.CurrentUser.next(bodyData);
      window.localStorage.setItem('user', JSON.stringify(bodyData));
      this.router.navigate(['/chat']);
    }
  }

  async LogWithGoogle() {
    if (this.auth.currentUser) {
      const bodyData = {
        _id: this.auth.currentUser.uid,
        email: this.auth.currentUser.email,
        name: this.auth.currentUser.displayName,
        img: this.auth.currentUser.photoURL,
      };
      // Set to the observable and local storage
      this.shareUserData.CurrentUser.next(bodyData);
      window.localStorage.setItem('user', JSON.stringify(bodyData));

      return this.router.navigate(['/chat']);
    }

    return this.authentication.Google().then((val) => {
      const bodyData = {
        email: val.user.email,
        name: val.user.displayName,
        img: val.user.photoURL,
      };

      // Save into database
      this.DataBaseSVC.SendUser(bodyData).subscribe((val) => {
        // Save user data in local storage
        window.localStorage.setItem('user', JSON.stringify(val));
        // Send to observable
        this.shareUserData.CurrentUser.next(val);
        // // Go to the page
        this.router.navigate(['/chat']);
      });
    });
  }

  LogOut() {
    return this.authentication.Logout();
  }
}
