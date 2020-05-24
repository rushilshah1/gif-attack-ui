import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container } from '@material-ui/core';
import { ApolloProvider } from '@apollo/react-hooks';
import { apolloClient } from './graphql/apollo-client';
import { Game } from './game/Game';
import { Home } from './home/Home';
import { Router, BrowserRouter, Route, Redirect, useHistory } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
function App() {

  // const history = useHistory();

  return (
    <ApolloProvider client={apolloClient}>
      {/* <div className="App"> */}
      <BrowserRouter>
        <Container>
          <a href="/" className="valign-wrapper" onClick={(e) => { }}>
            <HomeIcon />
          </a>
          <Route exact path="/home" component={Home}></Route>
          {/* Implement guard on this route -> only navigate to it if valid gameId */}
          <Route exact path="/game/:gameId" component={Game}></Route>
          <Route exact path="/" render={() => <Redirect to="/home" />} />

        </Container>
      </BrowserRouter>

      {/* </div> */}
    </ApolloProvider>
  );
}

export default App;
