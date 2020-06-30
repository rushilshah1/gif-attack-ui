import React, { useState, useEffect } from 'react'
import { Container, Icon, withStyles, Modal, Theme, makeStyles, createStyles, Button, Typography, Grid } from '@material-ui/core';
import { Topic } from '../topic/Topic';
import { UPDATE_TOPIC_MUTATION, ITopic } from '../graphql/topic';
import './Round.css';
import { useMutation, useSubscription } from '@apollo/react-hooks';
import { GifSelect } from '../gif/GifSelect';
import { CREATE_GIF_MUTATION, UPDATE_GIF_MUTATION } from '../graphql/gif';
import { GifSubmit } from '../gif/GifSubmit';
import { SubmittedGif, IGif } from '../models/SubmittedGif';
import { User } from '../models/User';
import { Timer } from './Timer';
import HelpIcon from '@material-ui/icons/Help';
import { InstructionsModal } from './InstructionsModal';
import { Game } from '../models/Game';

export interface RoundProps {
    currentGame: Game;
    player: User;
}

const StyledHelpIcon = withStyles({
    root: {
        fontSize: "15px",
        width: 'auto'
    }
})(HelpIcon);

export const Round: React.FC<RoundProps> = props => {
    /**State for instructions modal and user gif submission */
    const [hasUserSubmittedGif, setHasUserSubmittedGif] = useState<boolean>(false);
    const [openInstructions, setOpenInstructions] = useState<boolean>(false);

    /** Apollo Hooks */
    const [createGif, createGifResult] = useMutation(CREATE_GIF_MUTATION);
    const [updateGif, updateGifResult] = useMutation(UPDATE_GIF_MUTATION);
    const [updateTopic, updateTopicResult] = useMutation(UPDATE_TOPIC_MUTATION);

    /**Action functions using Apollo Hooks */
    const submitGif = async (gifObject: any, searchText: string) => {
        const gifString: string = JSON.stringify(gifObject);
        const createGifInput: IGif = {
            gifId: gifObject.id,
            content: gifString,
            userId: props.player.id,
            gifSearchText: searchText
        };
        await createGif({ variables: { gif: createGifInput, gameId: props.currentGame.id } });
        setHasUserSubmittedGif(true);
    };

    const submitGifVote = async (gif: SubmittedGif) => {
        const updateGifInput: IGif = {
            id: gif.id,
            gifId: gif.gifId,
            content: JSON.stringify(gif.content),
            userId: gif.userId,
            gifSearchText: gif.gifSearchText,
            numVotes: gif.numVotes + 1,
            isWinner: gif.isWinner
        }
        await updateGif({ variables: { gif: updateGifInput, gameId: props.currentGame.id } });
        console.log(`Gif ${gif.id} has been voted for`);
    }

    const submitTopic = async (topic: string) => {
        const topicInput: ITopic = { topic: topic }
        await updateTopic({ variables: { topicInput: topicInput, gameId: props.currentGame.id } });
    };

    /** Instructions Modal Functions */
    const openInstructionsModal = () => {
        setOpenInstructions(true);
    }

    const closeInstructionsModal = () => {
        setOpenInstructions(false);
    }

    return (
        <Container>
            <Grid container>
            </Grid>

            <div className="round-heading">
                <div className="round-number">
                    <h1>Round {props.currentGame.roundNumber}</h1>
                    <Icon color='primary' className='round-help' onClick={() => openInstructionsModal()}>
                        <StyledHelpIcon />
                    </Icon>
                </div>
                <div className="round-timer">
                    <Timer gameId={props.currentGame.id}></Timer>
                </div>
            </div>
            {openInstructions && <Modal
                open={openInstructions}
                onClose={closeInstructionsModal}>
                <InstructionsModal closeInstructionsModal={() => closeInstructionsModal()} />
            </Modal>}
            <Topic topic={props.currentGame.topic} submitTopic={text => (submitTopic(text))} />
            <GifSubmit submittedGifs={props.currentGame.submittedGifs} voteGif={(gif) => (submitGifVote(gif))}></GifSubmit>
            {!hasUserSubmittedGif && <GifSelect selectGif={(gif, searchText) => (submitGif(gif, searchText))}></GifSelect>}
        </Container>
    )
}


