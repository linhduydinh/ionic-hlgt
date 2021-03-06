import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { ThiThuTestPage } from '../thi-thu-test/thi-thu-test';
import { Storage } from '@ionic/storage';
import { XemLaiPage } from '../xem-lai/xem-lai';
import { QuestionTestDto } from '../../models/questionTestDto';
import { ExplainPage } from '../explain/explain';
import { FirestoreDataService } from '../../app/services/firebase.service';

@Component({
  selector: 'page-thi-thu',
  templateUrl: 'thi-thu.html',
})
export class ThiThuPage {

  listBaiLam: Array<QuestionTestDto> = [];
  passTest: Array<QuestionTestDto> = [];
  failTest: Array<QuestionTestDto> = [];
  selectedSegment = 'all';
  helpTextContent: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, 
              public popoverCtrl: PopoverController, public firebaseService: FirestoreDataService) {
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
      } else {

      }
    });

    this.firebaseService.getThiThuHelpText().subscribe(res => {
      this.helpTextContent = res.text;
    })
  }

  ionViewDidLoad() {

  }

  helpText(myEvent) {
    let popover = this.popoverCtrl.create(ExplainPage, {title: 'Thông Tin', content: this.helpTextContent});
    popover.present({
      ev: myEvent
    });
  }

  start() {
    this.navCtrl.push(ThiThuTestPage);
  }

  xemLai(questionTestDto: QuestionTestDto) {
    this.navCtrl.push(XemLaiPage, {questionTestDto: questionTestDto, isTest: true});
  }

  lamLai(questionTestDto: QuestionTestDto) {
    this.navCtrl.push(ThiThuTestPage, {questionTestDto: questionTestDto});
  }

  xoaItem(questionTestDto: QuestionTestDto) {
    this.listBaiLam = this.listBaiLam.filter(x => x.createDate != questionTestDto.createDate);
    this.listBaiLam.forEach(element => {
      this.passTest = [];
      this.failTest = [];
      if (element.numberCorrect > 27) {
        this.passTest.push(element);
      } else {
        this.failTest.push(element);
      }
    })
    this.storage.set('listBaiLam', this.listBaiLam);
  }

  onSegmentChanged(segmentButton: any) {
    this.selectedSegment = segmentButton.value;
  }
}
