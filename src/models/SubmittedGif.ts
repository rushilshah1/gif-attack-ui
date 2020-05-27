import { IGif } from "../graphql/gif";

export class SubmittedGif implements IGif {

    id!: string;
    gif: any;
    gameId?: string;
    userName!: string;
    gifSearchText!: string;
    numVotes: number = 0;

    constructor(gif?: Partial<SubmittedGif>) {
        Object.assign(this, gif);
    }

}