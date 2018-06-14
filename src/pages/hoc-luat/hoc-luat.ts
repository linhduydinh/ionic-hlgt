import { Component } from '@angular/core';
import { NavController, ModalController, PopoverController } from 'ionic-angular';
import { ListQuestionsPage } from '../list-questions/list-questions';
import { ExplainPage } from '../explain/explain';
import { FirestoreDataService } from '../../app/services/firebase.service';

@Component({
  selector: 'page-hoc-luat',
  templateUrl: 'hoc-luat.html'
})
export class HocLuatPage {

  categories: Array<{id: number, name: string, icon: string}>;
  helpTextContent: string;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public popoverCtrl: PopoverController,
              public firebaseService: FirestoreDataService) {
  
    this.categories = [
      { id: 1, name: 'Những Câu Hay Trả Lời Sai', icon: 'imagehaytraloisai.png' },
      { id: 2, name: 'Những Câu Đánh Dấu', icon: 'imagecaudanhdau.png' },
      { id: 3, name: 'Khái Niệm Và Quy Tắc', icon: 'imagekhainiem.png' },
      { id: 4, name: 'Nghiệp Vụ Vận Tải', icon: 'imagenghiepvu.png' },
      { id: 5, name: 'Đạo Đức Nghề Nghiệp', icon: 'imagedaoduc.png' },
      { id: 6, name: 'Kỹ Thuật Lái Xe', icon: 'imagekythuat.png' },
      { id: 7, name: 'Cấu Tạo Và Sửa Chữa', icon: 'imagecautao.png' },
      { id: 8, name: 'Hệ Thống Biển Báo', icon: 'imagebienbao.png' },
      { id: 9, name: 'Sa Hình', icon: 'imagesahinh.png' },
      { id: 10, name: 'Tất Cả 450 Câu Hỏi', icon: 'imagetatcacauhoi.png' }
    ];

    this.firebaseService.getHocLuatHelpText().subscribe(res => {
      this.helpTextContent = res.text;
    })
  
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListQuestionsPage, {
      item: item
    });
  }

  helpText(myEvent) {
    let popover = this.popoverCtrl.create(ExplainPage, {title: 'Thông Tin', content: this.helpTextContent});
    popover.present({
      ev: myEvent
    });
  }

}
