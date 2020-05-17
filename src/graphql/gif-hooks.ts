import { useEffect } from 'react';
import { apolloClient } from './apollo-client';
import gql from 'graphql-tag';
import { useMutation, useSubscription } from '@apollo/react-hooks';

export type IGif = {
    gameId?: string,
    id?: string,
    gif?: string
}

export const GIF_CREATED_SUBSCRIPTION = gql`
    subscription GifCreatedSubscription($gameId: String!) {
        gifCreated(gameId: $gameId) {
            gif
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

export type gifReceived = (gif: IGif) => void;

export const useGif = (gameId: string, gif: string) => {
    const mutationInput = { gameId: gameId, gif: gif }
    const [createGif, createGifResult] = useMutation(CREATE_GIF_MUTATION, { variables: { input: mutationInput } });
    const { data, loading } = useSubscription(GIF_CREATED_SUBSCRIPTION, { variables: { gameId } });
}