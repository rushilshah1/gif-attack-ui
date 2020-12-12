import gql from 'graphql-tag';

export const CREATE_GIF_MUTATION = gql`
    mutation CreateGif($gif: AddGifInput!, $gameId: ID!, $userId: ID!) {
        createGif(gif: $gif, gameId: $gameId, userId: $userId) {
            id
            gifId
            content
            userId
            gifSearchText
            numVotes
            isWinner
        }
    }
`

export const REMOVE_GIF_MUTATION = gql`
    mutation RemoveGif($gif: ModifyGifInput!, $gameId: ID!) {
        removeGif(gif: $gif, gameId: $gameId) {
            id
            gifId
            content
            userId
            gifSearchText
            numVotes
            isWinner
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
            isWinner
        }
    }
`

export const VOTE_FOR_GIF_MUTATION = gql`
    mutation VoteForGif($gifId: ID!, $gameId: ID!, $userId: ID!) {
        voteForGif(gifId: $gifId, gameId: $gameId, userId: $userId) {
            id
            gifId
            content
            userId
            gifSearchText
            numVotes
            isWinner
        }
    }
`


