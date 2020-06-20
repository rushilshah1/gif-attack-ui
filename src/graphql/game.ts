import gql from 'graphql-tag';
import { getQuery } from './api-client';

// export type IGif = {
//     gameId?: string,
//     id?: string,
//     gif?: string
// }
// export interface IGame {
//     id: string
//     users?: Array<string>
//     started?: boolean;
// }

export const GAME_STATE_CHANGED_SUBSCRIPTION = gql`
    subscription UserChangedInGameSubscription($gameId: ID!) {
        gameStateChanged(gameId: $gameId) {
            id
            gameStarted
            roundActive
            topic
            roundNumber
            users {
                id
                name
                score
            }
            submittedGifs {
                id
                gifId
                content
                userId
                gifSearchText
                numVotes
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

export const ADD_USER_MUTATION = gql`
    mutation AddUserMutation($user: AddUserInput!, $gameId: ID!) {
        addUser(user: $user, gameId: $gameId) {
            id
            name
            score
        }
    }
`

export const REMOVE_USER_MUTATION = gql`
    mutation RemoveUserMutation($user: ModifyUserInput!, $gameId: ID!) {
        removeUser(user: $user, gameId: $gameId) {
            id
            name
            score
        }
    }
`

export const UPDATE_USER_MUTATION = gql`
    mutation UpdateUserMutation($user: ModifyUserInput!, $gameId: ID!) {
        updateUser(user: $user, gameId: $gameId) {
            id
            name
            score
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

export const GET_USERS_IN_GAME_QUERY = gql`
    query GetUsersInGameQuery($gameId: ID!) {
        getUsers(gameId: $gameId) {
            id
            name
            score
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
            topic
            roundNumber
            users {
                id
                name
                score
            }
            submittedGifs {
                id
                gifId
                content
                userId
                gifSearchText
                numVotes
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
            topic
            roundNumber
            users {
                id
                name
                score
            }
            submittedGifs {
                id
                gifId
                content
                userId
                gifSearchText
                numVotes
            }
        }
    }
`
export const canJoinGame = async (gameId: string): Promise<boolean> => {
    const game = await getGameById(gameId);
    return (game && game.gameStarted === false);
}

export const getGameById = async (gameId: string): Promise<any> => {
    try {
        const response = await getQuery(GET_GAMES_BY_ID_QUERY(gameId));
        return response.getGameById;
    } catch (error) { //If id does not exist
        return null;
    }
}