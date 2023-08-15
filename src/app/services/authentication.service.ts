import { Injectable } from '@angular/core';
import {
  Auth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private auth: Auth) {}

  Google() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  Logout() {
    return signOut(this.auth);
  }

  GitHub() {
    return signInWithPopup(this.auth, new GithubAuthProvider());
  }
}
