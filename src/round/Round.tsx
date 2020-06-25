import React, { useState, useEffect } from 'react'
import { Container, Icon, withStyles, Modal, Theme, makeStyles, createStyles, Button } from '@material-ui/core';
import { Topic } from '../topic/Topic';
import { UPDATE_TOPIC_MUTATION } from '../graphql/topic';
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
    setTopic: (text: string) => void;
    submitTopic: (text: string) => void;
    topic: string;

}

const StyledHelpIcon = withStyles({
    root: {
        fontSize: "15px",
        width: 'auto'
    }
})(HelpIcon);

export const Round: React.FC<RoundProps> = props => {

    const [selectedTopic, setSelectedTopic] = useState<string>('');
    const [hasUserSubmittedGif, setHasUserSubmittedGif] = useState<boolean>(false);
    const [openInstructions, setOpenInstructions] = useState<boolean>(false);

    /** Gif Submission hooks */
    const [createGif, createGifResult] = useMutation(CREATE_GIF_MUTATION);

    /** Gif Updating hooks */
    const [updateGif, updateGifResult] = useMutation(UPDATE_GIF_MUTATION);

    /** Topic Creation hooks */
    const [updateTopic, updateTopicResult] = useMutation(UPDATE_TOPIC_MUTATION);

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
        let updateGifInput: IGif = gif;
        updateGifInput.content = JSON.stringify(gif.content);
        updateGifInput.numVotes = gif.numVotes + 1;
        await updateGif({ variables: { gif: updateGifInput, gameId: props.currentGame.id } });
        console.log(`Gif ${gif.id} has been voted for`);
    }

    /** Instructions Modal Functions */
    const openInstructionsModal = () => {
        setOpenInstructions(true);
    }

    const closeInstructionsModal = () => {
        setOpenInstructions(false);
    }

    return (
        <Container>
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
            <Topic topic={props.topic} submitTopic={text => (props.submitTopic(text))} setTopic={text => (props.setTopic(text))} />
            <GifSubmit submittedGifs={props.currentGame.submittedGifs} voteGif={(gif) => (submitGifVote(gif))}></GifSubmit>
            {!hasUserSubmittedGif && <GifSelect selectGif={(gif, searchText) => (submitGif(gif, searchText))}></GifSelect>}
        </Container>


    )
}


