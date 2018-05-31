import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirestoreDataService } from '../../app/services/firebase.service';
import { Question } from '../../models/question';

@Component({
  selector: 'page-list-questions',
  templateUrl: 'list-questions.html',
})
export class ListQuestionsPage {

  pageTitle: string;
  listQuestions: Question[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private firestoreService: FirestoreDataService) {
    let category = navParams.get('item');
    this.pageTitle = category.name;
    console.log(name);
    this.firestoreService.getQuestions().subscribe(res => {
      this.listQuestions = res;
      console.log(res);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListQuestionsPage');
  }

}
