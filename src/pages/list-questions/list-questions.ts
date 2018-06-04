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
        this.listQuestions = data.filter(x => x.cId == String(this.category.id));
        console.log('Your age is', data);
      } else {
        this.firestoreService.getQuestions().subscribe(res => {
          this.questions = res;
          // set a key/value
          this.storage.set('questions', this.questions);
          this.listQuestions = this.questions.filter(x => x.cId == String(this.category.id));
          console.log(res);
    
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

  openModal(listQuestions: any) {
    console.log(listQuestions);
    let modal = this.modalCtrl.create(QuestionsPopupPage, {listQuestions: listQuestions});
    modal.onDidDismiss((item, index) => {
      console.log(item);
      console.log(item.index);
      this.slides.slideTo(item.index);
    });
    modal.present();
  }

}
