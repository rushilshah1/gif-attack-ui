import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container } from '@material-ui/core';
import { ApolloProvider } from '@apollo/react-hooks';
import { apolloClient } from './graphql/apollo-client';
import { Game } from './game/Game';
import { Home } from './home/Home';
import { Router, BrowserRouter, Route } from 'react-router-dom';


function App() {
  return (
    <ApolloProvider client={apolloClient}>
      {/* <div className="App"> */}
      <BrowserRouter>
        <Container>
          <img src={logo} alt="Logo" className="App-logo" />
          <Route exact path="/" component={Home}></Route>
          {/* Implement guard on this route -> only navigate to it if valid gameId */}
          <Route exact path="/game/:gameId" component={Game}></Route>
        </Container>
      </BrowserRouter>

      {/* </div> */}
    </ApolloProvider>
  );
}

export default App;
