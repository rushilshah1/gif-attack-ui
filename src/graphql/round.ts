import gql from 'graphql-tag';

export interface IRound {
    roundNumber?: number;
    roundActive?: boolean;
}

export const ROUND_CHANGED_SUBSCRIPTION = gql`
    subscription RoundChangedSubscription($gameId: ID!) {
        roundChanged(gameId: $gameId) {
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