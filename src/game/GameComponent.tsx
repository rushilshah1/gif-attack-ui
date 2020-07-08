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
import { Grid, CircularProgress, makeStyles, Theme, createStyles, Hidden } from '@material-ui/core';
import './GameComponent.scss';
// Graphql + Apollo
import { useMutation, useSubscription, useQuery } from '@apollo/react-hooks';
import { NEW_ROUND_MUTATION, IRound } from '../graphql/round';
import { START_GAME_MUTATION, GAME_STATE_CHANGED_SUBSCRIPTION, GET_GAME_BY_ID_QUERY_HOOK } from '../graphql/game';
import { createRemoveUserPayload } from '../graphql/user';
// constants
import ENVIRONMENT from '../common/environments';
import { LOCAL_STORAGE_USER_NAME, LOCAL_STORAGE_USER_ID } from '../common/constants';
import { defaultSettings } from '../models/Settings';
import { GameDetails } from './GameDetails';

export interface IGameComponentProps {
    gameId: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            overflowX: "auto",
            padding: "2%"
        },
        noOverflow: {
            overflowX: "hidden",

        }

    }),
);

export const GameComponent: React.FC<IGameComponentProps> = props => {
    const classes = useStyles();
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

    /*
    useEffect(() => {
        window.addEventListener("unload", leaveGame);
        return () => {
            window.removeEventListener("unload", leaveGame);
        }
    });
    */
    const leaveGame = async (event) => {
        event.preventDefault();
        localStorage.removeItem(LOCAL_STORAGE_USER_NAME);
        localStorage.removeItem(LOCAL_STORAGE_USER_ID);
        const leaveGamePayload = createRemoveUserPayload(currentUser, currentGame.id);
        let blob = new Blob([leaveGamePayload], { type: 'application/json;charset=UTF-8' })
        navigator.sendBeacon(ENVIRONMENT.API_ENDPOINT, blob);
    };

    /** Captures any change in game state*/
    const gameStateChanged = async (updatedGame: IGame) => {
        if (updatedGame.submittedGifs) {
            updatedGame.submittedGifs = updatedGame.submittedGifs.map((rawGif: IGif) => new SubmittedGif(rawGif));
        }
        //For now, settings will always be the default settings.
        //As the game evolves and more settings are required, this will move over to the backend as well with configurable settings controlled on game creation
        setCurrentGame(prevGame => {
            return { ...updatedGame, settings: defaultSettings }
        });
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
    return (
        <Grid container direction="row" alignItems="flex-start" className={classes.root} spacing={1}>
            <Hidden smDown>
                <Grid item md={3} >
                    <Grid container >
                        <Grid item>
                            <Scoreboard players={currentGame.users} submittedGifs={currentGame.submittedGifs}></Scoreboard>
                        </Grid>
                    </Grid>
                </Grid>
            </Hidden>
            <Grid item xs={12} md={6}>
                {currentGame.roundNumber === 0 &&
                    <Lobby gameId={currentGame.id} players={currentGame.users} startGame={() => startGame()} />
                }

                {currentGame.roundNumber > 0 &&
                    (currentGame.roundActive ?
                        <Round player={currentUser} currentGame={currentGame} /> :
                        <RoundResult submittedGifs={currentGame.submittedGifs} players={currentGame.users} startNewRound={() => startNewRound()} />
                    )}
            </Grid>
            <Grid item xs={12} md={3}>
                <GameDetails currentGame={currentGame}></GameDetails>
            </Grid>
            <Hidden mdUp>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Grid item>
                            <Scoreboard players={currentGame.users} submittedGifs={currentGame.submittedGifs}></Scoreboard>
                        </Grid>
                    </Grid>
                </Grid>
            </Hidden>
        </Grid>
    )
}
