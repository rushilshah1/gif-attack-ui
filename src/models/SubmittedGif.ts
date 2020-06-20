//TODO: Break interface/ into two so content is string and object and not "any"
export interface IGif {
    id?: string
    gifId?: string;
    content?: string;
    userId?: string
    gifSearchText?: string
    numVotes?: number;
}

export class SubmittedGif implements IGif {

    id!: string;
    gifId!: string;
    content: any;
    userId!: string;
    gifSearchText!: string;
    numVotes!: number;

    constructor(gif?: Partial<SubmittedGif>) {
        Object.assign(this, gif);
        if (gif && gif.content && typeof gif.content === "string") {
            this.content = JSON.parse(gif.content);
        }
    }

}