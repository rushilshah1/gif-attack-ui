export interface IUser {
    id: string;
    name: string;
    score: number;
    hasSubmitted: boolean;
    votedGif: string;
}

export class User implements IUser {
    id!: string;
    name!: string;
    score: number = 0;
    hasSubmitted: boolean = false;
    votedGif: string = '';

    constructor(user?: Partial<User>) {
        Object.assign(this, user);
    }
}