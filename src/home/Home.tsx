import React, { useState, useEffect } from 'react';
import './Home.css';
import { TextField, Button, RadioGroup, FormControlLabel, FormLabel, Radio, CircularProgress, withStyles, Divider, Container, Grid, Typography } from '@material-ui/core';
import { useForm } from "react-hook-form";
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import { CREATE_GAME_MUTATION, getGameById } from '../graphql/game';
import { Redirect } from "react-router-dom";
import { CREATE_GAME, JOIN_GAME, LOCAL_STORAGE_USER_ID, LOCAL_STORAGE_USER_NAME } from '../common/constants';
import { User, IUser } from '../models/User';
import { ADD_USER_MUTATION } from '../graphql/user';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  alignItemsAndJustifyContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  formTextField: {
    width: 275,
  }
}));

export const Home: React.FC = props => {
  const [username, setUsername] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [gameType, setGameType] = useState<string>('');
  const [userInputGameId, setUserInputGameId] = useState<string>('');
  const [gameId, setGameId] = useState<string>('');
  const { handleSubmit, register, errors, setError, clearError } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit' });
  const [createGame, createGameResult] = useMutation(CREATE_GAME_MUTATION);
  const [addUserToGame, addUserToGameResult] = useMutation(ADD_USER_MUTATION);

  useEffect(() => {
    //Remove user, Home page should not have an assigned user till form has been submitted
    localStorage.removeItem(LOCAL_STORAGE_USER_NAME);
    localStorage.removeItem(LOCAL_STORAGE_USER_ID);
  }, []);
  const onSubmit = async (formValues) => {
    console.log(`Form has been submitted ${formValues}`)
    if (gameType === CREATE_GAME) {
      await createNewGame(formValues.name);
    }
    else if (gameType === JOIN_GAME) {
      const isValid: boolean = await validateGameId(formValues.userInputGameId);
      if (!isValid) {
        return;
      }
      await joinGame(formValues.name, formValues.userInputGameId);
    }
    else {
      console.error("Game Type has not been set but form has been submitted");
    }
  };

  const createNewGame = async (name: string) => {
    const gameResult = await createGame();
    const gameId: string = gameResult.data.createGame.id
    const result = await addUserToGame({ variables: { user: { name: name }, gameId: gameId } });
    const user: User | undefined = result.data ? result.data.addUser : undefined;
    setCurrentUser(user);
    setGameId(gameId);
  };

  const validateGameId = async (userInputGameId: string): Promise<boolean> => {
    const game = await getGameById(userInputGameId);
    if (!game) {
      setError("userInputGameId", "invalidId", "Game ID is not valid")
      return false;
    }
    return true;
  }
  const joinGame = async (name: string, gameId: string) => {
    const result = await addUserToGame({ variables: { user: { name: name }, gameId: gameId } })
    const user: User | undefined = result.data ? result.data.addUser : undefined;
    setCurrentUser(user);
    setGameId(gameId);
  };
  const toggleGameType = (gameType: string) => {
    if (gameType === CREATE_GAME) {
      clearError();
      setGameId('');
    }
    setGameType(gameType);
  }

  const classes = useStyles();

  if (gameId && currentUser) {
    localStorage.setItem(LOCAL_STORAGE_USER_NAME, currentUser.name);
    localStorage.setItem(LOCAL_STORAGE_USER_ID, currentUser.id);
    return <Redirect to={`/game/${gameId}`} />
  }
  return (
    <div>
      <Container className={classes.root}>
        <Grid container className="logo-spacing" justify="center" alignItems="center" >
          <a href="/">
            <img className="logo" src={require('./../assets/logo.png')} />
          </a>
        </Grid>

        <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
          <Grid item lg={6} className="home-button-spacing">
            <Button variant="contained" color={gameType === JOIN_GAME ? "default" : "primary"} className="home-button" onClick={() => toggleGameType(CREATE_GAME)}>Create Game</Button>
          </Grid>

          <Grid item lg={6} className="home-button-spacing">
            <Button variant="contained" color={gameType === CREATE_GAME ? "default" : "primary"} className="home-button" onClick={() => toggleGameType(JOIN_GAME)}>Join Game</Button>
          </Grid>
        </Grid>


        <form onSubmit={handleSubmit(onSubmit)} className="home-form">
          <Grid container direction="column" justify="center" alignItems="center" spacing={3}>
            {(gameType !== '') &&
              <Grid item className="home-button-spacing">
                <TextField required size="small" className={classes.formTextField} label="Name" name="name" variant="outlined" error={errors.name} onChange={(e) => setUsername(e.target.value)} inputRef={register({ required: true })} color="secondary" />
              </Grid>
            }
            {gameType === JOIN_GAME &&
              <Grid item className="home-button-spacing">
                <TextField required size="small" className={classes.formTextField} name="userInputGameId" label="Game ID" error={errors.gameId}
                  onChange={(e) => { clearError(); setUserInputGameId(e.target.value) }}
                  variant="outlined"
                  inputRef={register({ required: true })}
                  color="secondary" />
              </Grid>
            }
            {errors.userInputGameId &&
              <Grid item className="home-button-spacing">
                <Typography className="error">{errors.userInputGameId.message}</Typography>
              </Grid>
            }
            {gameType !== '' &&
              <Grid item className="home-button-spacing">
                <Button type="submit" variant="contained" color="primary" className="home-button">
                  Submit <img src={require('../assets/dagger.png')} alt="logo" height="20"></img>
                </Button>
              </Grid>
            }
          </Grid>
        </form>
      </Container>
    </div >
  )
}
