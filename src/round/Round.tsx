import React, { useState, useEffect } from 'react'
import { Container, Icon, withStyles, Modal, Theme, makeStyles, createStyles, Button } from '@material-ui/core';
import { Topic } from '../topic/Topic';
import { UPDATE_TOPIC_MUTATION, TOPIC_CHANGED_SUBSCRIPTION, ITopic } from '../graphql/topic';
import './Round.css';
import { useMutation, useSubscription } from '@apollo/react-hooks';
import { GifSelect } from '../gif/GifSelect';
import { CREATE_GIF_MUTATION, GIF_CHANGED_SUBSCRIPTION, UPDATE_GIF_MUTATION } from '../graphql/gif';
import { GifSubmit } from '../gif/GifSubmit';
import { SubmittedGif, IGif } from '../models/SubmittedGif';
import { User } from '../models/User';
import { Timer } from './Timer';
import HelpIcon from '@material-ui/icons/Help';
import { InstructionsModal } from './InstructionsModal';

export interface RoundProps {
    gameId: string;
    player: User;
    roundNumber: number;
    // users?: Array<string>;
    submittedGifs: Array<SubmittedGif>;
    updateSubmittedGifs: (updatedGifs: Array<SubmittedGif>) => void;
    voteForSubmitedGif: (gif: SubmittedGif) => void;
    completeRound?: () => void;
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
    const { data, loading, error } = useSubscription(GIF_CHANGED_SUBSCRIPTION, {
        variables: { gameId: props.gameId }, onSubscriptionData: (response) => {
            gifReceived(response.subscriptionData.data.gifChanged.submittedGifs)
        }
    });

    /** Gif Updating hooks */
    const [updateGif, updateGifResult] = useMutation(UPDATE_GIF_MUTATION);
    // const votedForSubscription = useSubscription(GIF_VOTED_SUBSCRIPTION, {
    //     variables: { gameId: props.gameId }, onSubscriptionData: (response) => gifVoteReceived(response.subscriptionData.data.gifVoteAdded)
    // });

    /** Topic Creation hooks */
    const [updateTopic, updateTopicResult] = useMutation(UPDATE_TOPIC_MUTATION);
    const topicChangedSubscription = useSubscription(TOPIC_CHANGED_SUBSCRIPTION, {
        variables: { gameId: props.gameId }, onSubscriptionData: (response) => {
            topicReceived(response.subscriptionData.data.topicChanged.topic);
        }
    });


    const submitGif = async (gifObject: any, searchText: string) => {
        const gifString: string = JSON.stringify(gifObject);
        const createGifInput: IGif = {
            gifId: gifObject.id,
            content: gifString,
            userId: props.player.id,
            gifSearchText: searchText
        };
        await createGif({ variables: { gif: createGifInput, gameId: props.gameId } });
        setHasUserSubmittedGif(true);
        console.log(`Create Gif Result: ${createGifResult}`);
    };

    const gifReceived = async (gifResponse: Array<IGif>) => {
        const updatedSubmittedGifs: Array<SubmittedGif> = await gifResponse.map((rawGif: IGif) => new SubmittedGif(rawGif));
        props.updateSubmittedGifs(updatedSubmittedGifs);
        /*
        const gifObject = JSON.parse(gifResponse.gif);
        gifResponse.gif = gifObject;
        gifResponse.id = gifObject.id;
        const submittedGif: SubmittedGif = new SubmittedGif(gifResponse);
        props.addSubmitedGif(submittedGif);
        console.log(`List of submitted gifs: ${props.submittedGifs}`);
        */
    };

    const submitGifVote = async (gif: SubmittedGif) => {
        const updateGifInput: IGif = {
            id: gif.id,
            gifId: gif.gifId,
            content: JSON.stringify(gif.content),
            userId: gif.userId,
            gifSearchText: gif.gifSearchText,
            numVotes: gif.numVotes + 1
        }
        await updateGif({ variables: { gif: updateGifInput, gameId: props.gameId } });
        console.log(`Gif ${gif.id} has been voted for`);
    }
    // const gifVoteReceived = (gifResponse: IGif): boolean => {
    //     console.log(`Vote received from subscription callback ${gifResponse}`)
    //     props.voteForSubmitedGif(gifResponse.id);
    //     return true;
    // }

    const submitTopic = async (topic: string) => {
        const topicInput: ITopic = { topic: topic }
        await updateTopic({ variables: { topicInput: topicInput, gameId: props.gameId } });
    };

    const topicReceived = async (topic: string) => {
        setSelectedTopic(topic);
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
                    <h1>Round {props.roundNumber}</h1>
                    <Icon color='primary' className='round-help' onClick={() => openInstructionsModal()}>
                        <StyledHelpIcon />
                    </Icon>
                </div>
                {/* <div className="round-timer">
                    {props.submittedGifs.length > 0 && <Timer completeRound={() => props.completeRound()}></Timer>}
                </div> */}
            </div>
            {openInstructions && <Modal
                open={openInstructions}
                onClose={closeInstructionsModal}>
                <InstructionsModal closeInstructionsModal={() => closeInstructionsModal()} />
            </Modal>}
            <Topic topic={selectedTopic} submitTopic={text => (submitTopic(text))} setTopic={text => (setSelectedTopic(text))} />
            <GifSubmit submittedGifs={props.submittedGifs} voteGif={(gif) => (submitGifVote(gif))}></GifSubmit>
            {!hasUserSubmittedGif && <GifSelect selectGif={(gif, searchText) => (submitGif(gif, searchText))}></GifSelect>}
        </Container>


    )
}


