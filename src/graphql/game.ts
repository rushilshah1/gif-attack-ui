import gql from 'graphql-tag';

// export type IGif = {
//     gameId?: string,
//     id?: string,
//     gif?: string
// }
export interface IGame {
    id: number
    users: Array<string>
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

export const GET_USERS_IN_GAME = gql`
    query GetUsersInGameQuery($gameId: ID!) {
        getUsers(gameId: $gameId) {
            name
        }
    }
`