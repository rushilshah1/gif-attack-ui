import React, { useState } from 'react'
import { Grid } from '@material-ui/core'
import './GifSubmit.scss';
import { SubmittedGif } from '../models/SubmittedGif';
import ENVIRONMENT from '../common/environments';
import { SUBMITTED_GIF_SIZE } from '../common/constants';
import { GifCard, GifCardStyle } from './GifCard';

export interface GifSubmitProps {
    submittedGifs: Array<SubmittedGif>;
    voteForGif: (gif: SubmittedGif) => void;
}

export const GifSubmit: React.FC<GifSubmitProps> = props => {
    const [gifIdVotedFor, setGifIdVotedFor] = useState<string | null>(null); //either null or gif id user voted for

    const getGifCardType = (id: string): GifCardStyle => {
        if (!gifIdVotedFor) {
            return GifCardStyle.Votable;
        }
        else {
            return gifIdVotedFor === id ? GifCardStyle.Voted : GifCardStyle.Unvotable;
        }
    }
    return (
        <Grid container direction="row" spacing={1} justify="center">
            {props.submittedGifs.length > 0 && props.submittedGifs.map((submittedGif: SubmittedGif) =>
                <Grid item lg={4} key={submittedGif.id}>
                    <GifCard
                        key={submittedGif.id}
                        gif={submittedGif}
                        height={SUBMITTED_GIF_SIZE}
                        width={SUBMITTED_GIF_SIZE}
                        title={submittedGif.gifSearchText}
                        voteForGif={(gif) => {
                            setGifIdVotedFor(gif.id)
                            props.voteForGif(gif)
                        }}
                        gifIdVotedFor={gifIdVotedFor}
                        type={getGifCardType(submittedGif.id)}>
                    </GifCard>
                </Grid>
            )}
        </Grid>
    )
}
