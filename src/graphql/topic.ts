import { useEffect } from 'react';
import { apolloClient } from './apollo-client';
import gql from 'graphql-tag';

export const TOPIC_CREATED_SUBSCRIPTION = gql`
    subscription TopicSubscription($gameId: ID!) {
        topicCreated(gameId: $gameId) {
            text
        }
    }
`

export const SUBMIT_TOPIC_MUTATION = gql`
    mutation SubmitTopic($input: TopicInput!) {
        createTopic(input: $input) {
            text
        }
    }
`
export interface ITopic {
    gameId: string,
    text: string
};


export type topicReceived = (topic: ITopic) => void

/*
export const subscribeToTopic = (gameId: string, topicReceived: topicReceived) => {
    return apolloClient.subscribe({
        query: topicSubscription,
        variables: { gameId }
    }).subscribe({
        next(response) {
            topicReceived(response.data.topicCreated);
        }
    })
}

export const submitTopic = (gameId: string, topic: string) => {
    const topicInput = { gameId: gameId, text: topic }
    return apolloClient.mutate({
        mutation: submitTopicMutation,
        variables: { input: topicInput }
    });
}

export const useTopic = (gameId: string, topicReceived: topicReceived) => {
    useEffect(() => {
        const observer = subscribeToTopic(gameId, topicReceived);
        return () => observer.unsubscribe();
    });
    return ((topic: string) => submitTopic(gameId, topic))
}
*/