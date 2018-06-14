import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class AuthService {

    private user: Observable<firebase.User>;
    private userDetails: firebase.User = null;
    imageUrl: string;

    constructor(private _firebaseAuth: AngularFireAuth) { 

      this.user = _firebaseAuth.authState;
      this.user.subscribe(
        (user) => {
          if (user) {
            this.userDetails = user;
            this.imageUrl = user.photoURL;
          }
          else {
            this.userDetails = null;
          }
        }
      );
    }

    signInWithFacebook() {
        return this._firebaseAuth.auth.signInWithPopup(
          new firebase.auth.FacebookAuthProvider()
        ).then(function(result){
        });
    }

    signInWithGoogle() {
        return this._firebaseAuth.auth.signInWithPopup(
          new firebase.auth.GoogleAuthProvider()
        ).then(function(result){
        });
    }

    isLoggedIn(): Observable<firebase.User> {
        return this.user;
    }

    get userLogin(): any {
        this.user.subscribe(
            (user) => {
              if (user) {
                this.userDetails = user;
                 return user.photoURL;
              }
            }
        );
        return null;
    }

    logout() {
        this._firebaseAuth.auth.signOut()
        .then((res) => {
        });
    }

}