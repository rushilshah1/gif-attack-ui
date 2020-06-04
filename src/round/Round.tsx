import React, { useState, useEffect } from 'react'
import { Container, Icon, withStyles, Modal, Theme, makeStyles, createStyles, Button } from '@material-ui/core';
import { Topic } from '../topic/Topic';
import { SUBMIT_TOPIC_MUTATION, TOPIC_CREATED_SUBSCRIPTION, ITopic } from '../graphql/topic';
import './Round.css';
import { useMutation, useSubscription } from '@apollo/react-hooks';
import { GifSelect } from '../gif/GifSelect';
import { CREATE_GIF_MUTATION, GIF_CREATED_SUBSCRIPTION, IGif, VOTE_GIF_MUTATION, GIF_VOTED_SUBSCRIPTION } from '../graphql/gif';
import { GifSubmit } from '../gif/GifSubmit';
import { SubmittedGif } from '../models/SubmittedGif';
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
    addSubmitedGif: (submittedGif: SubmittedGif) => void;
    voteForSubmitedGif: (gifId: string) => void;
    completeRound: () => void;
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
    const { data, loading, error } = useSubscription(GIF_CREATED_SUBSCRIPTION, {
        variables: { gameId: props.gameId }, onSubscriptionData: (response) => {
            gifReceived(response.subscriptionData.data.gifCreated)
        }
    });

    /** Gif Voting hooks */
    const [voteForGif, voteForGifResult] = useMutation(VOTE_GIF_MUTATION);
    const votedForSubscription = useSubscription(GIF_VOTED_SUBSCRIPTION, {
        variables: { gameId: props.gameId }, onSubscriptionData: (response) => gifVoteReceived(response.subscriptionData.data.gifVoteAdded)
    });

    /** Topic Creation hooks */
    const [createTopic, createTopicResult] = useMutation(SUBMIT_TOPIC_MUTATION);
    const topicCreatedSubscription = useSubscription(TOPIC_CREATED_SUBSCRIPTION, {
        variables: { gameId: props.gameId }, onSubscriptionData: (response) => {
            topicReceived(response.subscriptionData.data.topicCreated.text);
        }
    });


    const submitGif = async (gifObject: any, searchText: string) => {
        const gifString: string = JSON.stringify(gifObject);
        const mutationInput: IGif = { gameId: props.gameId, gif: gifString, userName: props.player.name, gifSearchText: searchText, id: gifObject.id };
        await createGif({ variables: { input: mutationInput } });
        setHasUserSubmittedGif(true);
        console.log(`Create Gif Result: ${createGifResult}`);
    };

    const gifReceived = (gifResponse: IGif) => {
        const gifObject = JSON.parse(gifResponse.gif);
        gifResponse.gif = gifObject;
        gifResponse.id = gifObject.id;
        const submittedGif: SubmittedGif = new SubmittedGif(gifResponse);
        props.addSubmitedGif(submittedGif);
        console.log(`List of submitted gifs: ${props.submittedGifs}`);
    };

    const submitGifVote = async (gifId: string) => {
        const mutationInput: IGif = { gameId: props.gameId, id: gifId };
        await voteForGif({ variables: { input: mutationInput } });
        console.log(`Gif ${gifId} has been voted for`);
    }
    const gifVoteReceived = (gifResponse: IGif): boolean => {
        console.log(`Vote received from subscription callback ${gifResponse}`)
        props.voteForSubmitedGif(gifResponse.id);
        return true;
    }

    const submitTopic = async (topic: string) => {
        const topicInput: ITopic = { gameId: props.gameId, text: topic }
        await createTopic({ variables: { input: topicInput } });
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
            <GifSubmit submittedGifs={props.submittedGifs} voteGif={(gifId) => (submitGifVote(gifId))}></GifSubmit>
            {!hasUserSubmittedGif && <GifSelect selectGif={(gif, searchText) => (submitGif(gif, searchText))}></GifSelect>}
        </Container>


    )
}


