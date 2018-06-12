import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ThiThuTestPage } from '../thi-thu-test/thi-thu-test';
import { Question } from '../../models/question';
import { Storage } from '@ionic/storage';
import { XemLaiPage } from '../xem-lai/xem-lai';
import { QuestionTestDto } from '../../models/questionTestDto';

@Component({
  selector: 'page-thi-thu',
  templateUrl: 'thi-thu.html',
})
export class ThiThuPage {

  listBaiLam: Array<QuestionTestDto> = [];
  passTest: Array<QuestionTestDto> = [];
  failTest: Array<QuestionTestDto> = [];
  selectedSegment = 'all';
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.storage.get('listBaiLam').then((data) => {
      if (data) {
        this.listBaiLam = data;
        this.listBaiLam.forEach(element => {
          if (element.numberCorrect > 27) {
            this.passTest.push(element);
          } else {
            this.failTest.push(element);
          }
        })
        console.log(data);
        console.log(this.passTest);
        console.log(this.failTest);
      } else {

      }
    });
  }

  ionViewDidLoad() {

  }

  start() {
    this.navCtrl.push(ThiThuTestPage);
  }

  xemLai(questionTestDto: QuestionTestDto) {
    this.navCtrl.push(XemLaiPage, {questionTestDto: questionTestDto, isTest: true});
  }

  onSegmentChanged(segmentButton: any) {
    console.log(segmentButton.value);
    this.selectedSegment = segmentButton.value; //all, read, unread
  }
}
