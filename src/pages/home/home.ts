import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  categories: Array<{id: number, name: string, icon: string}>;

  constructor(public navCtrl: NavController) {
  
    this.categories = [
      { id: 1, name: 'Những Câu Hay Trả Lời Sai', icon: 'md-close-circle' },
      { id: 2, name: 'Những Câu Đánh Dấu', icon: 'md-star' },
      { id: 2, name: 'Những Câu Đánh Dấu', icon: '' },
      { id: 2, name: 'Những Câu Đánh Dấu', icon: '' },
      { id: 2, name: 'Những Câu Đánh Dấu', icon: '' },
      { id: 2, name: 'Những Câu Đánh Dấu', icon: '' },
      { id: 2, name: 'Những Câu Đánh Dấu', icon: '' },
      { id: 2, name: 'Những Câu Đánh Dấu', icon: '' }
    ];
  
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(HomePage, {
      item: item
    });
  }

}
