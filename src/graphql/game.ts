import gql from 'graphql-tag';

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
export const CREATE_GAME_MUTATION = gql`
    mutation CreateGameMutation($userName: String!) {
        createGame(userName: $userName) {
            id
        }
    }
`

export const ADD_USER_TO_GAME_MUTATION = gql`
    mutation AddUserToGameMutation($input: AddUserInput!) {
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

export const GET_GAMES_BY_ID_QUERY = gql`
    query GetGamesByIdQuery($gameId: ID!) {
        getGameById(gameId: $gameId) {
            id
            started
        }
    }
`