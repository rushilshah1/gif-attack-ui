import { canJoinGame } from "../graphql/game"

//To be used if there needs to be a restriction from joining the game
/*
export const gameGuard = async (to, from, next) => {
    const { gameId } = to.match.params;
    const validGame: boolean = await canJoinGame(gameId);
    if (validGame) {
        next()
    }
    else {
        next.redirect('/home')
    }
}
*/