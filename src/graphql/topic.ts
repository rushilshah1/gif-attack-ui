import { useEffect } from 'react';
import { apolloClient } from './apollo-client';
import gql from 'graphql-tag';

export const TOPIC_CHANGED_SUBSCRIPTION = gql`
    subscription TopicChangedSubscription($gameId: ID!) {
        topicChanged(gameId: $gameId) {
            topic
        }
    }
`

export const UPDATE_TOPIC_MUTATION = gql`
    mutation UpdateTopic($topicInput: TopicInput!, $gameId: ID!) {
        updateTopic(topicInput: $topicInput, gameId: $gameId)
    }
`
export const REMOVE_TOPIC_MUTATION = gql`
    mutation RemoveTopic($gameId: ID!) {
        removeTopic(gameId: $gameId)
    }
`
export interface ITopic {
    topic: string
};

/*
export type topicReceived = (topic: ITopic) => void


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