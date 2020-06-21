import gql from 'graphql-tag';

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