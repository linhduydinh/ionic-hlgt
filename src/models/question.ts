export class Question {
    id: string;
    name: string;
    cId: string;
    ans: Answer[];
    expl: string;
    imageUrl: string;
    isFa: boolean;
    completed: boolean;
    isCor: boolean;
}

export class Answer {
    aId: string;
    aName: string;
    isCor: boolean;
    click: boolean;
}
