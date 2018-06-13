import { Question } from "./question";

export class QuestionTestDto {
    questions: Question[];
    numberCorrect: number;
    totalQuestion = 30;
    createDate: string;

    constructor() {
        this.questions = new Array<Question>();
    }

}