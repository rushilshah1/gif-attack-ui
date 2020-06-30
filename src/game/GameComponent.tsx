import React, { useState, useEffect } from 'react'
import { Round } from '../round/Round'
import { Container, CircularProgress, withStyles } from '@material-ui/core';
import { RoundResult } from '../round/RoundResult';
import { SubmittedGif, IGif } from '../models/SubmittedGif';
import { useMutation, useSubscription, useQuery } from '@apollo/react-hooks';
import { NEW_ROUND_MUTATION, IRound } from '../graphql/round';
import { useParams } from "react-router-dom";
import { LOCAL_STORAGE_USER_NAME, LOCAL_STORAGE_USER_ID } from '../common/constants';
import { START_GAME_MUTATION, GAME_STATE_CHANGED_SUBSCRIPTION, GET_GAME_BY_ID_QUERY_HOOK } from '../graphql/game';
import { Lobby } from '../lobby/Lobby';
import './GameComponent.css';
import { Scoreboard } from '../scoreboard/Scoreboard';
import { User } from '../models/User';
import { IGame, IGameVars, IGameData, Game } from '../models/Game';
import { REMOVE_USER_MUTATION } from '../graphql/user';
import { Redirect } from "react-router-dom";


export interface IGameComponentProps {
    gameId: string
}

const StyledContainer = withStyles({
    root: {
        textAlign: 'center',
        minWidth: '85%',
        justifyContent: 'center'
    }
})(Container);

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
    const [removeUser, removeUserResult] = useMutation(REMOVE_USER_MUTATION);

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
        window.addEventListener("beforeunload", leaveGame);
        return () => {
            window.removeEventListener("beforeunload", leaveGame);
        }
    });
    */
    const leaveGame = async (event) => {
        event.preventDefault();
        await removeUser({ variables: { user: currentUser, gameId: currentGame.id } });
    };

    /** Captures any change in game state*/
    const gameStateChanged = async (updatedGame: IGame) => {
        if (updatedGame.submittedGifs) {
            updatedGame.submittedGifs = updatedGame.submittedGifs.map((rawGif: IGif) => new SubmittedGif(rawGif));
        }
        setCurrentGame(prevGame => updatedGame);
        console.log(`Game state has changed:`);
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
        console.log(`Round ${currentGame.roundNumber} has finished, a new round is about to start...`);
    };

    if (!currentGame.id) {
        return <CircularProgress />
    }
    //TODO: Fix this
    // if (!localStorageUserName || !localStorageUserId) {
    //     return <Redirect to={'/home'} />
    // }
    return (
        <div className="game">
            <Scoreboard players={currentGame.users}></Scoreboard>
            <StyledContainer>
                {currentGame.roundNumber === 0 && <Lobby gameId={currentGame.id} players={currentGame.users} startGame={() => startGame()} />}
                {currentGame.roundNumber > 0 && (currentGame.roundActive ?
                    <Round player={currentUser} currentGame={currentGame} /> :
                    <RoundResult submittedGifs={currentGame.submittedGifs} players={currentGame.users} startNewRound={() => startNewRound()}
                    />
                )}
            </StyledContainer>
        </div>
    )
}
