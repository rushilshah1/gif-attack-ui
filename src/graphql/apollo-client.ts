import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-boost';
import ENVIRONMENT from '../common/environments';

// Create an http link:
const httpLink = new HttpLink({
    uri: ENVIRONMENT.API_ENDPOINT
});
// Create a WebSocket link:
const wsLink = new WebSocketLink({
    uri: ENVIRONMENT.WS_ENDPOINT,
    options: { reconnect: true }
});
// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const apiLink = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation ===
            'subscription';
    }, wsLink, httpLink);

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );

    if (networkError) console.log(`[Network error]: ${networkError}`);
})

export const apolloClient = new ApolloClient({
    link: ApolloLink.from([errorLink, apiLink]),
    cache: new InMemoryCache(),
});