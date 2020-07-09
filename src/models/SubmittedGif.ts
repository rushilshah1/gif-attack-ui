export interface IGif {
    id?: string
    gifId?: string;
    content?: string;
    userId?: string
    gifSearchText?: string
    numVotes?: number;
    isWinner?: boolean;
}

export class SubmittedGif implements IGif {

    id!: string;
    gifId!: string;
    content!: any;
    userId!: string;
    gifSearchText!: string;
    numVotes!: number;
    isWinner!: boolean;

    constructor(gif?: Partial<SubmittedGif>) {
        Object.assign(this, gif);
        if (gif && gif.content && typeof gif.content === "string") {
            this.content = JSON.parse(gif.content);
        }
    }

}