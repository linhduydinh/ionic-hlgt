import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ITimer } from '../../models/timer';

/**
 * Generated class for the ThiThuTestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-thi-thu-test',
  templateUrl: 'thi-thu-test.html',
})
export class ThiThuTestPage {

  @Input() timeInSeconds: number;
  timer: ITimer;
  displayTime: string;
  pause = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    this.initTimer();
    this.startTimer();
  }

  initTimer() {
    if(!this.timeInSeconds) { this.timeInSeconds = 1800; }

    this.timer = <ITimer>{
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
    var hoursString = '';
    var minutesString = '';
    var secondsString = '';
    hoursString = (hours < 10) ? "0" + hours : hours.toString();
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
            console.log('c');
        }
    }, 1000);
  }

}
