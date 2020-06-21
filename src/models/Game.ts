import { User } from "./User";
import { SubmittedGif } from "./SubmittedGif";

export interface IGame {
    id: string;
    gameStarted: boolean;
    roundActive: boolean;
    topic: string;
    roundNumber: number;
    users: Array<User>;
    submittedGifs: Array<SubmittedGif>;
}

export interface IGameVars {
    gameId: string;
}
export interface IGameData {
    getGameById: IGame
}
export class Game implements IGame {
    id!: string;
    gameStarted!: boolean;
    roundActive!: boolean;
    topic!: string;
    roundNumber!: number;
    users: Array<User> = [];
    submittedGifs: Array<SubmittedGif> = [];

    constructor(game?: Partial<Game>) {
        Object.assign(this, game);
    }
}