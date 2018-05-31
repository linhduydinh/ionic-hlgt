import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import { Question } from '../../models/question';
// import { Question } from '../../models/question';
// import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class FirestoreDataService {

  questionsCollection: AngularFirestoreCollection<Question>;
  questions: Observable<Question[]>;

  constructor(public _afs: AngularFirestore) {
    this.questionsCollection = this._afs.collection('questions');
    this.questions = this.questionsCollection.snapshotChanges().map(
    changes => {
      return changes.map(
        a => {
          const data = a.payload.doc.data() as Question;
          return data;
        });
    });
  }

  getQuestions() {
    return this.questions;
  }

  // getQuestionsByCategoryId(id: number): Question[] {

  //   const listQuestions: any = [];
  //   const questionsRef = this._afs.firestore.collection('questions');
  //   questionsRef.where('cId', '==', '1')
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

  //     return listQuestions;
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