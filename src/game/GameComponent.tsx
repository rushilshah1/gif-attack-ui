import React, { useState, useEffect } from 'react'
import { Round } from '../round/Round'
import { Container, CircularProgress, withStyles } from '@material-ui/core';
import { RoundResult } from '../round/RoundResult';
import { SubmittedGif } from '../models/SubmittedGif';
import { useMutation, useSubscription, useQuery } from '@apollo/react-hooks';
import { ROUND_CHANGED_SUBSCRIPTION, NEW_ROUND_MUTATION, UPDATE_ROUND_STATUS_MUTATION, IRound } from '../graphql/round';
import { useParams } from "react-router-dom";
import { LOCAL_STORAGE_USER_NAME, LOCAL_STORAGE_USER_ID } from '../common/constants';
import { GET_USERS_IN_GAME_QUERY, START_GAME_MUTATION, GAME_STATE_CHANGED_SUBSCRIPTION, UPDATE_USER_MUTATION, REMOVE_USER_MUTATION, GET_GAME_BY_ID_QUERY_HOOK } from '../graphql/game';
import { Lobby } from '../lobby/Lobby';
import './GameComponent.css';
import { Scoreboard } from '../scoreboard/Scoreboard';
import { User, IUser } from '../models/User';
import { Redirect } from "react-router-dom";
import { UPDATE_GIF_MUTATION } from '../graphql/gif';
import { IGame, IGameVars, IGameData, Game } from '../models/Game';

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
    //const [usersInGame, setUsersInGame] = useState<Array<User>>([]);
    //const [submittedGifs, setSubmittedGifs] = useState<Array<SubmittedGif>>([]);
    //const [roundComplete, setRoundComplete] = useState<boolean>(false);
    //const [roundNumber, setRoundNumber] = useState<number>(0);
    const gameState = useQuery<IGameData, IGameVars>(GET_GAME_BY_ID_QUERY_HOOK, {
        variables: { gameId: params.gameId }, onCompleted: async (response) => {
            gameStateReceived(response.getGameById);
        }
    })
    /** Remove User On Component Destroy */
    const [removeUser, removeUserResult] = useMutation(REMOVE_USER_MUTATION);
    const leaveGame = async (event) => {
        event.preventDefault();
        await removeUser({ variables: { user: currentUser, gameId: currentGame.id } });


    };

    useEffect(() => {
        window.addEventListener("beforeunload", leaveGame);
        return () => {
            window.removeEventListener("beforeunload", leaveGame);
        }
    });
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
    const [updateRoundStatus, updateRoundStatusResult] = useMutation(UPDATE_ROUND_STATUS_MUTATION);

    const nextRoundSubscription = useSubscription(ROUND_CHANGED_SUBSCRIPTION, {
        variables: { gameId: currentGame.id }, onSubscriptionData: (response) => {
            newRoundReceived(response.subscriptionData.data.roundChanged)
        }
    });
    /** Update Gif */
    const [updateSubmittedGif, updateSubmittedGifResult] = useMutation(UPDATE_GIF_MUTATION);
    /** Update User Hook */
    const [updateUser, updateUserResult] = useMutation(UPDATE_USER_MUTATION);

    /**  Used for Game Lobby*/
    const gameStateChanged = async (updatedGame: IGame) => {
        setCurrentGame(prevGame => { return { ...prevGame, ...updatedGame } });
        console.log(updatedGame);
    }

    const gameStateReceived = async (game: IGame) => {
        //await usersChangedInGameReceived(currentGame.users);
        setCurrentGame(game);
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


    const newRoundReceived = (updatedGame: IGame) => {
        setCurrentGame(prevGame => { return { ...prevGame, ...{ roundNumber: updatedGame.roundNumber, roundActive: updatedGame.roundActive } } })
        // setRoundNumber(newRoundNumber);
        // setRoundComplete(false);
        // setSubmittedGifs([]);
        //TODO: Call mutation for this
    }

    /** Game Interactions and Helpers */
    const updateSubmittedGifs = async (updatedGifs: Array<SubmittedGif>) => {
        setCurrentGame(prevGame => { return { ...prevGame, submittedGifs: updatedGifs } });
        await checkRoundStatus(updatedGifs);
    }

    const voteForSubmittedGif = async (gif: SubmittedGif) => {
        gif.numVotes += 1;
        await updateSubmittedGif({ variables: { gif: gif, gameId: currentGame.id } });
        // let gifVotedFor: SubmittedGif | undefined = submittedGifs.find(g => g.id === gifId);
        // if (!gifVotedFor) {
        //     console.error("Trying to vote for a Gif that does not exist");
        //     return false;
        // }
        // gifVotedFor.numVotes += 1;
        // setSubmittedGifs(submittedGifs => [...submittedGifs]);
        // checkRoundStatus();
    }

    //Logic to determine if round is over or not    
    const checkRoundStatus = async (gifList: Array<SubmittedGif>) => {
        const numVotes: number = gifList.reduce((sum: number, currentGif: SubmittedGif) => sum + currentGif.numVotes, 0);
        console.log(`Number of votes: ${numVotes}`);

        if (numVotes === currentGame.users.length) { //Criteria
            //TODO: Persist round status change
            const updateRoundInput: IRound = { roundActive: false };
            await updateRoundStatus({ variables: { round: updateRoundInput, gameId: currentGame.id } });
            setCurrentGame(prevGame => { return { ...prevGame, roundActive: false } });
        }
    }

    const updateScores = (winnerUserIds: Array<string>) => {
        winnerUserIds.forEach(async (userId: string) => {
            let winnerUser: User | undefined = currentGame.users.find((user: User) => user.id === userId);
            if (!winnerUser) {
                console.error("Winner does not exist in game user list..");
                return;
            }
            winnerUser.score += 1;
            await updateUser({
                variables: {
                    user: winnerUser as IUser, gameId: currentGame.id
                }
            })
        });
    }

    if (!currentGame.id) {
        return <CircularProgress />
    }
    return (
        <div className="game">
            <Scoreboard players={currentGame.users}></Scoreboard>
            <StyledContainer>
                {currentGame.roundNumber === 0 && <Lobby gameId={currentGame.id} players={currentGame.users} startGame={() => startGame()} />}
                {currentGame.roundNumber > 0 && (currentGame.roundActive ?
                    <Round roundNumber={currentGame.roundNumber} gameId={currentGame.id} player={currentUser} submittedGifs={currentGame.submittedGifs}
                        updateSubmittedGifs={(updatedGifList) => updateSubmittedGifs(updatedGifList)} voteForSubmitedGif={(gif) => voteForSubmittedGif(gif)} /> :
                    <RoundResult submittedGifs={currentGame.submittedGifs} players={currentGame.users} startNewRound={() => startNewRound()}
                        updateScores={(winners) => updateScores(winners)} />
                )}
            </StyledContainer>
        </div>
    )
}
