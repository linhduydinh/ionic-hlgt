import { Question } from "./question";
import { DateTime } from "ionic-angular";

export class QuestionTestDto {
    questions: Question[];
    numberCorrect: number;
    totalQuestion = 30;
    createDate: string;

    constructor() {
        this.questions = new Array<Question>();
    }

}