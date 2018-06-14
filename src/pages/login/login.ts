import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, normalizeURL } from 'ionic-angular';
import { AuthService } from '../../app/services/auth-service';
import { HocLuatPage } from '../hoc-luat/hoc-luat';
import { QuestionTestDto } from '../../models/questionTestDto';
import * as firebase from 'firebase/app';
import { Storage } from '@ionic/storage';
import { FirestoreDataService } from '../../app/services/firebase.service';
import { FileTransferObject, FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Question } from '../../models/question';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  listQuestions: Question[] = [];
  listBaiLam: QuestionTestDto[] = [];
  private _someListener: Subscription = new Subscription();
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService, private transfer: FileTransfer,
              public viewCtrl: ViewController, private storage: Storage, public firebaseService: FirestoreDataService,
              private file: File) {
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
  }

  ionViewDidLoad() {
    this.authService.isLoggedIn().subscribe(user => {
      if(user !== null) {
        this.uploadDataToServer(user);
      } else {
      }
    });
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
    .then(res => {
      this.navCtrl.setRoot(HocLuatPage);
    })
    .catch((err) => console.log(err));
  }

  dismiss() {
    this.navCtrl.setRoot(HocLuatPage);
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

  ionViewWillLeave(userDetails: firebase.User) {
    this._someListener.unsubscribe();
  }

  uploadDataToServer(userDetails: firebase.User) {

    this.storage.get('notCorrectQuestions').then(notCor => {
      this._someListener = this.firebaseService.getNotCorrectQuestions(userDetails.email).subscribe(res => {
        if (res.length > 0) {
          if (notCor) { 
            this.firebaseService.updateNotCorrectQuestions(userDetails.email, notCor);
          } else {
            this.storage.set('notCorrectQuestions', res[0]);
          }
        } else {
          if (notCor) { 
            this.firebaseService.createNotCorrectQuestions(userDetails.email, notCor);
          } else {
            this.storage.set('notCorrectQuestions', res[0]);
          }
        }
      });
    });

    this.storage.get('favoriteQuestions').then(favor => {
      this._someListener = this.firebaseService.getFavoriteQuestions(userDetails.email).subscribe(res => {
        if (res.length > 0) {
          if (favor) { 
            this.firebaseService.updateFavoriteQuestions(userDetails.email, favor);
          } else {
            this.storage.set('favoriteQuestions', res[0]);
          }
        } else {
          if (favor) { 
            this.firebaseService.createFavoriteQuestions(userDetails.email, favor);
          } else {
            this.storage.set('favoriteQuestions', res[0]);
          }
        }
      });
    });

    this.storage.get('listBaiLam').then(listBaiLam => {
      if (listBaiLam) {
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
            this.firebaseService.updateListBaiLam(userDetails.email, listBaiLam);
          } else {
            this.firebaseService.createListBaiLam(userDetails.email, listBaiLam);
          }
        });
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

}
