import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, withStyles, Divider, Typography } from '@material-ui/core';
import { ApolloProvider } from '@apollo/react-hooks';
import { apolloClient } from './graphql/apollo-client';
import { Game } from './game/Game';
import { Home } from './home/Home';
import { Router, BrowserRouter, Route, Redirect, useHistory } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';


const StyledHomeIcon = withStyles({
  root: {
    fontSize: "50px",
    margin: "10px",
    width: 'auto',
    textAlign: 'left',
    display: 'inline-block',
    color: 'blue'

  }
})(HomeIcon);

const StyledContainer = withStyles({
  root: {
    textAlign: 'center'
  }
})(Container);

const TitleDivider = withStyles({
  root: {
    marginTop: '-1%',
    marginBottom: '1%'
  }
})(Divider);

function App() {


  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <BrowserRouter>
          <div className="header">
            <a href="/" className="homeButton" >
              <StyledHomeIcon />
            </a>
            <h2 className="title">Gif Attack</h2>
          </div>
          <TitleDivider />
          {/* <StyledContainer> */}
          <Route exact path="/home" component={Home}></Route>
          {/* Implement guard on this route -> only navigate to it if valid gameId */}
          <Route exact path="/game/:gameId" component={Game}></Route>
          <Route exact path="/" render={() => <Redirect to="/home" />} />

          {/* </StyledContainer> */}
        </BrowserRouter>

      </div>
    </ApolloProvider>
  );
}

export default App;
