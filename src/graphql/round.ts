import gql from 'graphql-tag';

export interface IRound {
    roundNumber: number
}

export const ROUND_CHANGED_SUBSCRIPTION = gql`
    subscription RoundChangedSubscription($gameId: ID!) {
        roundChanged(gameId: $gameId) {
            roundNumber
        }
    }
`
export const NEXT_ROUND_MUTATION = gql`
    mutation NextRoundMutation($round: RoundInput!, $gameId: ID!) {
        nextRound(round: $round, gameId: $gameId) 
    }
`