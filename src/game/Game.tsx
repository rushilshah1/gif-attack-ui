import React, { useState } from 'react'
import { Round } from '../round/Round'
import { Container, CircularProgress } from '@material-ui/core';
import { RoundResult } from '../round/RoundResult';
import { SubmittedGifModel } from '../models/SubmittedGifModel';
import { useMutation, useSubscription, useQuery } from '@apollo/react-hooks';
import { ROUND_STARTED_SUBSCRIPTION, NEXT_ROUND_MUTATION, IRound } from '../graphql/round';
import { useParams } from "react-router-dom";
import { LOCAL_STORAGE_USER } from '../common/constants';
import { GET_USERS_IN_GAME_QUERY, NEW_USER_IN_GAME_SUBSCRIPTION, START_GAME_MUTATION } from '../graphql/game';
import { Lobby } from '../lobby/Lobby';

export interface IGameProps {
    gameId: string
}
//As of now this component assumes the input gameId is valid -> a guard will need to sit between to perform the validation
export const Game: React.FC<IGameProps> = props => {
    let params: IGameProps = useParams();
    const localStorageUser: string | null = localStorage.getItem(LOCAL_STORAGE_USER)

    const [gameId, setGameId] = useState<string>(params.gameId);
    const [currentUser, setCurrentUser] = useState<string>(localStorageUser ? localStorageUser : '');
    const [usersInGame, setUsersInGame] = useState<Array<string>>([]);
    const [submittedGifs, setSubmittedGifs] = useState<Array<SubmittedGifModel>>([]);
    const [roundComplete, setRoundComplete] = useState<boolean>(false);
    const [roundNumber, setRoundNumber] = useState<number>(0);

    /** Users in Game Lobby Hooks*/
    const { data, loading, error } = useQuery(GET_USERS_IN_GAME_QUERY, {
        variables: { gameId: gameId }, onCompleted: async (response) => {
            let listOfUsers: Array<any> = response.getUsers;
            const listOfNames: Array<string> = await listOfUsers.map(user => user.name);
            setUsersInGame(listOfNames);
        }
    });
    const usersAddedToGameSubscription = useSubscription(NEW_USER_IN_GAME_SUBSCRIPTION, {
        variables: { gameId: gameId },
        onSubscriptionData: (response) => {
            userInGameReceived(response.subscriptionData.data.newUserInGame.users)
        }
    });
    /** Start Game Hooks */
    const [gameStatusStarted, gameStatusStartedResult] = useMutation(START_GAME_MUTATION);
    /**  New Round Hooks */
    const [startNextRound, startNextRoundResult] = useMutation(NEXT_ROUND_MUTATION);
    const nextRoundSubscription = useSubscription(ROUND_STARTED_SUBSCRIPTION, {
        variables: { gameId: gameId }, onSubscriptionData: (response) => {
            newRoundReceived(response.subscriptionData.data.roundStarted.roundNumber)
        }
    });


    const userInGameReceived = async (currentUserList) => {
        const listOfNames: Array<string> = await currentUserList.map(user => user.name);
        setUsersInGame(listOfNames);
    }

    //TODO: Add query to fetch users given a game ID
    //TODO: Add subscription hook for added users to game
    //Pass users into Lobby component -> that will have button to take us back and start a round
    //One that has happened, update DB that game has started! No more joining game :(
    const addSubmitedGif = (gif: SubmittedGifModel) => {
        setSubmittedGifs(submittedGifs => [...submittedGifs, gif]);
    }

    const voteForSubmittedGif = (gifId: string) => {
        let gifVotedFor: SubmittedGifModel | undefined = submittedGifs.find(g => g.id === gifId);
        if (!gifVotedFor) {
            console.error("Trying to vote for a Gif that does not exist");
            return false;
        }
        gifVotedFor.numVotes += 1;
        setSubmittedGifs(submittedGifs => [...submittedGifs]);
        checkRoundStatus();
    }

    const checkRoundStatus = () => {
        const numVotes: number = submittedGifs.reduce((sum: number, currentGif: SubmittedGifModel) => sum + currentGif.numVotes, 0);
        console.log(`Number of votes: ${numVotes}`);

        if (numVotes === usersInGame.length) {
            setRoundComplete(true);
        }
    }
    const startNewRound = async () => {
        const mutationInput: IRound = { gameId: gameId, roundNumber: roundNumber };
        await startNextRound({ variables: { input: mutationInput } });
        console.log(`Round ${roundNumber} has finished, a new round is about to start...`);
    };

    const startGame = async () => {
        //Mutation to change game status
        await gameStatusStarted({ variables: { gameId: gameId } })
        await startNewRound();
    }
    const newRoundReceived = (newRoundNumber: number) => {
        setRoundNumber(newRoundNumber);
        setRoundComplete(false);
        setSubmittedGifs([]);
        // console.log(`It is now Round ${roundNumber}`);
        // debugger;
    }
    if (loading) {
        return <CircularProgress />
    }
    if (error) {
        console.error(`Error! ${error}`)
    }
    return (
        <Container>
            <p>Welcome {currentUser}!</p>
            <p>There are currently {usersInGame.length} users in the game!</p>
            {roundNumber === 0 && <Lobby gameId={gameId} players={usersInGame} startGame={() => startGame()} />}
            {roundNumber > 0 && (roundComplete ? <RoundResult submittedGifs={submittedGifs} startNewRound={() => startNewRound()} />
                : <Round roundNumber={roundNumber} gameId={gameId} player={currentUser} submittedGifs={submittedGifs} addSubmitedGif={(gif) => addSubmitedGif(gif)} voteForSubmitedGif={(gifId) => voteForSubmittedGif(gifId)} />)}
        </Container>
    )
}
