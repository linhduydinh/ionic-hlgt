export class Question {
    id: string;
    name: string;
    cId: string;
    ans: Answer[];
    expl: string;
    imageUrl: string;
    isFa: boolean;
    notCor: number;
}

export class Answer {
    aId: string;
    aName: string;
    isCor: boolean;
    click: boolean;
}
