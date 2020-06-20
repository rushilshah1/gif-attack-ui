import React, { useState, useEffect } from 'react';
import './Home.css';
import { Input, FormControl, InputLabel, TextField, Button, RadioGroup, FormControlLabel, FormLabel, Radio, CircularProgress, withStyles, Divider, Container, Grid } from '@material-ui/core';
import { useForm, Controller } from "react-hook-form";
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import { CREATE_GAME_MUTATION, ADD_USER_MUTATION, getGameById } from '../graphql/game';
import { Redirect } from "react-router-dom";
import { CREATE_GAME, JOIN_GAME, LOCAL_STORAGE_USER_ID, LOCAL_STORAGE_USER_NAME } from '../common/constants';
import { getQuery } from '../graphql/api-client';
import { Timer } from '../round/Timer';
import { User, IUser } from '../models/User';



const GameSelection = withStyles({
    root: {
        padding: "10px",
        textAlign: 'center',
        alignContent: 'center'

    }
})(RadioGroup);


const SubmitButton = withStyles({
    root: {
        display: 'block',
        padding: '10px',
        alignContent: 'stretch',
        textAlign: 'center',
        justifyContent: 'normal',
        marginTop: '25px',

    }
})(Button);

const NameInput = withStyles({
    root: {
        width: "200px",
        alignContent: 'center',
        textAlign: 'center',
        marginTop: '25px',
        display: 'flex',
    }
})(TextField);

const StyledContainer = withStyles({
    root: {
        textAlign: 'center'
    }
})(Container);

export const Home: React.FC = props => {
    const [username, setUsername] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
    const [gameType, setGameType] = useState<string>(CREATE_GAME);
    const [userInputGameId, setUserInputGameId] = useState<string>('');
    const [gameId, setGameId] = useState<string>('');
    const { handleSubmit, register, errors, setError, clearError } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit' });

    const [createGame, createGameResult] = useMutation(CREATE_GAME_MUTATION);
    const [addUserToGame, addUserToGameResult] = useMutation<any, any>(ADD_USER_MUTATION);

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
            await joinGame(formValues.name, formValues.userInputGameId)

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
        console.log(`Game ${gameId} has been created`);
        setCurrentUser(user);
        setGameId(gameId);

    };

    const validateGameId = async (userInputGameId: string): Promise<boolean> => {
        const game = await getGameById(userInputGameId);
        if (!game) {
            setError("userInputGameId", "invalidId", "Game ID is not valid")
            return false;
        }
        const gameHasStarted: boolean = game.gameStarted;
        if (gameHasStarted) {
            setError("userInputGameId", "startedGame", "Game ID has already started and cannot be joined")
        }
        return !gameHasStarted;
    }
    const joinGame = async (name: string, gameId: string) => {
        const result = await addUserToGame({ variables: { user: { name: name }, gameId: gameId } })
        const user: User | undefined = result.data ? result.data.addUser : undefined;
        setCurrentUser(user);
        setGameId(gameId);
    };
    const toggleGameType = (gameType: string) => {
        if (gameType === CREATE_GAME) {
            clearError(); //clear error
            setGameId('') //reset gameID
        }
        setGameType(gameType);
    }

    if (gameId && currentUser) {
        localStorage.setItem(LOCAL_STORAGE_USER_NAME, currentUser.name);
        localStorage.setItem(LOCAL_STORAGE_USER_ID, currentUser.id);
        console.log('Game created, redirecting...')
        return <Redirect to={`/game/${gameId}`} />
    }
    return (
        <div className="title">
            {/* Welcome to Gif Attack!
            <TitleDivider /> */}
            <Container>
                <GameSelection aria-label="gameType" name="gameType" value={gameType} onChange={(e) => toggleGameType(e.target.value)}>
                    <FormControlLabel value={CREATE_GAME} control={<Radio />} label="Create Game"></FormControlLabel>
                    <FormControlLabel value={JOIN_GAME} control={<Radio />} label="Join Game"></FormControlLabel>
                </GameSelection>

                <Grid container justify="center" alignContent='center'>
                    <form onSubmit={handleSubmit(onSubmit)} className="gameForm">

                        <NameInput required name="name" label="Name" error={errors.name} onChange={(e) => setUsername(e.target.value)} inputRef={register({ required: true })}> </NameInput>

                        {gameType === JOIN_GAME &&

                            <NameInput required name="userInputGameId" label="Game ID" error={errors.gameId}
                                onChange={(e) => {
                                    clearError();
                                    setUserInputGameId(e.target.value)
                                }} inputRef={register({ required: true })} > </NameInput>
                        }
                        {errors.userInputGameId && <p className="error">{errors.userInputGameId.message}</p>}

                        <SubmitButton type="submit" variant="contained" color="primary">{gameType}</SubmitButton>
                    </form>
                </Grid>
            </Container>
        </div >
    )
}
