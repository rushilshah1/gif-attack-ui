import React, { useState, useEffect } from 'react'
import { Round } from '../round/Round'
import { Container, CircularProgress, withStyles } from '@material-ui/core';
import { RoundResult } from '../round/RoundResult';
import { SubmittedGif, IGif } from '../models/SubmittedGif';
import { useMutation, useSubscription, useQuery } from '@apollo/react-hooks';
import { ROUND_CHANGED_SUBSCRIPTION, NEW_ROUND_MUTATION, UPDATE_ROUND_STATUS_MUTATION, IRound } from '../graphql/round';
import { useParams } from "react-router-dom";
import { LOCAL_STORAGE_USER_NAME, LOCAL_STORAGE_USER_ID } from '../common/constants';
import { START_GAME_MUTATION, GAME_STATE_CHANGED_SUBSCRIPTION, GET_GAME_BY_ID_QUERY_HOOK } from '../graphql/game';
import { Lobby } from '../lobby/Lobby';
import './GameComponent.css';
import { Scoreboard } from '../scoreboard/Scoreboard';
import { User, IUser } from '../models/User';
import { Redirect } from "react-router-dom";
import { UPDATE_GIF_MUTATION } from '../graphql/gif';
import { IGame, IGameVars, IGameData, Game } from '../models/Game';
import { REMOVE_USER_MUTATION, UPDATE_USER_MUTATION } from '../graphql/user';
import { UPDATE_TOPIC_MUTATION, ITopic } from '../graphql/topic';

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
    let params: IGameComponentProps = useParams();
    const localStorageUserName: string | null = localStorage.getItem(LOCAL_STORAGE_USER_NAME)
    const localStorageUserId: string | null = localStorage.getItem(LOCAL_STORAGE_USER_ID)

    const [currentUser, setCurrentUser] = useState<User>(
        localStorageUserName && localStorageUserId ? new User({ id: localStorageUserId, name: localStorageUserName, score: 0 }) : new User());
    const [currentGame, setCurrentGame] = useState<Game>(new Game());
    const [selectedTopic, setSelectedTopic] = useState<string>('');

    useEffect(() => {
        window.addEventListener("beforeunload", leaveGame);
        return () => {
            window.removeEventListener("beforeunload", leaveGame);
        }
    });
    const gameState = useQuery<IGameData, IGameVars>(GET_GAME_BY_ID_QUERY_HOOK, {
        variables: { gameId: params.gameId }, onCompleted: async (response) => {
            gameStateChanged(response.getGameById);
        }
    })
    /** Remove User On Component Destroy */
    const [removeUser, removeUserResult] = useMutation(REMOVE_USER_MUTATION);
    const leaveGame = async (event) => {
        event.preventDefault();
        await removeUser({ variables: { user: currentUser, gameId: currentGame.id } });


    };


    /** Get Game state */
    const gameStateChangedSubscription = useSubscription(GAME_STATE_CHANGED_SUBSCRIPTION, {
        variables: { gameId: currentGame.id },
        onSubscriptionData: (response) => {
            gameStateChanged(response.subscriptionData.data.gameStateChanged)
        }
    });

    /** Start Game Hooks */
    const [gameStatusStarted, gameStatusStartedResult] = useMutation(START_GAME_MUTATION);
    /**  New Round Hooks */
    const [startNextRound, startNextRoundResult] = useMutation(NEW_ROUND_MUTATION);

    const [updateTopic, updateTopicResult] = useMutation(UPDATE_TOPIC_MUTATION);

    /** Update Gif */
    const [updateSubmittedGif, updateSubmittedGifResult] = useMutation(UPDATE_GIF_MUTATION);
    /** Update User Hook */
    const [updateUser, updateUserResult] = useMutation(UPDATE_USER_MUTATION);

    /**  Used for Game Lobby*/
    const gameStateChanged = async (updatedGame: IGame) => {
        if (updatedGame.submittedGifs) {
            updatedGame.submittedGifs = await updatedGame.submittedGifs.map((rawGif: IGif) => new SubmittedGif(rawGif));
        }
        setCurrentGame(prevGame => { return { ...prevGame, ...updatedGame } });
        setSelectedTopic(currentTopic => updatedGame.topic);
        console.log(`Game state has changed:`);
        console.log(updatedGame);
    }

    /** Start Game */
    const startGame = async () => {
        //Mutation to change game status
        await gameStatusStarted({ variables: { gameId: currentGame.id } })
        await startNewRound();
    }

    /** New Round */
    const startNewRound = async () => {
        const changeRoundInput: IRound = { roundNumber: currentGame.roundNumber + 1, roundActive: true };
        await startNextRound({ variables: { round: changeRoundInput, gameId: currentGame.id } });
        console.log(`Round ${currentGame.roundNumber} has finished, a new round is about to start...`);
    };

    const submitTopicToGame = async (topic: string) => {
        const topicInput: ITopic = { topic: topic }
        await updateTopic({ variables: { topicInput: topicInput, gameId: currentGame.id } });
    };

    if (!currentGame.id) {
        return <CircularProgress />
    }
    return (
        <div className="game">
            <Scoreboard players={currentGame.users}></Scoreboard>
            <StyledContainer>
                {currentGame.roundNumber === 0 && <Lobby gameId={currentGame.id} players={currentGame.users} startGame={() => startGame()} />}
                {currentGame.roundNumber > 0 && (currentGame.roundActive ?
                    <Round player={currentUser} currentGame={currentGame} topic={selectedTopic} setTopic={(text) => setSelectedTopic(text)} submitTopic={(text) => submitTopicToGame(text)} /> :
                    <RoundResult submittedGifs={currentGame.submittedGifs} players={currentGame.users} startNewRound={() => startNewRound()}
                    />
                )}
            </StyledContainer>
        </div>
    )
}
