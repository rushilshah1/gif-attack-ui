import { canJoinGame } from "../graphql/game"

export const gameGuard = async (to, from, next) => {
    const { gameId } = to.match.params;
    const validGame: boolean = await canJoinGame(gameId);
    console.log(`Checking in Guard for Game ${gameId} -> ${validGame}`)
    if (validGame) {
        next()
    }
    else {
        next.redirect('/home')
    }
}