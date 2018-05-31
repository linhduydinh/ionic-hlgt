import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ListQuestionsPage } from '../list-questions/list-questions';
import { FirestoreDataService } from '../../app/services/firebase.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  categories: Array<{id: number, name: string, icon: string}>;

  constructor(public navCtrl: NavController, private firebaseService: FirestoreDataService) {
  
    this.categories = [
      { id: 1, name: 'Những Câu Hay Trả Lời Sai', icon: 'md-close-circle' },
      { id: 2, name: 'Những Câu Đánh Dấu', icon: 'md-star' },
      { id: 3, name: 'Khái Niệm Và Quy Tắc', icon: 'ios-book' },
      { id: 4, name: 'Nghiệp Vụ Vận Tải', icon: 'ios-subway' },
      { id: 5, name: 'Đạo Đức Nghề Nghiệp', icon: 'ios-compass' },
      { id: 6, name: 'Kỹ Thuật Lái Xe', icon: 'md-car' },
      { id: 7, name: 'Cấu Tạo Và Sửa Chữa', icon: 'ios-construct' },
      { id: 8, name: 'Hệ Thống Biển Báo', icon: 'ios-warning' },
      { id: 9, name: 'Sa Hình', icon: 'md-move' },
      { id: 10, name: 'Tất cả 450 câu hỏi', icon: 'md-albums' }
    ];
  
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListQuestionsPage, {
      item: item
    });
  }

}
