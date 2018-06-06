import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ThiThuTestPage } from '../thi-thu-test/thi-thu-test';

/**
 * Generated class for the ThiThuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-thi-thu',
  templateUrl: 'thi-thu.html',
})
export class ThiThuPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ThiThuPage');
  }

  start() {
    this.navCtrl.push(ThiThuTestPage, {
    });
  }

}
