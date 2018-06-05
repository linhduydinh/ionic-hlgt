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
  favoriteQuestions: Question[] = [];
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
        console.log(data);
        if (this.category.id == 1) {
          this.listQuestions = data.filter(x => x.isFa);
          console.log('Your age is', this.listQuestions);
        } else {
          this.listQuestions = data.filter(x => x.cId == String(this.category.id));
          console.log('Your age is', this.listQuestions);
        }
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

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    const slide = this.slides._slides[currentIndex];
    const questionId = slide.getElementsByClassName('questionId')[0].innerHTML;
    let question = this.listQuestions.filter(x => x.id == questionId.toString());
    if (question[0].isFa) {
      
    }
    console.log(question);
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

  completed() {
    let currentIndex = this.slides.getActiveIndex();
    const slide = this.slides._slides[currentIndex];
    const questionId = slide.getElementsByClassName('questionId')[0].innerHTML;
    let question = this.listQuestions.filter(x => x.id == questionId.toString());
    console.log(question);
    question[0].ans.forEach(element => {
      if (element.isCor) {
        slide.getElementsByClassName(String(element.aId))[0].className += ' completed';
      }
    });
  }

  isFavorite(favoClick: boolean) {
    let currentIndex = this.slides.getActiveIndex();
    const slide = this.slides._slides[currentIndex];
    const questionId = slide.getElementsByClassName('questionId')[0].innerHTML;
    let question = this.listQuestions.filter(x => x.id == questionId.toString());
    console.log(question);
    question[0].isFa = true;
    // /    this.favoriteQuestions.push(question[0]);
    if (favoClick) {
      console.log(1);
    } else {
      console.log(10);
    }
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
