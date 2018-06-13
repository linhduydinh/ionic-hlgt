import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ThiThuPage } from '../pages/thi-thu/thi-thu';
import { HocLuatPage } from '../pages/hoc-luat/hoc-luat';
import { LoginPage } from '../pages/login/login';
import { AuthService } from './services/auth-service';
import { MeoThiPage } from '../pages/meo-thi/meo-thi';
import { Storage } from '@ionic/storage';
import { FirestoreDataService } from './services/firebase.service';
import * as firebase from 'firebase/app';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HocLuatPage;
  isLoggedIn: boolean;
  accountPhoto: string;
  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public authService: AuthService, public alertCtrl: AlertController, private storage: Storage,
              public firebaseService: FirestoreDataService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Học Luật', component: HocLuatPage, icon: 'imagehocluat.png' },
      { title: 'Thi Thử', component: ThiThuPage, icon: 'imagethithu.png' },
      { title: 'Hướng Dẫn', component: MeoThiPage, icon: 'imagemeothi.png' }
    ];

    this.authService.isLoggedIn().subscribe(user => {
      if(user !== null) {
        this.isLoggedIn = true;
        this.accountPhoto = user.photoURL;
        this.uploadDataToServer(user);
      } else {
        this.isLoggedIn = false
      }
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  login() {
    this.nav.setRoot(LoginPage);
  }

  askLogout() {
    const confirm = this.alertCtrl.create({
      title: 'Đăng Xuất',
      message: 'Bạn thật sự muốn đăng xuất?',
      buttons: [
        {
          text: 'Huỷ',
          handler: () => {
          }
        },
        {
          text: 'Đồng Ý',
          handler: () => {
            this.authService.logout();
          }
        }
      ]
    });
    confirm.present();
  }

  uploadDataToServer(userDetails: firebase.User) {
    this.storage.get('notCorrectQuestions').then(notCor => {
      if (notCor) {
        this.firebaseService.addFavoriteQuestions(userDetails.email, notCor);
      }
    });
    this.storage.get('favoriteQuestions').then(favor => {
      if (favor) {
        this.firebaseService.addFavoriteQuestions(userDetails.email, favor);
      }
    });
    this.storage.get('listBaiLam').then(listBaiLam => {
      if (listBaiLam) {
        this.firebaseService.addFavoriteQuestions(userDetails.email, listBaiLam);
      }
    });
  }

}
