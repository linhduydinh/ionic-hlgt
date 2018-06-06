import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ListQuestionsPage } from '../pages/list-questions/list-questions';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';
import { FirebaseConfig } from './firebase.config';
import { AngularFireModule } from 'angularfire2';
import { FirestoreDataService } from './services/firebase.service';
import { QuestionsPopupPage } from '../pages/questions-popup/questions-popup';
import { IonicStorageModule } from '@ionic/storage';
import { ThiThuTestPage } from '../pages/thi-thu-test/thi-thu-test';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ListQuestionsPage,
    QuestionsPopupPage,
    ThiThuTestPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FirebaseConfig.firebase),
    AngularFirestoreModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ListQuestionsPage,
    QuestionsPopupPage,
    ThiThuTestPage
  ],
  providers: [
    FirestoreDataService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
