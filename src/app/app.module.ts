import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ListQuestionsPage } from '../pages/list-questions/list-questions';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FirebaseConfig } from './firebase.config';
import { AngularFireModule } from 'angularfire2';
import { FirestoreDataService } from './services/firebase.service';
import { QuestionsPopupPage } from '../pages/questions-popup/questions-popup';
import { IonicStorageModule } from '@ionic/storage';
import { ThiThuTestPage } from '../pages/thi-thu-test/thi-thu-test';
import { ThiThuPage } from '../pages/thi-thu/thi-thu';
import { HocLuatPage } from '../pages/hoc-luat/hoc-luat';

@NgModule({
  declarations: [
    MyApp,
    HocLuatPage,
    ListQuestionsPage,
    QuestionsPopupPage,
    ThiThuTestPage,
    ThiThuPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: 'Quay Lại'
    }),
    AngularFireModule.initializeApp(FirebaseConfig.firebase),
    AngularFirestoreModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HocLuatPage,
    ListQuestionsPage,
    QuestionsPopupPage,
    ThiThuTestPage,
    ThiThuPage
  ],
  providers: [
    FirestoreDataService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
