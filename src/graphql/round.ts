import gql from 'graphql-tag';

export interface IRound {
    roundNumber?: number;
    roundActive?: boolean;
}

export const ROUND_CLOCK_SUBSCRIPTION = gql`
    subscription RoundClockSubscription($gameId: ID!) {
        roundClock(gameId: $gameId) {
            minutes
            seconds
        }
    }
`
export const UPDATE_ROUND_STATUS_MUTATION = gql`
    mutation UpdateRoundStatusMutation($round: UpdateRoundInput!, $gameId: ID!) {
        updateRoundStatus(round: $round, gameId: $gameId) 
    }
`
export const NEW_ROUND_MUTATION = gql`
    mutation NewRoundMutation($round: NewRoundInput!, $gameId: ID!) {
        newRound(round: $round, gameId: $gameId) {
            roundNumber
            roundActive
        }
    }
`