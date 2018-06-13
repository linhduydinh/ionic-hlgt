import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Question, Answer } from '../../models/question';
import { QuestionTestDto } from '../../models/questionTestDto';

@Injectable()
export class FirestoreDataService {

  questionsCollection: AngularFirestoreCollection<Question>;
  questions: Observable<Question[]>;
  userDataCollection: AngularFirestoreCollection<any>;
  userData: Observable<any[]>;

  constructor(public _afs: AngularFirestore) {
    this.questionsCollection = this._afs.collection('questions');
    this.userDataCollection = this._afs.collection('userdatas');

    this.questions = this.questionsCollection.snapshotChanges().map(
      changes => {
        return changes.map(
          a => {
            const data = a.payload.doc.data() as Question;
            return data;
        });
    });

    this.userData = this.userDataCollection.snapshotChanges().map(
      changes => {
        return changes.map(
          data => {
            return data;
        });
    });

  }

  getQuestions() {
    return this.questions;
  }

  saveDataUser(userId: string, notCors: number[], favors: number[], listBaiLam: QuestionTestDto[]) {
    const userDatasRef = this.userDataCollection.doc(`${userId}`);
    if (listBaiLam != undefined) {
      listBaiLam.forEach(element => {
        let baiLam: any = [];
        let listIds: string[] = [];
        let anss: number[] = [];
        element.questions.forEach(question => {
          question.ans.forEach(ans => {
            if (ans.click) {
              anss.push(+ans.aId)
            }
          })
          listIds.push(question.id);
        });
        userDatasRef.collection('listBaiLam').doc(`${element.index}`).set({createDate : element.createDate, 
          numberCorrect : element.numberCorrect, totalQuestion : element.totalQuestion, ans: anss, qIds: listIds});
      })
    }
    if (notCors != undefined && favors != undefined) {
      userDatasRef.set({notCors: notCors, favors: favors})
    } else {
      if (notCors != undefined) {
        userDatasRef.set({notCors: notCors})
      }
      if (favors != undefined) {
        userDatasRef.set({favors: favors})
      }
    }

  }

  // getQuestionsByCategoryId(id: number) {
  //   return this.questions.filter(x => x. === id);

  //   const listQuestions: any = [];
  //   const questionsRef = this._afs.firestore.collection('questions');
  //   questionsRef.where('cId', '==', id.toString())
  //               .get()
  //               .then(function(querySnapshot) {
  //                 console.log(querySnapshot);
  //                   querySnapshot.forEach(function(doc) {
  //                       // doc.data() is never undefined for query doc snapshots
  //                       console.log(doc.id, ' => ', doc.data());
  //                       listQuestions.push(doc);
  //                   });
  //               })
  //               .catch(function(error) {
  //                   console.log('Error getting documents: ', error);
  //               });
      
  //     return  Observable.of(listQuestions);;
  // }

  // addQuestion(question: any, imageUrl: string) {
  //   const questionsRef = this.questionsCollection.doc(`${question.questionId}`);
  //   questionsRef.set({name: question.questionName, cId: question.categoryId,
  //                     img: imageUrl, expl: question.questionExplain,
  //                     answers: question.answers});
  // }

  // getQuestion(id: number) {
  //   this.questionDoc = this._afs.doc<Question>(`questions/${id}`);
  //   this.question = this.questionDoc.valueChanges();
  //   return this.question;
  // }

}
