import React, { useState, useEffect } from 'react'

// Apollo + Graphql
import { useMutation, useSubscription } from '@apollo/react-hooks';
import { CREATE_GIF_MUTATION, UPDATE_GIF_MUTATION } from '../graphql/gif';
import { UPDATE_TOPIC_MUTATION } from '../graphql/topic';

//UI + CSS
import './Round.scss';
import { Grid, Icon, withStyles, Modal, Theme, makeStyles, createStyles, Typography, Backdrop, Hidden } from '@material-ui/core';

// Components
import { Game } from '../models/Game';
import { User } from '../models/User';
import { Topic } from '../topic/Topic';
import { ITopic } from '../models/Round';
import { SubmissionConfirmation } from '../gif/SubmissionConfirmation';

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

export const Round: React.FC<RoundProps> = props => {
    /**Classes for Material Components */
    const classes = useStyles();
    /**State for instructions modal and user gif submission */
    const [hasUserSubmittedGif, setHasUserSubmittedGif] = useState<boolean>(false);
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
    }

    const submitTopic = async (topic: string) => {
        const topicInput: ITopic = { topic: topic }
        await updateTopic({ variables: { topicInput: topicInput, gameId: props.currentGame.id } });
    };

    /* Gif Submission */
    const showSubmittedGifs = () => {
        const submittedGifPanel = (
            <div className="gif-submission">
                <Typography variant="h6" >
                    Time to Vote!
                    </Typography>
                <GifSubmit
                    submittedGifs={props.currentGame.submittedGifs}
                    voteForGif={(gif) => (submitGifVote(gif))}>
                </GifSubmit>
            </div>
        );
        if (props.currentGame.settings?.hiddenSubmission) {
            //Everyone has submitted
            return (props.currentGame.submittedGifs.length >= props.currentGame.users.length) && submittedGifPanel;
        }
        else {
            return submittedGifPanel;
        }
    }

    return (
        <Grid container justify="center" alignItems="flex-start" spacing={2}>
            <Grid item xs={12}>
                <Topic topic={props.currentGame.topic} submitTopic={text => (submitTopic(text))} />
                {showSubmittedGifs()}
                {!hasUserSubmittedGif && <GifSelect selectGif={(gif, searchText) => (submitGif(gif, searchText))}></GifSelect>}
                {hasUserSubmittedGif && <SubmissionConfirmation></SubmissionConfirmation>}
            </Grid>
        </Grid >
    )
}