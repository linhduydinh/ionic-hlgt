import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ModalController, LoadingController, Loading, ViewController, normalizeURL, PopoverController } from 'ionic-angular';
import { FirestoreDataService } from '../../app/services/firebase.service';
import { Question } from '../../models/question';
import { QuestionsPopupPage } from '../questions-popup/questions-popup';
import { Storage } from '@ionic/storage';
import {File, DirectoryEntry, FileEntry} from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { ExplainPage } from '../explain/explain';

@Component({
  selector: 'page-list-questions',
  templateUrl: 'list-questions.html',
})
export class ListQuestionsPage {

  features: { paginationBulletRender: (index: any, className: any) => string; };
  @ViewChild('slides') slides: Slides;
  pageTitle: string;
  category: any;
  questions: Question[] = [];
  listQuestions: Question[] = [];
  loader: Loading;
  answerClick = false;
  favoriteQuestions: number[] = [];
  notCorrectQuestions: any[] = [];
  showEmpty = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              private firestoreService: FirestoreDataService, public modalCtrl: ModalController, private transfer: FileTransfer,
              private storage: Storage, public viewCtrl: ViewController, private file: File, public popoverCtrl: PopoverController) {

    this.category = navParams.get('item');
    this.pageTitle = this.category.name;

    const loader = this.loadingCtrl.create({
      content: "Vui lòng đợi...",
      dismissOnPageChange: true
    });
    loader.present();

    // this.storage.clear();

    this.storage.get('questions').then((data) => {
      if (data) {
        if (this.category.id == 1) {
          this.storage.get('notCorrectQuestions').then(notCor => {
            if (notCor) {
              this.notCorrectQuestions = notCor;
              var countedNotCor = [];
              this.notCorrectQuestions.forEach(function(i) { countedNotCor[i] = (countedNotCor[i]||0) + 1;});
              let index = 0;
              for (var element in countedNotCor) {
                if (index == 10) continue;
                if (countedNotCor[element] >= 1) {
                  index++;
                  this.listQuestions.push(data.filter(x => x.id == String(element))[0])
                }
              }
              this.storage.get('favoriteQuestions').then(favor => {
                if (favor) {
                  this.favoriteQuestions = favor;
                  favor.forEach(element => {
                    if (this.listQuestions.filter(x => x.id == String(element))[0]){
                      this.listQuestions.filter(x => x.id == String(element))[0].isFa = true;
                    }
                  })
                }
              });
            } else {
              this.showEmpty = true;
            }
          });
        } 
        else if (this.category.id == 2) {
          this.storage.get('notCorrectQuestions').then(notCor => {
            if (notCor) {
              this.notCorrectQuestions = notCor;
            }
          });
          this.storage.get('favoriteQuestions').then(favor => {
            if (favor) {
              this.favoriteQuestions = favor;
              favor.forEach(element => {
                let question = data.filter(x => x.id == String(element))[0];
                if(question) {
                  question.isFa = true;
                  this.listQuestions.push(question);
                }
              })
            } else {
              this.showEmpty = true;
            }
          });

        } else {
          this.listQuestions = data.filter(x => x.cId == String(this.category.id));
          this.storage.get('notCorrectQuestions').then(notCor => {
            if (notCor) {
              this.notCorrectQuestions = notCor;
            }
          });
          this.storage.get('favoriteQuestions').then(favor => {
            if (favor) {
              this.favoriteQuestions = favor;
              favor.forEach(element => {
                if (this.listQuestions.filter(x => x.id == String(element))[0]){
                  this.listQuestions.filter(x => x.id == String(element))[0].isFa = true;
                }
              })
            }
          });
        }
      } else {
        this.firestoreService.getQuestions().subscribe(res => {
          if (res) {
            res.forEach(element => {
              this.saveImageToStorage(element);
            })
            this.storage.set('questions', res);
            this.listQuestions = res.filter(x => x.cId == String(this.category.id));
            if (this.listQuestions.length == 0) {
              this.showEmpty = true;
            }
          }
        });
      }
    });

  }

  ionViewDidLoad() {
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

  getImageInStorage(question: Question) {
    if (question.img != undefined && question.img != null) {
      this.file.resolveDirectoryUrl(this.file.dataDirectory)
        .then((directoryEntry: DirectoryEntry) => {
          this.file.getFile(directoryEntry, question.id + '.jpg', { create: false })
            .then((fileEntry: FileEntry) => {
              if (fileEntry != undefined && fileEntry != null) {
                question.img = normalizeURL(fileEntry.nativeURL);
              } 
            });
      });
    }
  }

  clickAnswer(answer: any, answerClick: boolean, isCompleted: boolean) {
    if (!isCompleted) {
      this.answerClick = !answerClick;
      let currentIndex = this.slides.getActiveIndex();
      const slide = this.slides._slides[currentIndex];
      let ans = slide.getElementsByClassName(String(answer.aId))[0];
      if (answer.click === undefined) {
        answer.click = answerClick;
        ans.getElementsByTagName('span')[0].className += ' selected';
      } else {
        if (answer.click) {
          answer.click = !answer.click
          ans.getElementsByTagName('span')[0].classList.remove('selected');
        } else {
          answer.click = !answer.click
          ans.getElementsByTagName('span')[0].className += ' selected';
        }
      }
    }
  }

  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }

  completed(questionCom: Question) {
    if (!questionCom.completed) {
      let currentIndex = this.slides.getActiveIndex();
      const slide = this.slides._slides[currentIndex];
      let isCorrect = true;
      questionCom.isCor = true;
      questionCom.ans.forEach(element => {
        if (element.isCor) {
          if (!element.click) {
            isCorrect = false;
            questionCom.isCor = false;
          }
          let answer = slide.getElementsByClassName(String(element.aId))[0];
          answer.getElementsByClassName('item-inner')[0].className += ' completed';
        }
      });
      slide.getElementsByClassName('ion-md-checkmark')[0].className += ' disabled';
      if (!isCorrect) {
        this.notCorrectQuestions.push(questionCom.id);
        this.storage.set('notCorrectQuestions', this.notCorrectQuestions);
      }
    }
    questionCom.completed = true;
  }

  isFavorite(questionFa: Question) {
    if (questionFa.isFa) {
      questionFa.isFa = false;
    } else {
      questionFa.isFa = true;
    }
    this.updateStorageFavorite(questionFa.id);
  }

  openModal(listQuestions: any) {
    let modal = this.modalCtrl.create(QuestionsPopupPage, {listQuestions: listQuestions});
    modal.onDidDismiss((item) => {
      if(item != undefined) {
        this.slides.slideTo(item.index);
      }
    });
    modal.present();
  }

  presentPopover(myEvent, question: Question) {
    let popover = this.popoverCtrl.create(ExplainPage, {title: 'Giải Thích', content: question.expl});
    popover.present({
      ev: myEvent
    });
  }

  updateStorageFavorite(questionId: any) {
    if (this.favoriteQuestions.filter(x => x == questionId).length >= 1) {
      this.favoriteQuestions = this.favoriteQuestions.filter(x => x != questionId);
    } else {
      this.favoriteQuestions.push(questionId);
    }
    this.storage.set('favoriteQuestions', this.favoriteQuestions);
  }

}
