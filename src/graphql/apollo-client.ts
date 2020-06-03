import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-boost';
import ENVIRONMENT from '../common/environments';
import { setContext } from 'apollo-link-context';
import { LOCAL_STORAGE_USER } from '../common/constants';
import { SubscriptionClient } from 'subscriptions-transport-ws';


// Create an http link:
const httpLink = new HttpLink({
    uri: ENVIRONMENT.API_ENDPOINT
});
// Create a WebSocket link:
const wsLink = new WebSocketLink({
    uri: ENVIRONMENT.WS_ENDPOINT,
    options: {
        reconnect: true,
        connectionParams: () => ({
            user: localStorage.getItem(LOCAL_STORAGE_USER) ? localStorage.getItem(LOCAL_STORAGE_USER) : ''
        }),
        lazy: true
    },
});
// const wsClient = new SubscriptionClient(ENVIRONMENT.WS_ENDPOINT, {
//     reconnect: true
// });
// wsClient.use([
//     {
//         applyMiddleware(options, next) {
//             options.user = localStorage.getItem(LOCAL_STORAGE_USER) ? localStorage.getItem(LOCAL_STORAGE_USER) : ''
//             console.log(`WS user ${options.user}`);
//             next()
//         }
//     }
// ])
// const wsLink = new WebSocketLink(wsClient);

// wsLink.subscriptionClient.use([subscriptionMiddleware]);
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

/**
 * For now simply sending user name in header so server can understand who is making the requests,
 * and more importantly when a user has unsubscribed (exited) the game.
 */
const authLink = setContext((_, { headers, connectionParams }) => {
    const user = localStorage.getItem(LOCAL_STORAGE_USER);
    return {
        headers: {
            ...headers,
            authorization: user ? user : ""
        }
    }
});
export const apolloClient = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, apiLink]),
    cache: new InMemoryCache(),
});
