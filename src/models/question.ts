export class Question {
    id: string;
    name: string;
    categoryId: string;
    answers: Answer[];
    explain: string;
    imageUrl: string;
}

export class Answer {
    answerId: string;
    answerName: string;
    isCorrect: boolean;
}
