import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ExplainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-explain',
  templateUrl: 'explain.html',
})
export class ExplainPage {

  explain: string ;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.explain = this.navParams.get('explain');

  }

  ionViewDidLoad() {

  }

}
