export interface IUser {
    name: string;
    score: number;
}

export class User implements IUser {

    name!: string;
    score: number = 0;

    constructor(user?: Partial<User>) {
        Object.assign(this, user);
    }
}