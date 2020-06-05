import gql from 'graphql-tag';
import { getQuery } from './api-client';

// export type IGif = {
//     gameId?: string,
//     id?: string,
//     gif?: string
// }
export interface IGame {
    id: string
    users?: Array<string>
    started?: boolean;
}

export const NEW_USER_IN_GAME_SUBSCRIPTION = gql`
    subscription NewUserInGameSubscription($gameId: ID!) {
        newUserInGame(gameId: $gameId) {
            id
            users {
                name
            }
        }
    }
`
export const USER_REMOVED_FROM_GAME_SUBSCRIPTION = gql`
    subscription UserRemovedFromGameSubscription($gameId: ID!) {
        userRemovedFromGame(gameId: $gameId) {
            id
            users {
                name
            }
        }
    }
`

export const CREATE_GAME_MUTATION = gql`
    mutation CreateGameMutation($userName: String!) {
        createGame(userName: $userName) {
            id
        }
    }
`

export const ADD_USER_TO_GAME_MUTATION = gql`
    mutation AddUserToGameMutation($input: UserInput!) {
        addUserToGame(input: $input) {
            name
        }
    }
`

export const START_GAME_MUTATION = gql`
    mutation StartGameMutation($gameId: ID!) {
        startGame(gameId: $gameId) {
            started
        }
    }
`

export const GET_USERS_IN_GAME_QUERY = gql`
    query GetUsersInGameQuery($gameId: ID!) {
        getUsers(gameId: $gameId) {
            name
        }
    }
`
export const GET_GAMES_QUERY = gql`
    query GetGamesQuery {
        getGames {
            id
            started
        }
    }
`

export const GET_GAMES_BY_ID_QUERY = (id): string =>
    `
    query {
        getGameById(gameId: "${id}") {
            id
            started
        }
    }
`
export const canJoinGame = async (gameId: string): Promise<boolean> => {
    const game = await getGameById(gameId);
    return (game && game.started === false);
}

export const getGameById = async (gameId: string): Promise<any> => {
    try {
        const response = await getQuery(GET_GAMES_BY_ID_QUERY(gameId));
        return response.getGameById;
    } catch (error) { //If id does not exist
        return null;
    }
}