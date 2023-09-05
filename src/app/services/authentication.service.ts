import { Injectable } from '@angular/core';
import {
  Auth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private auth: Auth, private router: Router) {}

  Google() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  Logout() {
    this.router.navigate(['/']);
    window.localStorage.removeItem('user');
    return signOut(this.auth);
  }

  GitHub() {
    return signInWithPopup(this.auth, new GithubAuthProvider());
  }
}
