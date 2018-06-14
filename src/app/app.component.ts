import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, normalizeURL } from 'ionic-angular';
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
import { File } from '@ionic-native/file';
import { Question } from '../models/question';
import { FileTransferObject, FileTransfer } from '@ionic-native/file-transfer';
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
  listQuestions: Question[] = [];
  listBaiLam: QuestionTestDto[] = [];

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public authService: AuthService, public alertCtrl: AlertController, private storage: Storage,
              public firebaseService: FirestoreDataService, private file: File, private transfer: FileTransfer) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Học Luật', component: HocLuatPage, icon: 'imagehocluat.png' },
      { title: 'Thi Thử', component: ThiThuPage, icon: 'imagethithu.png' },
      { title: 'Hướng Dẫn', component: MeoThiPage, icon: 'imagemeothi.png' }
    ];

    // this.storage.clear();

    this.storage.get('questions').then((data) => {
      if(data) {
        this.listQuestions = data;
      } else {
        this.firebaseService.getQuestions().subscribe(res => {
          if (res) {
            res.forEach(element => {
              this.saveImageToStorage(element);
            });
            this.listQuestions = res;
            this.storage.set('questions', res);
          }
        });
      }
    });

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
      console.log(notCor);
      if (notCor) {
        this.firebaseService.getNotCorrectQuestions(userDetails.email).subscribe(res => {
          console.log(res);
          if (res.length > 0) {
            console.log(res);
            this.firebaseService.updateNotCorrectQuestions(userDetails.email, notCor);
          } else {
            this.firebaseService.createNotCorrectQuestions(userDetails.email, notCor);
          }
        });
      } else {
        this.firebaseService.getNotCorrectQuestions(userDetails.email).subscribe(res => {
          console.log(res);
          if (res.length > 0) {
            this.storage.set('notCorrectQuestions', res[0]);
          }
        });
      }
    });

    this.storage.get('favoriteQuestions').then(favor => {
      console.log(favor);
      if (favor) {
        this.firebaseService.getFavoriteQuestions(userDetails.email).subscribe(res => {
          if (res.length > 0) {
            console.log(res);
            this.firebaseService.updateFavoriteQuestions(userDetails.email, favor);
          } else {
            this.firebaseService.createFavoriteQuestions(userDetails.email, favor);
          }
        });
      } else {
        this.firebaseService.getFavoriteQuestions(userDetails.email).subscribe(res => {
          console.log(res);
          if (res.length > 0) {
            this.storage.set('favoriteQuestions', res[0]);
          }
        });
      }
    });

    this.storage.get('listBaiLam').then(listBaiLam => {
      console.log(listBaiLam);
      if (listBaiLam) {
        this.firebaseService.saveListBaiLam(userDetails.email, listBaiLam);
      } else {
        this.firebaseService.getListBaiLam(userDetails.email).subscribe(res => {
          if (res.length > 0) {
            res.forEach(baiLam => {
              let questionTestDto = new QuestionTestDto();
              let questions: Question[] = [];
              baiLam.qIds.forEach(qId => {
                const question = this.listQuestions.filter(x => x.id == qId)[0];
                question.ans.forEach(ans => {
                  if (baiLam.ans.indexOf(ans.aId) > -1) {
                    ans.click = true;
                  }
                })
                questions.push(question);
              });
              questionTestDto.questions = questions;
              questionTestDto.createDate = baiLam.createDate;
              questionTestDto.index = baiLam.index;
              questionTestDto.numberCorrect = baiLam.numberCorrect;
              questionTestDto.totalQuestion = baiLam.totalQuestion;
              this.listBaiLam.push(questionTestDto);
            });
            this.storage.set('listBaiLam', this.listBaiLam);
          }
        });
      }
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

}
