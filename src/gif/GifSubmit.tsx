import React, { useState } from 'react'
import { Container, Grid } from '@material-ui/core'
import './GifSubmit.scss';
import { SubmittedGif } from '../models/SubmittedGif';
import ENVIRONMENT from '../common/environments';
import { SUBMITTED_GIF_SIZE } from '../common/constants';
import { GifCard, GifCardStyle } from './GifCard';


export interface GifSubmitProps {
    submittedGifs: Array<SubmittedGif>;
    voteGif: (gif: SubmittedGif) => void;
}

export const GifSubmit: React.FC<GifSubmitProps> = props => {
    const [gifVotedFor, setGifVotedFor] = useState<string | null>(null); //either null or gif id user voted for

    const getGifCardType = (id: string): GifCardStyle => {
        if (!gifVotedFor) {
            return GifCardStyle.Votable;
        }
        else {
            return gifVotedFor === id ? GifCardStyle.Voted : GifCardStyle.Unvotable;
        }
    }
    //TODO: Add helper function for more rules on disabling voting. i.e cannot vote for your own gif
    return (
        <Grid container direction="row">
            {props.submittedGifs.length > 0 && props.submittedGifs.map((submittedGif: SubmittedGif) =>
                <Grid item lg={4} key={submittedGif.id}>
                    <GifCard
                        key={submittedGif.id}
                        gif={submittedGif}
                        height={SUBMITTED_GIF_SIZE}
                        width={SUBMITTED_GIF_SIZE}
                        title={submittedGif.gifSearchText}
                        voteGif={(gif) => {
                            setGifVotedFor(gif.id)
                            props.voteGif(gif)
                        }}
                        gifVotedFor={gifVotedFor}
                        type={getGifCardType(submittedGif.id)}>
                    </GifCard>
                </Grid>
            )}
        </Grid>
    )
}
