import { IGif } from "../graphql/gif";

export class SubmittedGifModel implements IGif {

    id!: string;
    gif: any;
    gameId?: string;
    userName!: string;
    gifSearchText!: string;
    numVotes: number = 0;

    constructor(gif?: Partial<SubmittedGifModel>) {
        Object.assign(this, gif);
    }

}