/**
 * Service: UserAuthService
 * Location: ./src/services/user-auth.services.ts
 * @author Santosh Purja Pun
 */

import { CartService } from './cart.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/storage';

/**
 * @description
 * Provides Firebase Authentication services. It provides all the services for performing
 * user authentication, new user signup, user validation and other user specific task including
 * change password, change display name, delete account and so on.
 */

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private User$: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private cart: CartService,
    private afStorage: AngularFireStorage
  ) {
    this.User$ = afAuth.authState;
  }

  // ==================================
  // HELPER FUNCTION
  // ==================================

  /**
   * Async function to perform user login
   * @param email email
   * @param password password
   */
  async login(email: string, password: string) {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password).then(
        success => {
          // make sure the localStrage is null for the currently logged in user;
          this.cart.clearLocalStorage();
          this.cart.retriveValueFromLocalStorage();

          // navigate to the dashboard
          this.router.navigate(['/dashboard']);
        }
      );
    } catch (e) {
      return e.message;
    }
  }

  /**
   * Async function to perform user logout
   */
  async logout() {
    await this.afAuth.auth.signOut();

    // clear the localStorage used to hold cart data
    this.cart.clearLocalStorage();
  }

  /**
   * async function to get the current user
   *
   * @returns a promise of user object
   */
  async getCurrentUser(): Promise<firebase.User> {
    return this.User$.pipe(first()).toPromise();
  }

  /**
   * async function to check if the user is logged in or not
   * @returns a promise; true if the user is logged in; otherwise false;
   */
  async isLoggedIn(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  /**
   * async function to check if the current user has verified his/her email
   * @returns a promise; true if the email is verified; otherwise false;
   */
  async isUserVerified(): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (user != null) {
      return user.emailVerified;
    }
    return false;
  }

  // ===========================
  // user management
  // ===========================

  /**
   * Async function to send a password reset link
   * @param email valid email
   */
  async sendPwdResetLink(email) {
    try {
      await this.afAuth.auth.sendPasswordResetEmail(email);
    } catch (e) {
      return e.message;
    }
  }

  /**
   * Async function to change the password for the current logged in user
   * @param old_password current password
   * @param new_password new password
   */
  async updatePassword(old_password, new_password) {
    try {
      const user = await this.getCurrentUser();
      const credentials = firebase.auth.EmailAuthProvider.credential(user.email, old_password);

      await user.reauthenticateWithCredential(credentials)
      .then(() => {
        user.updatePassword(new_password).then(() => {
          // if password is updated successfully then perform logout and navigate to the login page;
          this.logout();
          this.router.navigate(['/login']);
          console.log('password changed successfully');
        });
      });
    } catch (e) {
      return e.message;
    }
  }

  /**
   * Update the curret dispay name
   * @param displayName New display name
   */
  async updateDisplayName(displayName: string) {
    await this.getCurrentUser().then(user => {
      if (user) {
        user.updateProfile({
          displayName
        });
      }
    });
  }

  /**
   * Async function to update the user profile picture
   * @param profilePhoto url of the profile photo
   */
  async updateProfilePhoto(profilePhoto: string) {
    await this.getCurrentUser()
    .then(user => {
        if(user) {
          user.updateProfile({
            photoURL: profilePhoto
          });
        }
    })
    .catch(e => console.log(e.message));
  };

  /**
   * Async function to create a new user account
   * @param email valid email
   * @param password password
   * @param displayName profile name
   */
  async signup(email, password, displayName) {
    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        userCredentials.user.updateProfile({
          displayName
        });
        console.log('account created successfully.');

        userCredentials.user.sendEmailVerification()
        .then(() => {
          console.log('send email verification');
          this.router.navigate(['/verify']);
        }, (error) => {
          console.log('couldn\'t sent verification email');
        });
      });
    } catch (e) {
      return e.message;
    }
  }

  /**
   * Async function to resend a email verification link
   */
  async resendVerfication() {
    try {
      await this.getCurrentUser().then((user) => {
        user.sendEmailVerification();
        console.log('Verification link sent successfully');
      }, (error) => {
        console.log(error.message);
      });
    } catch (e) {
      return e.message;
    }
  }

  async reAuthenticateUser(pwd: string) {
    const user = await this.getCurrentUser();
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, pwd);
    return user.reauthenticateWithCredential(credentials);
  }

  // ===========================
  // DELETE USER ACCOUNT
  // ===========================
  async deleteAccount(pwd: string) {

    const user = await this.getCurrentUser();
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, pwd);
    user.reauthenticateWithCredential(credentials)
    .then(
      () => {
        // delete profile picture if any
        this.afStorage.ref(user.uid).delete();
        user.delete().then(
        () => {
          this.router.navigate(['login']);
          console.log('User account deleted successfully');
        });
      }
    )
    .catch(e => window.alert(e.message));
  }

}
