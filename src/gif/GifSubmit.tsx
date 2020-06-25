import React, { useState } from 'react'
import { Container } from '@material-ui/core'
import './GifSubmit.css';
import { SubmittedGif } from '../models/SubmittedGif';
import ENVIRONMENT from '../common/environments';
import { SUBMITTED_GIF_SIZE } from '../common/constants';
import { GifCard, GifCardStyle } from './GifCard';


export interface GifSubmitProps {
    submittedGifs: Array<SubmittedGif>;
    voteGif: (gif: SubmittedGif) => void;
}

export const GifSubmit: React.FC<GifSubmitProps> = props => {
    const [gifVotedFor, setGifVotedFor] = useState<string | null>(null);

    //TODO: Add helper function for more rules on disabling voting. i.e cannot vote for your own gif
    return (
        <Container>
            <div>
                {props.submittedGifs.length > 0 && props.submittedGifs.map((submittedGif: SubmittedGif) =>
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
                        disableVoting={gifVotedFor === submittedGif.id ? true : false}
                        type={gifVotedFor === submittedGif.id ? GifCardStyle.Highlighted : GifCardStyle.Regular}>
                    </GifCard>
                )}
            </div>
        </Container>
    )
}
