import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../app/services/auth-service';
import { HocLuatPage } from '../hoc-luat/hoc-luat';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService,
              public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {

  }

  signInWithFacebook() {
    this.authService.signInWithFacebook()
    .then((res) => { 
      this.navCtrl.setRoot(HocLuatPage);
    })
    .catch((err) => console.log(err));
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
    .then((res) => { 
      this.navCtrl.setRoot(HocLuatPage);
    })
    .catch((err) => console.log(err));
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
