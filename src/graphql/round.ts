import gql from 'graphql-tag';

// export type IGif = {
//     gameId?: string,
//     id?: string,
//     gif?: string
// }
export interface IRound {
    roundNumber?: number
    gameId?: string
}

export const ROUND_STARTED_SUBSCRIPTION = gql`
    subscription RoundStartedSubscription($gameId: ID!) {
        roundStarted(gameId: $gameId) {
            roundNumber
        }
    }
`
export const NEXT_ROUND_MUTATION = gql`
    mutation NextRoundMutation($input: RoundInput!) {
        nextRound(input: $input) {
            roundNumber
        }
    }
`