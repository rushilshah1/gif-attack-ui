import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, withStyles, Divider, Typography, CardMedia } from '@material-ui/core';
import { ApolloProvider } from '@apollo/react-hooks';
import { apolloClient } from './graphql/apollo-client';
import { GameComponent } from './game/GameComponent';
import { Home } from './home/Home';
import { Router, BrowserRouter, Route, Redirect, useHistory } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import HomeIcon from '@material-ui/icons/Home';
import { gameGuard } from './guards/game.guard';
import { createMuiTheme, MuiThemeProvider, makeStyles } from '@material-ui/core/styles';

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
// const StyledHomeIcon = withStyles({
//   root: {
//     fontSize: "50px",
//     margin: "10px",
//     width: 'auto',
//     textAlign: 'left',
//     display: 'inline-block',
//     // color: 'blue'

//   }
// })(HomeIcon);

const TitleDivider = withStyles({
  root: {
    marginTop: '-1%',
    marginBottom: '1%'
  }
})(Divider);

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});


function App() {
  const classes = useStyles();

  return (

    <ApolloProvider client={apolloClient}>
      <div className="App">

        <MuiThemeProvider theme={theme}>
          <BrowserRouter>
            {/* <GuardProvider guards={[gameGuard]}> */}
            <div className="header">

              <a href="/" className="homeButton" >
                <img src={require('./assets/logo.png')} alt="logo" width="100" height="100" />
                {/* <StyledHomeIcon color="primary" /> */}
              </a>
              {/* <Typography variant="h2" className="title">Gif Attack</Typography> */}
              {/* <h2 className="title">Gif Attack</h2> */}
            </div>
            {/* <TitleDivider /> */}
            <Route exact path="/home" component={Home}></Route>
            <Route exact path="/game/:gameId" component={GameComponent}></Route>
            <Route path="/" render={() => <Redirect to="/home" />} />
            {/* </GuardProvider> */}
          </BrowserRouter>
        </MuiThemeProvider>
      </div>
    </ApolloProvider>
  );
}

export default App;
