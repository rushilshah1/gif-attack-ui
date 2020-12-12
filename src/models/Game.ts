import { User } from "./User";
import { SubmittedGif } from "./SubmittedGif";
import { ISettings, defaultSettings } from "./Settings";

export interface IGame {
    id: string;
    gameStarted: boolean;
    roundActive: boolean;
    submissionActive: boolean;
    topic: string;
    roundNumber: number;
    users: Array<User>;
    submittedGifs: Array<SubmittedGif>;
    settings?: ISettings;
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
    submissionActive!: boolean;
    topic!: string;
    roundNumber!: number;
    users: Array<User> = [];
    submittedGifs: Array<SubmittedGif> = [];
    settings?: ISettings = defaultSettings;

    constructor(game?: Partial<Game>) {
        Object.assign(this, game);
    }
}