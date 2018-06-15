import { Component, Input, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, Slides, Loading, LoadingController, AlertController, PopoverController } from 'ionic-angular';
import { ITimer } from '../../models/timer';
import { Question } from '../../models/question';
import { FirestoreDataService } from '../../app/services/firebase.service';
import { Storage } from '@ionic/storage';
import { QuestionsPopupPage } from '../questions-popup/questions-popup';
import { QuestionTestDto } from '../../models/questionTestDto';
import { KetThucPage } from '../ket-thuc/ket-thuc';

@Component({
  selector: 'page-thi-thu-test',
  templateUrl: 'thi-thu-test.html',
})
export class ThiThuTestPage {

  @ViewChild('slides') slides: Slides;
  @Input() timeInSeconds: number;
  timer: ITimer;
  displayTime: string;
  pause = false;
  loader: Loading;
  listQuestionIds = [];
  listQuestions: Question[] = [];
  favoriteQuestions: number[] = [];
  answerClick = false;
  listBaiLam: QuestionTestDto[] = [];
  isCompleted = false;
  questionTestDto: QuestionTestDto;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, 
              public loadingCtrl: LoadingController, public alertCtrl: AlertController, public popoverCtrl: PopoverController,
              private firestoreService: FirestoreDataService, private storage: Storage, public modalCtrl: ModalController) {

    this.questionTestDto = this.navParams.get('questionTestDto');
    
    this.loader = this.loadingCtrl.create({
      content: "Vui lòng đợi...",
      dismissOnPageChange: true,

    });
    this.loader.present();
  }

  ionViewDidLoad() {
    this.initTimer();
    this.startTimer();
    this.storage.get('questions').then((data) => {
      if (data) {
        this.getListQuestions(data);
        this.storage.get('favoriteQuestions').then(favor => {
          if (favor) {
            this.favoriteQuestions = favor;
            favor.forEach(element => {
              if (this.listQuestions.filter(x => x.id == String(element))[0]){
                this.listQuestions.filter(x => x.id == String(element))[0].isFa = true;
              }
            })
          }
        });
      } else {
        this.firestoreService.getQuestions().subscribe(res => {
          this.getListQuestions(res);
        });
      }
    });
    this.loader.dismiss();
  }

  getListQuestions(listQuestions: Question[]) {
    this.getQuestionIdsForTest();
    this.listQuestionIds.forEach((element, index) => {
      const question = listQuestions.filter(x => x.id == element)[0];
      if (question != undefined) {
        question.index = index;
        this.listQuestions.push(listQuestions.filter(x => x.id == element)[0]);
      }
    })
  }

  initTimer() {
    if(!this.timeInSeconds) { this.timeInSeconds = 1200; }

    this.timer = <ITimer> {
        seconds: this.timeInSeconds,
        runTimer: false,
        hasStarted: false,
        hasFinished: false,
        secondsRemaining: this.timeInSeconds
    };

    this.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
    var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    // var hoursString = '';
    var minutesString = '';
    var secondsString = '';
    // hoursString = (hours < 10) ? "0" + hours : hours.toString();
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    return minutesString + ':' + secondsString;
  }

  startTimer() {
    this.timer.hasStarted = true;
    this.timer.runTimer = true;
    this.timerTick();
  }

  pauseTimer() {
    this.pause = true;
    this.timer.runTimer = false;
  }

  resumeTimer() {
    this.pause = false;
    this.startTimer();
  }

  timerTick() {
    setTimeout(() => {
        if (!this.timer.runTimer) { return; }
        this.timer.secondsRemaining--;
        this.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
        if (this.timer.secondsRemaining > 0) {
            this.timerTick();
        }
        else {
            this.timer.hasFinished = true;
            this.finishTest();
        }
    }, 1000);
  }

  dismiss() {
    this.pauseTimer();
    this.showConfirmExit();
  }

  getQuestionIdsForTest() {
    if(this.questionTestDto == undefined || this.questionTestDto == null) {
      for (var i = 1; i <= 30; i++) {
        if (i <= 9) {
          this.listQuestionIds.push(this.randomIntFromInterval(1, 145));
        } else if (i == 10) {
          this.listQuestionIds.push(this.randomIntFromInterval(146, 175));
        } else if (i == 11) {
          this.listQuestionIds.push(this.randomIntFromInterval(146, 175));
        } else if (i == 12) {
          this.listQuestionIds.push(this.randomIntFromInterval(201, 255));
        } else if (i <= 21 ) {
          this.listQuestionIds.push(this.randomIntFromInterval(256, 355));
        } else {
          this.listQuestionIds.push(this.randomIntFromInterval(356, 450));
        }
      }
    } else {
      this.questionTestDto.questions.forEach(element => {
        this.listQuestionIds.push(element.id);
      })
    }

  }

  randomIntFromInterval(min, max)
  {
    let number;
    do {
      number = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (this.listQuestionIds.filter(x => x == number).length >= 1)
    return number;
  }

  openModal(listQuestions: any) {
    let modal = this.modalCtrl.create(QuestionsPopupPage, {listQuestions: listQuestions, isTest: true});
    modal.onDidDismiss((item) => {
      if(item != undefined) {
        this.slides.slideTo(item.index);
      }
    });
    modal.present();
  }

  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }

  isFavorite(questionFa: Question) {
    if (questionFa.isFa) {
      questionFa.isFa = false;
    } else {
      questionFa.isFa = true;
    }
    this.updateStorageFavorite(questionFa.id);
  }

  updateStorageFavorite(questionId: any) {
    if (this.favoriteQuestions.filter(x => x == questionId).length >= 1) {
      this.favoriteQuestions = this.favoriteQuestions.filter(x => x != questionId);
    } else {
      this.favoriteQuestions.push(questionId);
    }
    this.storage.set('favoriteQuestions', this.favoriteQuestions);
  }

  clickAnswer(answer: any, answerClick: boolean) {
    if (!this.isCompleted) {
      this.answerClick = !answerClick;
      let currentIndex = this.slides.getActiveIndex();
      const slide = this.slides._slides[currentIndex];
      if (answer.click == undefined) {
        answer.click = answerClick;
        slide.getElementsByClassName(String(answer.aId))[0].className += ' selected';
      } else {
        if (answer.click) {
          answer.click = !answer.click
          slide.getElementsByClassName(String(answer.aId))[0].classList.remove('selected');
        } else {
          answer.click = !answer.click
          slide.getElementsByClassName(String(answer.aId))[0].className += ' selected';
        }
      }
    }
  }

  finishTest() {
    let questionNotAnswer: Question[] = [];
    this.listQuestions.forEach(element => {
      let haveAnswer = false;
      if (element.ans) {
        element.ans.some(ans => {
          if (ans.click != undefined) {
            return haveAnswer = true
          }
        })
        if (!haveAnswer) {
          questionNotAnswer.push(element);
        }
      }
    })
    if(questionNotAnswer.length == 0) {
      this.isCompleted = true;
      let numberCorrect = this.checkTestPass(this.listQuestions);
      let questionTestDto: QuestionTestDto = new QuestionTestDto();
      questionTestDto.questions = this.listQuestions;
      questionTestDto.numberCorrect = numberCorrect;
      questionTestDto.createDate = new Date().toLocaleString();
      let popover = this.popoverCtrl.create(KetThucPage, {questionTestDto: questionTestDto}, {enableBackdropDismiss: false, cssClass: 'ket-thuc'});
      popover.present();
      this.storage.get('listBaiLam').then((data) => {
        console.log(data);
        if (data) {
          this.listBaiLam = data;
          questionTestDto.index = data.length + 1;
        } else {
          questionTestDto.index = 0;
        }
        this.listBaiLam.push(questionTestDto);
        this.storage.set('listBaiLam', this.listBaiLam);
      });
    } else {
      let modal = this.modalCtrl.create(QuestionsPopupPage, {listQuestions: questionNotAnswer, isFinishTest: true});
      modal.onDidDismiss((item) => {
        if(item != undefined) {
          this.slides.slideTo(item.item.index);
        }
      });
      modal.present();
    }
  }

  checkTestPass(questions: Question[]): number {
    let numberCorrect = 0;
    questions.forEach(element => {
      element.isCor = true;
      element.ans.some(answer => {
        if (answer.isCor) {
          if (!answer.click || answer.click == undefined) {
            return element.isCor = false;
          }
        }
      });
      if (element.isCor) {
        numberCorrect++;
      }
    });
    return numberCorrect;
  }

  showConfirmExit() {
    const confirm = this.alertCtrl.create({
      title: 'Bạn Muốn Thoát?',
      message: 'Kết quả bài làm sẽ không được lưu.',
      buttons: [
        {
          text: 'Hủy Bỏ',
          handler: () => {
            this.resumeTimer();
          }
        },
        {
          text: 'Đồng Ý',
          handler: () => {
            this.viewCtrl.dismiss();
          }
        }
      ]
    });
    confirm.present();
  }

}
