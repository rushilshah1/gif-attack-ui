import gql from 'graphql-tag';
import { getQuery } from './api-client';

export const GAME_STATE_CHANGED_SUBSCRIPTION = gql`
    subscription GameStateChangedSubscription($gameId: ID!) {
        gameStateChanged(gameId: $gameId) {
            id
            gameStarted
            roundActive
            submissionActive
            topic
            roundNumber
            users {
                id
                name
                score
                hasSubmitted
                votedGif
            }
            submittedGifs {
                id
                gifId
                content
                userId
                gifSearchText
                numVotes
                isWinner
            }
        }
    }
`

export const CREATE_GAME_MUTATION = gql`
    mutation CreateGameMutation {
        createGame {
            id
        }
    }
`


export const START_GAME_MUTATION = gql`
    mutation StartGameMutation($gameId: ID!) {
        startGame(gameId: $gameId) {
            id
            gameStarted
        }
    }
`
export const GET_GAMES_QUERY = gql`
    query GetGamesQuery {
        getGames {
            id
            gameStarted
        }
    }
`

export const GET_GAME_BY_ID_QUERY_HOOK = gql`
    query GetGameByIdQuery($gameId: ID!) {
        getGameById(gameId: $gameId) {
            id
            gameStarted
            roundActive
            submissionActive
            topic
            roundNumber
            users {
                id
                name
                score
                hasSubmitted
                votedGif
            }
            submittedGifs {
                id
                gifId
                content
                userId
                gifSearchText
                numVotes
                isWinner
            }
        }
    }
`
//This query is not meant to be used with the useQuery hook
//To be used with axios http client to be called on demand within a function
export const GET_GAMES_BY_ID_QUERY = (id): string =>
    `
    query {
        getGameById(gameId: "${id}") {
            id
            gameStarted
            roundActive
            submissionActive
            topic
            roundNumber
            users {
                id
                name
                score
                hasSubmitted
                votedGif
            }
            submittedGifs {
                id
                gifId
                content
                userId
                gifSearchText
                numVotes
                isWinner
            }
        }
    }
`
/*Only to be used if players are not permitted to join a game freely */
export const canJoinGame = async (gameId: string): Promise<boolean> => {
    const game = await getGameById(gameId);
    return game ? true : false;
}

export const getGameById = async (gameId: string): Promise<any> => {
    try {
        const response = await getQuery(GET_GAMES_BY_ID_QUERY(gameId));
        return response.getGameById;
    } catch (error) { //If id does not exist
        return null;
    }
}