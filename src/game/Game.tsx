import React, { useState, useEffect } from 'react'
import { Round } from '../round/Round'
import { Container, CircularProgress, withStyles } from '@material-ui/core';
import { RoundResult } from '../round/RoundResult';
import { SubmittedGif } from '../models/SubmittedGif';
import { useMutation, useSubscription, useQuery } from '@apollo/react-hooks';
import { ROUND_CHANGED_SUBSCRIPTION, NEXT_ROUND_MUTATION, IRound } from '../graphql/round';
import { useParams } from "react-router-dom";
import { LOCAL_STORAGE_USER_NAME, LOCAL_STORAGE_USER_ID } from '../common/constants';
import { GET_USERS_IN_GAME_QUERY, START_GAME_MUTATION, USER_CHANGED_IN_GAME_SUBSCRIPTION, UPDATE_USER_MUTATION, REMOVE_USER_MUTATION } from '../graphql/game';
import { Lobby } from '../lobby/Lobby';
import './Game.css';
import { Scoreboard } from '../scoreboard/Scoreboard';
import { User, IUser } from '../models/User';
import { Redirect } from "react-router-dom";
import { UPDATE_GIF_MUTATION } from '../graphql/gif';

export interface IGameProps {
    gameId: string
}

const StyledContainer = withStyles({
    root: {
        textAlign: 'center',
        minWidth: '85%',
        justifyContent: 'center'
    }
})(Container);

export const Game: React.FC<IGameProps> = props => {
    let params: IGameProps = useParams();
    const localStorageUserName: string | null = localStorage.getItem(LOCAL_STORAGE_USER_NAME)
    const localStorageUserId: string | null = localStorage.getItem(LOCAL_STORAGE_USER_ID)
    const [gameId, setGameId] = useState<string>(params.gameId);
    const [currentUser, setCurrentUser] = useState<User>(
        localStorageUserName && localStorageUserId ? new User({ id: localStorageUserId, name: localStorageUserName, score: 0 }) : new User());
    const [usersInGame, setUsersInGame] = useState<Array<User>>([]);
    const [submittedGifs, setSubmittedGifs] = useState<Array<SubmittedGif>>([]);
    const [roundComplete, setRoundComplete] = useState<boolean>(false);
    const [roundNumber, setRoundNumber] = useState<number>(0);

    const leaveGame = async (event) => {
        event.preventDefault();
        await removeUser({ variables: { user: currentUser, gameId: gameId } });

    };
    useEffect(() => {
        window.addEventListener("beforeunload", leaveGame);
        return () => {
            window.removeEventListener("beforeunload", leaveGame);
        }
    }, []);
    /** Users in Game Lobby Hooks*/
    const { data, loading, error } = useQuery(GET_USERS_IN_GAME_QUERY, {
        variables: { gameId: gameId }, onCompleted: async (response) => {
            usersChangedInGameReceived(response.getUsers)
        }
    });
    const usersAddedToGameSubscription = useSubscription(USER_CHANGED_IN_GAME_SUBSCRIPTION, {
        variables: { gameId: gameId },
        onSubscriptionData: (response) => {
            usersChangedInGameReceived(response.subscriptionData.data.usersChangedInGame.users)
        }
    });

    /** Start Game Hooks */
    const [gameStatusStarted, gameStatusStartedResult] = useMutation(START_GAME_MUTATION);
    /**  New Round Hooks */
    const [startNextRound, startNextRoundResult] = useMutation(NEXT_ROUND_MUTATION);
    const nextRoundSubscription = useSubscription(ROUND_CHANGED_SUBSCRIPTION, {
        variables: { gameId: gameId }, onSubscriptionData: (response) => {
            newRoundReceived(response.subscriptionData.data.roundChanged.roundNumber)
        }
    });
    /** Update Gif */
    const [updateSubmittedGif, updateSubmittedGifResult] = useMutation(UPDATE_GIF_MUTATION);
    /** Update User Hook */
    const [updateUser, updateUserResult] = useMutation(UPDATE_USER_MUTATION);
    /** Remove User On Component Destroy */
    const [removeUser, removeUserResult] = useMutation(REMOVE_USER_MUTATION);
    /**  Used for Game Lobby*/
    const usersChangedInGameReceived = async (currentUserList: Array<User>) => {
        // console.log(`User changed in to game.`);

        // const listOfUsers: Array<User> = await currentUserList.map(user => {
        //     console.log(`Users in game: ${user.name}`);
        //     return new User({ name: user.name, score: user.score });
        // });
        // debugger;
        //set in this order so score defaults to 0 -> and then can be potentially overridden if user enters in the middle
        setUsersInGame(prevUserList => currentUserList);
    }
    // const usersRemovedFromGameReceived = async (currentUserList: Array<any>) => {
    //     //const listOfUserNames: Set<string> = new Set(currentUserList.map(user => user.name));
    //     console.log(`User removed from game...${currentUserList}`);
    //     setUsersInGame(prevUserList => intersectionBy(prevUserList, currentUserList, 'name'));

    //     // return prevUserList.filter((user: User) => listOfUserNames.has(user.name))

    // }
    /** Start Game */
    const startGame = async () => {
        //Mutation to change game status
        await gameStatusStarted({ variables: { gameId: gameId } })
        await startNewRound();
    }

    /** New Round */
    const startNewRound = async () => {
        const changeRoundInput: IRound = { roundNumber: roundNumber + 1 };
        await startNextRound({ variables: { round: changeRoundInput, gameId: gameId } });
        console.log(`Round ${roundNumber} has finished, a new round is about to start...`);
    };


    const newRoundReceived = (newRoundNumber: number) => {
        setRoundNumber(newRoundNumber);
        setRoundComplete(false);
        setSubmittedGifs([]);
        //TODO: Call mutation for this
    }

    /** Game Interactions and Helpers */
    const updateSubmittedGifs = (updatedGifs: Array<SubmittedGif>) => {
        setSubmittedGifs(prevSubmittedGifs => updatedGifs);
        checkRoundStatus(updatedGifs);
    }

    const voteForSubmittedGif = async (gif: SubmittedGif) => {
        gif.numVotes += 1;
        await updateSubmittedGif({ variables: { gif: gif, gameId: gameId } });
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
    const checkRoundStatus = (gifList: Array<SubmittedGif>) => {
        const numVotes: number = gifList.reduce((sum: number, currentGif: SubmittedGif) => sum + currentGif.numVotes, 0);
        console.log(`Number of votes: ${numVotes}`);

        if (numVotes === usersInGame.length) { //Criteria
            setRoundComplete(true);
        }
    }

    const updateScores = (winnerUserIds: Array<string>) => {
        winnerUserIds.forEach(async (userId: string) => {
            let winnerUser: User | undefined = usersInGame.find((user: User) => user.id === userId);
            if (!winnerUser) {
                console.error("Winner does not exist in game user list..");
                return;
            }
            winnerUser.score += 1;
            await updateUser({
                variables: {
                    user: winnerUser as IUser, gameId: gameId
                }
            })
        });
    }


    return (
        <div className="game">
            <Scoreboard players={usersInGame}></Scoreboard>
            <StyledContainer>
                {roundNumber === 0 && <Lobby gameId={gameId} players={usersInGame} startGame={() => startGame()} />}
                {roundNumber > 0 && (roundComplete ? <RoundResult submittedGifs={submittedGifs} startNewRound={() => startNewRound()}
                    updateScores={(winners) => updateScores(winners)} />
                    : <Round roundNumber={roundNumber} gameId={gameId} player={currentUser} submittedGifs={submittedGifs}
                        updateSubmittedGifs={(updatedGifList) => updateSubmittedGifs(updatedGifList)} voteForSubmitedGif={(gif) => voteForSubmittedGif(gif)}
                        completeRound={() => setRoundComplete(true)} />)}
            </StyledContainer>
        </div>
    )
}
