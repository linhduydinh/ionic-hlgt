import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListQuestionsPage } from './list-questions';

@NgModule({
  declarations: [
    ListQuestionsPage,
  ],
  imports: [
    IonicPageModule.forChild(ListQuestionsPage),
  ],
})
export class ListQuestionsPageModule {}
