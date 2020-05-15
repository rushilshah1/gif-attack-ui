import { useEffect } from 'react';
import { apolloClient } from './apollo-client';
import gql from 'graphql-tag';
import { ITopic } from '../topic/Topic';

const topicSubscription = gql`
    subscription TopicSubscription($gameId: String!) {
        topicCreated(gameId: $gameId) {
            text
        }
    }
`

const submitTopicMutation = gql`
    mutation SubmitTopic($input: TopicInput!) {
        createTopic(input: $input) {
            text
        }
    }
`

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