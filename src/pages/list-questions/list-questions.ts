import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ModalController, LoadingController, Loading } from 'ionic-angular';
import { FirestoreDataService } from '../../app/services/firebase.service';
import { Question } from '../../models/question';
import { QuestionsPopupPage } from '../questions-popup/questions-popup';

@Component({
  selector: 'page-list-questions',
  templateUrl: 'list-questions.html',
})
export class ListQuestionsPage {

  features: { paginationBulletRender: (index: any, className: any) => string; };
  @ViewChild('slides') slides: Slides;
  pageTitle: string;
  category: any;
  listQuestions: Question[] = [];
  loader: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              private firestoreService: FirestoreDataService, public modalCtrl: ModalController) {
    this.category = navParams.get('item');
    this.pageTitle = this.category.name;


    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    loader.present();



  }

  ionViewDidLoad() {
    console.log(this.category);
    // this.firestoreService.getQuestionsByCategoryId(this.category.id).subscribe(res => {
    //   this.listQuestions = res;
    //   console.log(res);

    // });
    this.firestoreService.getQuestionsByCategoryId(this.category.id).map(res => this.listQuestions).subscribe(res => {
      console.log(this.listQuestions);
        console.log(res);
      this.listQuestions = res.map(re => {
        console.log(this.listQuestions);
        console.log(res);
        return re;
      });
    });
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
    modal.present();
  }

}
