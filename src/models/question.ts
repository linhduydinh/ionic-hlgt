export class Question {
    id: string;
    name: string;
    cId: string;
    ans: Answer[];
    expl: string;
    imageUrl: string;
}

export class Answer {
    aId: string;
    aName: string;
    isCor: boolean;
}
