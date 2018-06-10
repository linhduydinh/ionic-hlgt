import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { ListQuestionsPage } from '../list-questions/list-questions';
import { FirestoreDataService } from '../../app/services/firebase.service';
import { AuthService } from '../../app/services/auth-service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-hoc-luat',
  templateUrl: 'hoc-luat.html'
})
export class HocLuatPage {

  categories: Array<{id: number, name: string, icon: string}>;
  isLoggedIn: boolean;
  accountPhoto: string;

  constructor(public navCtrl: NavController, private firebaseService: FirestoreDataService,
              public authService: AuthService, public modalCtrl: ModalController, public alertCtrl: AlertController) {
  
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

    this.authService.isLoggedIn().subscribe(user => {
      if(user !== null) {
        this.isLoggedIn = true;
        this.accountPhoto = user.photoURL
        console.log(this.accountPhoto);
      } else {
        this.isLoggedIn = false
      }
    });
  
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListQuestionsPage, {
      item: item
    });
  }

  login() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.onDidDismiss((item) => {
    });
    modal.present();
  }

  askLogout() {
    const confirm = this.alertCtrl.create({
      title: 'Đăng Xuất',
      message: 'Bạn thật sự muốn đăng xuất?',
      buttons: [
        {
          text: 'Huỷ',
          handler: () => {
          }
        },
        {
          text: 'Đồng Ý',
          handler: () => {
            this.authService.logout();
          }
        }
      ]
    });
    confirm.present();
  }

}
