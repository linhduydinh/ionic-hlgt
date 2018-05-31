import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { FirestoreDataService } from '../../app/services/firebase.service';
import { Question } from '../../models/question';

@Component({
  selector: 'page-list-questions',
  templateUrl: 'list-questions.html',
})
export class ListQuestionsPage {

  features: { paginationBulletRender: (index: any, className: any) => string; };
  @ViewChild('slides') slides: Slides;
  pageTitle: string;
  listQuestions: Question[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private firestoreService: FirestoreDataService) {
    let category = navParams.get('item');
    this.pageTitle = category.name;

    this.firestoreService.getQuestions().subscribe(res => {
      this.listQuestions = res;
      console.log(res);
    //   this.slides.paginationBulletRender = (index, defaultClass) => {
    //     return '<span class="swiper-pagination-bullet swiper-pagination-bullet-active">' + (index + 1) + '</span>';
    //  }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListQuestionsPage');
  }

  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }

}
