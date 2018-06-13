import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-huong-dan',
  templateUrl: 'huong-dan.html',
})
export class HuongDanPage {

  pageTitle: string;
  category: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.category = navParams.get('item');
    this.pageTitle = this.category.name;

  }

  ionViewDidLoad() {

  }

}
