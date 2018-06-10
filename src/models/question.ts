export class Question {
    id: string;
    name: string;
    cId: string;
    ans: Answer[];
    expl: string;
    img: string;
    isFa: boolean;
    completed: boolean;
    isCor: boolean;
    index: number;
}

export class Answer {
    aId: string;
    aName: string;
    isCor: boolean;
    click: boolean;
}
