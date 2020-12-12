import React, { useState } from 'react'

// Apollo + Graphql
import { useMutation } from '@apollo/react-hooks';
import { CREATE_GIF_MUTATION, VOTE_FOR_GIF_MUTATION } from '../graphql/gif';
import { UPDATE_TOPIC_MUTATION } from '../graphql/topic';

//UI + CSS
import './Round.scss';
import { Grid, Typography } from '@material-ui/core';

// Components
import { Game } from '../models/Game';
import { User } from '../models/User';
import { Topic } from '../topic/Topic';
import { ITopic } from '../models/Round';
import { SubmissionConfirmation } from '../gif/SubmissionConfirmation';

//Giphy
import { GifSubmit } from '../gif/GifSubmit';
import { GifSelect } from '../gif/GifSelect';
import { IGif } from '../models/SubmittedGif';


export interface RoundProps {
    currentGame: Game;
    player: User;
}

export const Round: React.FC<RoundProps> = props => {
    /**State User Gif Submission */
    const [hasUserSubmittedGif, setHasUserSubmittedGif] = useState<boolean>(false);
    /** Apollo Hooks */
    const [createGif, createGifResult] = useMutation(CREATE_GIF_MUTATION);
    const [voteForGif, voteForGifResult] = useMutation(VOTE_FOR_GIF_MUTATION);
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
        await createGif({ variables: { gif: createGifInput, gameId: props.currentGame.id, userId: props.player.id } });
        setHasUserSubmittedGif(true);
    };

    const submitGifVote = async (id: string) => {
        await voteForGif({ variables: { gifId: id, gameId: props.currentGame.id, userId: props.player.id } });
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
                    voteForGif={(gifId) => (submitGifVote(gifId))}>
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