import { useEffect } from 'react';
import { apolloClient } from './apollo-client';
import gql from 'graphql-tag';


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
