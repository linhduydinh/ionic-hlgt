import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, normalizeURL } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ThiThuPage } from '../pages/thi-thu/thi-thu';
import { HocLuatPage } from '../pages/hoc-luat/hoc-luat';
import { LoginPage } from '../pages/login/login';
import { AuthService } from './services/auth-service';
import { FirestoreDataService } from './services/firebase.service';
import { Storage } from '@ionic/storage';
import { Question } from '../models/question';
import { FileTransferObject, FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
// import { MeoThiPage } from '../pages/meo-thi/meo-thi';


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
              public authService: AuthService, public alertCtrl: AlertController,
            private firestoreService: FirestoreDataService, private storage: Storage,
            private transfer: FileTransfer, private file: File) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Học Luật', component: HocLuatPage, icon: 'imagehocluat.png' },
      { title: 'Thi Thử', component: ThiThuPage, icon: 'imagethithu.png' },
      //{ title: 'Hướng Dẫn', component: MeoThiPage, icon: 'imagemeothi.png' }
    ];

    this.authService.isLoggedIn().subscribe(user => {
      if(user !== null) {
        this.isLoggedIn = true;
        this.accountPhoto = user.photoURL;
      } else {
        this.isLoggedIn = false
      }
    });


  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.firestoreService.getQuestions().subscribe(res => {
        if (res) {
          res.forEach(element => {
            this.saveImageToStorage(element);
          })
          this.storage.set('questions', res);
        }
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();


    });
  }

  saveImageToStorage(question: Question) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    if (question.img != undefined && question.img != null) {
      fileTransfer.download(question.img, this.file.dataDirectory +'/'+ + question.id + '.jpg').then((entry) => {
        question.img = normalizeURL(entry.toURL());
      }, (error) => {
        console.log(error);
      });
    }
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

}
