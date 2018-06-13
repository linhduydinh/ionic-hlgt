import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, MenuController, App } from 'ionic-angular';
import { QuestionTestDto } from '../../models/questionTestDto';
import { ThiThuPage } from '../thi-thu/thi-thu';
import { ThiThuTestPage } from '../thi-thu-test/thi-thu-test';
import { XemLaiPage } from '../xem-lai/xem-lai';
import { HocLuatPage } from '../hoc-luat/hoc-luat';

@Component({
  selector: 'page-ket-thuc',
  templateUrl: 'ket-thuc.html',
})
export class KetThucPage {

  questionTestDto: QuestionTestDto;
  isPass = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public appCtrl: App, public viewCtrl: ViewController) {

    this.questionTestDto = this.navParams.get('questionTestDto');
    this.isPass = this.questionTestDto.totalQuestion == this.questionTestDto.numberCorrect;

  }

  ionViewDidLoad() {
  }

  review() {
    this.navCtrl.push(XemLaiPage, {questionTestDto: this.questionTestDto, isTest: true});
  }

  newTest() {
    this.navCtrl.popAll().then(() => {
      this.navCtrl.setRoot(ThiThuPage).then(() => {
        this.navCtrl.push(ThiThuTestPage);
      });
    });
  }

  back() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().setRoot(ThiThuPage);
  }

}
