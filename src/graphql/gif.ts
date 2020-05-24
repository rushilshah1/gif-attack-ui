import gql from 'graphql-tag';
import { useMutation, useSubscription } from '@apollo/react-hooks';

export interface IGif {
    id: string
    gif?: any;
    gameId?: string
    userName?: string
    gifSearchText?: string
}

export const GIF_CREATED_SUBSCRIPTION = gql`
    subscription GifCreatedSubscription($gameId: ID!) {
        gifCreated(gameId: $gameId) {
            gif,
            userName,
            gifSearchText
        }
    }
`
export const CREATE_GIF_MUTATION = gql`
    mutation CreateGif($input: GifInput!) {
        createGif(input: $input) {
            gif
        }
    }
`
export const GIF_VOTED_SUBSCRIPTION = gql`
    subscription GifVotedSubscription($gameId: ID!) {
        gifVoteAdded(gameId: $gameId) {
            id
        }
    }
`
export const VOTE_GIF_MUTATION = gql`
    mutation VoteGif($input: GifInput!) {
        votedForGif(input: $input) {
            id
        }
    }
`


export type gifReceived = (gif: IGif) => void;
