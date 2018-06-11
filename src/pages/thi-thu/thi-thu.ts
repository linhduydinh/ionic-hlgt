import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { ThiThuTestPage } from '../thi-thu-test/thi-thu-test';
import { Question } from '../../models/question';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-thi-thu',
  templateUrl: 'thi-thu.html',
})
export class ThiThuPage {

  listBaiLam: Array<Question[]> = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
              public menuCtrl: MenuController) {
    this.storage.get('listBaiLam').then((data) => {
      if (data) {
        this.listBaiLam = data;
        console.log(data);
      } else {

      }
    });
  }

  ionViewDidLoad() {

  }

  start() {
    this.navCtrl.push(ThiThuTestPage);
  }

  // openMenu() {
  //   console.log(1);
  //   this.menuCtrl.open();
  // }

}
