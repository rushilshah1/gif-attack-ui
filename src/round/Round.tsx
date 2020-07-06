import React, { useState, useEffect } from 'react'

// Apollo + Graphql
import { useMutation, useSubscription } from '@apollo/react-hooks';
import { CREATE_GIF_MUTATION, UPDATE_GIF_MUTATION } from '../graphql/gif';
import { UPDATE_TOPIC_MUTATION, ITopic } from '../graphql/topic';

//UI + CSS
import './Round.scss';
import { Container, Grid, Icon, withStyles, Modal, Theme, makeStyles, createStyles, Button, Typography, Backdrop } from '@material-ui/core';

// Components
import { InstructionsModal } from './InstructionsModal';
import { Game } from '../models/Game';
import { Timer } from './Timer';
import { User } from '../models/User';
import { Topic } from '../topic/Topic';
import { LOCAL_STORAGE_PLAYED_BEFORE } from '../common/constants';

//Icons
import HelpIcon from '@material-ui/icons/Help';

//Giphy
import { GifSubmit } from '../gif/GifSubmit';
import { GifSelect } from '../gif/GifSelect';
import { SubmittedGif, IGif } from '../models/SubmittedGif';

export interface RoundProps {
    currentGame: Game;
    player: User;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {

        },
        boldText: {
            fontWeight: "bold",
            fontStyle: theme.typography.fontFamily
        }
    })
);

const StyledHelpIcon = withStyles({
    root: {
        fontSize: "15px",
        width: 'auto'
    }
})(HelpIcon);

export const Round: React.FC<RoundProps> = props => {
    /**Classes for Material Components */
    const classes = useStyles();
    /**State for instructions modal and user gif submission */
    const [hasUserSubmittedGif, setHasUserSubmittedGif] = useState<boolean>(false);
    const [openInstructions, setOpenInstructions] = useState<boolean>(localStorage.getItem(LOCAL_STORAGE_PLAYED_BEFORE) ? false : true);
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

    const openInstructionsModal = () => {
        setOpenInstructions(true);
    }

    const closeInstructionsModal = () => {
        setOpenInstructions(false);
        localStorage.setItem(LOCAL_STORAGE_PLAYED_BEFORE, 'true');
    }

    const submitTopic = async (topic: string) => {
        const topicInput: ITopic = { topic: topic }
        await updateTopic({ variables: { topicInput: topicInput, gameId: props.currentGame.id } });
    };

    return (
        <Grid container justify="center" alignItems="flex-start">
            <Grid item md={10}>
                <Topic topic={props.currentGame.topic} submitTopic={text => (submitTopic(text))} />

                <GifSubmit submittedGifs={props.currentGame.submittedGifs} voteForGif={(gif) => (submitGifVote(gif))}></GifSubmit>
                {!hasUserSubmittedGif && <GifSelect selectGif={(gif, searchText) => (submitGif(gif, searchText))}></GifSelect>}
            </Grid>

            <Grid item md={2}>
                <Grid container spacing={0} direction="column" justify="flex-start" alignItems="center">
                    <Grid item>
                        <a href="/">
                            <img className="small-logo" src={require('./../assets/logo.png')} />
                        </a>
                    </Grid>
                    <Grid item>
                        <div className="round-heading">
                            <div className="round-number">
                                <Typography variant="h4" component="h4" className={classes.boldText}>Round {props.currentGame.roundNumber}</Typography>
                                <Icon color='primary' className='round-help' onClick={() => openInstructionsModal()}>
                                    <StyledHelpIcon />
                                </Icon>
                            </div>
                        </div>

                        {openInstructions && <Modal
                            open={openInstructions}
                            onClose={closeInstructionsModal}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                                timeout: 1500,
                            }}>
                            <InstructionsModal closeInstructionsModal={() => closeInstructionsModal()} />
                        </Modal>}
                    </Grid>

                    <Grid item>
                        <Timer gameId={props.currentGame.id}></Timer>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}