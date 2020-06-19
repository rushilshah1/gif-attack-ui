import gql from 'graphql-tag';
import { useMutation, useSubscription } from '@apollo/react-hooks';


export const GIF_CHANGED_SUBSCRIPTION = gql`
    subscription GifChangedSubscription($gameId: ID!) {
        gifChanged(gameId: $gameId) {
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
export const CREATE_GIF_MUTATION = gql`
    mutation CreateGif($gif: AddGifInput!, $gameId: ID!) {
        createGif(gif: $gif, gameId: $gameId) {
            id
            gifId
            content
            userId
            gifSearchText
            numVotes
        }
    }
`
// export const GIF_VOTED_SUBSCRIPTION = gql`
//     subscription GifVotedSubscription($gameId: ID!) {
//         gifVoteAdded(gameId: $gameId) {
//             id
//         }
//     }
// `
export const REMOVE_GIF_MUTATION = gql`
    mutation RemoveGif($gif: ModifyGifInput!, $gameId: ID!) {
        removeGif(gif: $gif, gameId: $gameId) {
            id
            gifId
            content
            userId
            gifSearchText
            numVotes
        }
    }
`

export const UPDATE_GIF_MUTATION = gql`
    mutation UpdateGif($gif: ModifyGifInput!, $gameId: ID!) {
        updateGif(gif: $gif, gameId: $gameId) {
            id
            gifId
            content
            userId
            gifSearchText
            numVotes
        }
    }
`


// export type gifReceived = (gif: IGif) => void;
