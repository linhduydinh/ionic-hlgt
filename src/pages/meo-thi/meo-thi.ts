import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { ExplainPage } from '../explain/explain';
import { HuongDanPage } from '../huong-dan/huong-dan';

@Component({
  selector: 'page-meo-thi',
  templateUrl: 'meo-thi.html',
})
export class MeoThiPage {

  categories: Array<{id: number, name: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {

    this.categories = [
      { id: 3, name: 'Khái Niệm Và Quy Tắc', icon: 'imagekhainiem.png' },
      { id: 4, name: 'Nghiệp Vụ Vận Tải', icon: 'imagenghiepvu.png' },
      { id: 5, name: 'Đạo Đức Nghề Nghiệp', icon: 'imagedaoduc.png' },
      { id: 6, name: 'Kỹ Thuật Lái Xe', icon: 'imagekythuat.png' },
      { id: 7, name: 'Cấu Tạo Và Sửa Chữa', icon: 'imagecautao.png' },
      { id: 8, name: 'Hệ Thống Biển Báo', icon: 'imagebienbao.png' },
      { id: 9, name: 'Sa Hình', icon: 'imagesahinh.png' },
    ];

  }

  ionViewDidLoad() {
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(HuongDanPage, {
      item: item
    });
  }

  helpText(myEvent) {
    const helpText = ''
    let popover = this.popoverCtrl.create(ExplainPage, {title: 'Hướng Dẫn', content: helpText});
    popover.present({
      ev: myEvent
    });
  }

}
