import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ModalController, LoadingController, Loading, ViewController } from 'ionic-angular';
import { FirestoreDataService } from '../../app/services/firebase.service';
import { Question } from '../../models/question';
import { QuestionsPopupPage } from '../questions-popup/questions-popup';
import { Storage } from '@ionic/storage';

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
  favoClick = false;
  isFavor = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              private firestoreService: FirestoreDataService, public modalCtrl: ModalController, 
              private storage: Storage, public viewCtrl: ViewController) {
    this.category = navParams.get('item');
    this.pageTitle = this.category.name;


    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    loader.present();

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
                this.listQuestions.push(data.filter(x => x.id == String(element))[0])
              })
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
          this.questions = res;
          this.listQuestions = this.questions.filter(x => x.cId == String(this.category.id));
        });
      }
    });

  }

  ionViewDidLoad() {
  }

  clickAnswer(answer: any, answerClick: boolean) {
    this.answerClick = !answerClick;
    let currentIndex = this.slides.getActiveIndex();
    const slide = this.slides._slides[currentIndex];
    if (answer.click === undefined) {
      answer.click = answerClick;
      slide.getElementsByClassName(String(answer.aId))[0].className += ' selected';
    } else {
      if (answer.click) {
        answer.click = !answer.click
        slide.getElementsByClassName(String(answer.aId))[0].classList.remove('selected');
      } else {
        answer.click = !answer.click
        slide.getElementsByClassName(String(answer.aId))[0].className += ' selected';
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
    let currentIndex = this.slides.getActiveIndex();
    const slide = this.slides._slides[currentIndex];
    let isCorrect = true;
    questionCom.ans.forEach(element => {
      if (element.isCor) {
        if (!element.click) {
          isCorrect = false;
        }
        slide.getElementsByClassName(String(element.aId))[0].className += ' completed';
      }
    });
    if (!isCorrect) {
      this.notCorrectQuestions.push(questionCom.id);
      this.storage.set('notCorrectQuestions', this.notCorrectQuestions);
    }
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
    modal.onDidDismiss((item, index) => {
      this.slides.slideTo(item.index);
    });
    modal.present();
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
