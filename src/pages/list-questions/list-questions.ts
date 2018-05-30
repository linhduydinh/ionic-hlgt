import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-list-questions',
  templateUrl: 'list-questions.html',
})
export class ListQuestionsPage {

  pageTitle: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    let category = navParams.get('item');
    this.pageTitle = category.name;
    console.log(name);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListQuestionsPage');
  }

}
