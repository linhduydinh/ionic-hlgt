import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the QuestionsPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-questions-popup',
  templateUrl: 'questions-popup.html',
})
export class QuestionsPopupPage {

  listQuestions: any;
  isTest = false;
  isFinish = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.listQuestions = this.navParams.get('listQuestions');
    this.isTest = this.navParams.get('isTest');
    this.isFinish = this.navParams.get('isFinishTest');
    console.log(this.listQuestions);
    console.log(this.isTest);
    console.log(this.isFinish);
  }

  ionViewDidLoad() {
  }

  chooseQuestionPopup(item: any, index: number) {
    this.viewCtrl.dismiss({item: item, index: index});
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
