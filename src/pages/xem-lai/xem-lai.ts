import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ModalController } from 'ionic-angular';
import { QuestionTestDto } from '../../models/questionTestDto';
import { Question } from '../../models/question';

import { Storage } from '@ionic/storage';
import { QuestionsPopupPage } from '../questions-popup/questions-popup';

@Component({
  selector: 'page-xem-lai',
  templateUrl: 'xem-lai.html',
})
export class XemLaiPage {

  @ViewChild('slides') slides: Slides;
  questionTestDto: QuestionTestDto;
  favoriteQuestions: number[] = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
              public modalCtrl: ModalController) {

    this.questionTestDto = this.navParams.get('questionTestDto');
    console.log(this.questionTestDto);

  }

  ionViewDidLoad() {
  }

  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }

  isFavorite(questionFa: Question) {
    if (questionFa.isFa) {
      questionFa.isFa = false;
    } else {
      questionFa.isFa = true;
    }
    this.updateStorageFavorite(questionFa.id);
  }

  updateStorageFavorite(questionId: any) {
    if (this.favoriteQuestions.filter(x => x == questionId).length >= 1) {
      this.favoriteQuestions = this.favoriteQuestions.filter(x => x != questionId);
    } else {
      this.favoriteQuestions.push(questionId);
    }
    this.storage.set('favoriteQuestions', this.favoriteQuestions);
  }

  openModal(listQuestions: any) {
    let modal = this.modalCtrl.create(QuestionsPopupPage, {listQuestions: listQuestions, isTest: true});
    modal.onDidDismiss((item) => {
      if(item != undefined) {
        this.slides.slideTo(item.index);
      }
    });
    modal.present();
  }

}
