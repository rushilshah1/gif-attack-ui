import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Game } from './game/Game';
import { Container } from '@material-ui/core';
import { ApolloProvider } from '@apollo/react-hooks';
import { apolloClient } from './graphql/apollo-client';


function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <Container>
          <div className="App-title">
            Welcome to Gif Attack
      </div>
          <Game />
        </Container>
      </div>
    </ApolloProvider>
  );
}

export default App;
