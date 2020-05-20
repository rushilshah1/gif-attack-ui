import React, { useState, useEffect } from 'react';
import './Home.css';
import { Input, FormControl, InputLabel, TextField, Button, RadioGroup, FormControlLabel, FormLabel, Radio } from '@material-ui/core';
import { useForm, Controller } from "react-hook-form";
import { useMutation } from '@apollo/react-hooks';
import { CREATE_GAME_MUTATION, ADD_USER_TO_GAME_MUTATION } from '../graphql/game';
import { Redirect } from "react-router-dom";
import { CREATE_GAME, JOIN_GAME, LOCAL_STORAGE_USER } from '../common/constants';


export const Home: React.FC = props => {
    const [username, setUsername] = useState<string>('');
    const [gameType, setGameType] = useState<string>(CREATE_GAME);
    const [userInputGameId, setUserInputGameId] = useState<string>('');
    const [gameId, setGameId] = useState<string>('');
    const [createGame, createGameResult] = useMutation(CREATE_GAME_MUTATION);
    const [addUserToGame, addUserToGameResult] = useMutation(ADD_USER_TO_GAME_MUTATION);
    const { handleSubmit, register, errors } = useForm();

    const onSubmit = async (formValues) => {
        console.log(`Form has been submitted ${formValues}`)
        if (gameType === CREATE_GAME) {
            await startGame(formValues.name);
        }
        else if (gameType === JOIN_GAME) {
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

    const joinGame = async (name: string, gameId: string) => {
        await addUserToGame({ variables: { input: { gameId: gameId, name: name } } })
        setGameId(gameId)
    };
    const toggleGameType = (gameType: string) => {
        if (gameType === CREATE_GAME) {
            setGameId('') //reset gameID
        }
        setGameType(gameType);
    }

    if (gameId) {
        localStorage.setItem(LOCAL_STORAGE_USER, username);
        console.log('Game created, redirecting...')
        return <Redirect to={`/game/${gameId}`} />
    }
    return (
        <div className="title">
            Welcome to Gif Attack!
            {/* <FormLabel component="legend">Game Type</FormLabel> */}
            <RadioGroup className="gameType" aria-label="gameType" name="gameType" value={gameType} onChange={(e) => toggleGameType(e.target.value)}>
                <FormControlLabel value={CREATE_GAME} control={<Radio />} label="Create Game"></FormControlLabel>
                <FormControlLabel value={JOIN_GAME} control={<Radio />} label="Join Game"></FormControlLabel>
            </RadioGroup>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField required name="name" label="Name" error={errors.name} onChange={(e) => setUsername(e.target.value)} inputRef={register({ required: true })}> </TextField>
                {gameType === JOIN_GAME && <TextField required name="userInputGameId" label="Game ID" error={errors.gameId} onChange={(e) => setUserInputGameId(e.target.value)} inputRef={register({ required: true })}> </TextField>}

                <Button type="submit" color="primary">{gameType}</Button>
            </form>
        </div >
    )
}
