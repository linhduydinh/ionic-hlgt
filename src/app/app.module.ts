import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ListQuestionsPage } from '../pages/list-questions/list-questions';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FirebaseConfig } from './firebase.config';
import { AngularFireModule } from 'angularfire2';
import { FirestoreDataService } from './services/firebase.service';
import { QuestionsPopupPage } from '../pages/questions-popup/questions-popup';
import { IonicStorageModule } from '@ionic/storage';
import { ThiThuTestPage } from '../pages/thi-thu-test/thi-thu-test';
import { ThiThuPage } from '../pages/thi-thu/thi-thu';
import { HocLuatPage } from '../pages/hoc-luat/hoc-luat';
import { LoginPage } from '../pages/login/login';
import { AuthService } from './services/auth-service';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { ExplainPage } from '../pages/explain/explain';
import { KetThucPage } from '../pages/ket-thuc/ket-thuc';
import { XemLaiPage } from '../pages/xem-lai/xem-lai';
import { MeoThiPage } from '../pages/meo-thi/meo-thi';
import { HuongDanPage } from '../pages/huong-dan/huong-dan';

@NgModule({
  declarations: [
    MyApp,
    HocLuatPage,
    ListQuestionsPage,
    QuestionsPopupPage,
    ThiThuTestPage,
    ThiThuPage,
    LoginPage,
    ExplainPage,
    KetThucPage,
    XemLaiPage,
    MeoThiPage,
    HuongDanPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: 'Quay Lại'
    }),
    AngularFireModule.initializeApp(FirebaseConfig.firebase),
    AngularFirestoreModule,
    IonicStorageModule.forRoot(),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HocLuatPage,
    ListQuestionsPage,
    QuestionsPopupPage,
    ThiThuTestPage,
    ThiThuPage,
    LoginPage,
    ExplainPage,
    KetThucPage,
    XemLaiPage,
    MeoThiPage,
    HuongDanPage
  ],
  providers: [
    FirestoreDataService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    File,
    FileTransfer
  ]
})
export class AppModule {}
