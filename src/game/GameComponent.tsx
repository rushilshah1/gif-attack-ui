import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { Redirect } from "react-router-dom";
// Model Components
import { User } from '../models/User';
import { Lobby } from '../lobby/Lobby';
import { Round } from '../round/Round';
import { IGame, IGameVars, IGameData, Game } from '../models/Game';
import { Scoreboard } from '../scoreboard/Scoreboard';
import { RoundResult } from '../round/RoundResult';
import { SubmittedGif, IGif } from '../models/SubmittedGif';
// UI + CSS
import { Grid, CircularProgress, Fab, withStyles, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './GameComponent.css';
// Graphql + Apollo
import { useMutation, useSubscription, useQuery } from '@apollo/react-hooks';
import { NEW_ROUND_MUTATION, IRound } from '../graphql/round';
import { START_GAME_MUTATION, GAME_STATE_CHANGED_SUBSCRIPTION, GET_GAME_BY_ID_QUERY_HOOK } from '../graphql/game';
import { createRemoveUserPayload } from '../graphql/user';
// constants
import ENVIRONMENT from '../common/environments';
import { LOCAL_STORAGE_USER_NAME, LOCAL_STORAGE_USER_ID } from '../common/constants';

export interface IGameComponentProps {
    gameId: string
}

export const GameComponent: React.FC<IGameComponentProps> = props => {
    /*Retrieve info needed to enter a game */
    let params: IGameComponentProps = useParams();
    const localStorageUserName: string | null = localStorage.getItem(LOCAL_STORAGE_USER_NAME)
    const localStorageUserId: string | null = localStorage.getItem(LOCAL_STORAGE_USER_ID)
    /*State of user and game */
    const [currentUser, setCurrentUser] = useState<User>(
        localStorageUserName && localStorageUserId ? new User({ id: localStorageUserId, name: localStorageUserName, score: 0 }) : new User());
    const [currentGame, setCurrentGame] = useState<Game>(new Game());

    /*Apollo Hooks */
    const [gameStatusStarted, gameStatusStartedResult] = useMutation(START_GAME_MUTATION);
    const [startNextRound, startNextRoundResult] = useMutation(NEW_ROUND_MUTATION);

    const gameState = useQuery<IGameData, IGameVars>(GET_GAME_BY_ID_QUERY_HOOK, {
        variables: { gameId: params.gameId }, onCompleted: async (response) => {
            gameStateChanged(response.getGameById);
        }
    })
    const gameStateChangedSubscription = useSubscription(GAME_STATE_CHANGED_SUBSCRIPTION, {
        variables: { gameId: currentGame.id },
        onSubscriptionData: (response) => {
            gameStateChanged(response.subscriptionData.data.gameStateChanged)
        }
    });

    /** Remove user from game if they leave/close the screen. TODO: Handle tab close bug */
    useEffect(() => {
        window.addEventListener("unload", leaveGame);
        return () => {
            window.removeEventListener("unload", leaveGame);
        }
    });

    const leaveGame = async (event) => {
        event.preventDefault();
        const leaveGamePayload = createRemoveUserPayload(currentUser, currentGame.id);
        let blob = new Blob([leaveGamePayload], { type: 'application/json;charset=UTF-8' })
        navigator.sendBeacon(ENVIRONMENT.API_ENDPOINT, blob);
    };

    /** Captures any change in game state*/
    const gameStateChanged = async (updatedGame: IGame) => {
        if (updatedGame.submittedGifs) {
            updatedGame.submittedGifs = updatedGame.submittedGifs.map((rawGif: IGif) => new SubmittedGif(rawGif));
        }
        setCurrentGame(prevGame => updatedGame);
    }

    /** Start Game */
    const startGame = async () => {
        //Mutation to change game status and start new round. Will change game state twice
        await gameStatusStarted({ variables: { gameId: currentGame.id } })
        await startNewRound();
    }

    /** New Round */
    const startNewRound = async () => {
        const changeRoundInput: IRound = { roundNumber: currentGame.roundNumber + 1, roundActive: true };
        await startNextRound({ variables: { round: changeRoundInput, gameId: currentGame.id } });
    };

    if (!currentGame.id) {
        return <CircularProgress />
    }
    //TODO: Fix this
    // if (!localStorageUserName || !localStorageUserId) {
    //     return <Redirect to={'/home'} />
    // }
    return (
        <div>
            {currentGame.roundNumber > 0 &&
                <Grid container justify="center" alignItems="center" spacing={0} >
                    <Grid item>
                        <a href="/">
                            <img className="small-logo" src={require('./../assets/logo.png')} />
                        </a>
                        <Divider />
                    </Grid>

                </Grid>}
            <Grid container direction="row" justify="center" alignItems="flex-start" spacing={1}>
                <Grid item md={2}>
                    <Grid container justify="center">
                        <Grid item>
                            <Scoreboard players={currentGame.users}></Scoreboard>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item md={10}>
                    {currentGame.roundNumber === 0 &&
                        <Lobby gameId={currentGame.id} players={currentGame.users} startGame={() => startGame()} />
                    }

                    {currentGame.roundNumber > 0 &&
                        (currentGame.roundActive ?
                            <Round player={currentUser} currentGame={currentGame} /> :
                            <RoundResult currentGame={currentGame} submittedGifs={currentGame.submittedGifs} players={currentGame.users} startNewRound={() => startNewRound()} />
                        )}
                </Grid>
            </Grid>
        </div>
    )
}
