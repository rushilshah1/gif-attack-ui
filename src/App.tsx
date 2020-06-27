import React from 'react';

// Apollo
import { ApolloProvider } from '@apollo/react-hooks';
import { apolloClient } from './graphql/apollo-client';

// Router
import { Router, BrowserRouter, Route, Redirect, useHistory } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import { gameGuard } from './guards/game.guard';

// Components
import { GameComponent } from './game/GameComponent';
import { Home } from './home/Home';

// UI + CSS
import { createMuiTheme, MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import { Container, withStyles, Divider, Typography, CardMedia, Grid } from '@material-ui/core';
import './App.css';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#14AFF2',
      contrastText: 'white'
    },
    secondary: {
      main: '#FFC000'
    },

  },
  typography: {
    button: {
      fontFamily: 'BlinkMacSystemFont',
    },
    fontFamily: 'BlinkMacSystemFont'
  }
})

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <MuiThemeProvider theme={theme}>
          <BrowserRouter>
            <Container fixed>
              <Route exact path="/home" component={Home}></Route>
              <Route exact path="/game/:gameId" component={GameComponent}></Route>
              <Route path="/" render={() => <Redirect to="/home" />} />
            </Container>
          </BrowserRouter>
        </MuiThemeProvider>
      </div>
    </ApolloProvider>
  );
}

export default App;
