import React, { useState, useEffect } from 'react';
import './Home.css';
import { Input, FormControl, InputLabel, TextField, Button, RadioGroup, FormControlLabel, FormLabel, Radio, CircularProgress, withStyles, Divider, Container, Grid } from '@material-ui/core';
import { useForm, Controller } from "react-hook-form";
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import { CREATE_GAME_MUTATION, ADD_USER_TO_GAME_MUTATION, GET_GAMES_QUERY, IGame, GET_GAMES_BY_ID_QUERY } from '../graphql/game';
import { Redirect } from "react-router-dom";
import { CREATE_GAME, JOIN_GAME, LOCAL_STORAGE_USER } from '../common/constants';
import { getQuery } from '../graphql/api-client';
import { Timer } from '../round/Timer';



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
        // display: 'inline-block',
        padding: '10px',
        alignContent: 'stretch',
        textAlign: 'center',
        justifyContent: 'normal',
        marginTop: '25px',

        // width: '50%'
    }
})(Button);

const NameInput = withStyles({
    root: {

        width: "200px",
        // minWidth: "200px",
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
    const [gameType, setGameType] = useState<string>(CREATE_GAME);
    const [userInputGameId, setUserInputGameId] = useState<string>('');
    const [gameId, setGameId] = useState<string>('');
    const [createGame, createGameResult] = useMutation(CREATE_GAME_MUTATION);
    const [addUserToGame, addUserToGameResult] = useMutation(ADD_USER_TO_GAME_MUTATION);
    const { handleSubmit, register, errors, setError, clearError } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit' });


    const onSubmit = async (formValues) => {
        console.log(`Form has been submitted ${formValues}`)
        if (gameType === CREATE_GAME) {
            await startGame(formValues.name);
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

    const startGame = async (name: string) => {
        const game = await createGame({ variables: { userName: name } });
        setGameId(game.data.createGame.id);
        console.log(`Game ${gameId} has been created`);
    };

    const validateGameId = async (userInputGameId: string): Promise<boolean> => {
        try {
            const response = await getQuery(GET_GAMES_BY_ID_QUERY(userInputGameId));
            const gameHasStarted: boolean = response.getGameById.started;
            if (gameHasStarted) {
                setError("userInputGameId", "startedGame", "Game ID has already started and cannot be joined")
            }
            return !gameHasStarted;
        } catch (error) { //If id does not exist
            setError("userInputGameId", "invalidId", "Game ID is not valid")
            return false;
        }

        // const gamesList: Array<IGame> = data.getGames;
        // const gameFound = gamesList.find(game => game.id === value && game.started === false);
        // return (gameFound) ? true : false;

    }
    const joinGame = async (name: string, gameId: string) => {
        await addUserToGame({ variables: { input: { gameId: gameId, name: name } } })
        setGameId(gameId)
    };
    const toggleGameType = (gameType: string) => {
        if (gameType === CREATE_GAME) {
            clearError(); //clear error
            setGameId('') //reset gameID
        }
        setGameType(gameType);
    }

    if (gameId) {
        localStorage.setItem(LOCAL_STORAGE_USER, username);
        console.log('Game created, redirecting...')
        return <Redirect to={`/game/${gameId}`} />
    }
    // if (loading) {
    //     return <CircularProgress />
    // }
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
//, validate: validateGameId