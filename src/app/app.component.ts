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
import { QuestionTestDto } from '../models/questionTestDto';

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

    this.storage.clear();

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
    let notCor: number[];
    let favor: number[];
    let listBaiLam: QuestionTestDto[];
    console.log(this.storage.length);
    if (this.storage != undefined) {
      console.log(1);
      this.storage.forEach((value, key, index) => {
        console.log(key);
        console.log(value);
        console.log(index);
        if (key == 'notCorrectQuestions') {
          notCor = value;
        }
        if (key == 'favoriteQuestions') {
          favor = value;
        }
        if (key == 'listBaiLam') {
          listBaiLam = value;
        }
      }).then(data => {
        this.firebaseService.saveDataUser(userDetails.email, notCor, favor, listBaiLam);
      });
    }
  }

}
