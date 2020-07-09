import React from 'react';

// Apollo
import { ApolloProvider } from '@apollo/react-hooks';
import { apolloClient } from './graphql/apollo-client';
// Router
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
// Components
import { GameContainer } from './game/GameContainer';
import { Home } from './home/Home';
// UI + CSS
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import './App.scss';


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
    fontFamily: 'BlinkMacSystemFont',
  }
})

function App() {
  return (
    <ApolloProvider client={apolloClient}>

      <div className="App">
        <MuiThemeProvider theme={theme}>
          <BrowserRouter>
            <Route exact path="/home" component={Home}></Route>
            <Route exact path="/game/:gameId" component={GameContainer}></Route>
            <Route path="/" render={() => <Redirect to="/home" />} />
          </BrowserRouter>
        </MuiThemeProvider>
      </div>
    </ApolloProvider>
  );
}

export default App;
