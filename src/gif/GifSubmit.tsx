import React, { useState } from 'react'
import { Container, Card, CardHeader, CardContent, CardActions, IconButton, Typography, makeStyles } from '@material-ui/core'
import { Gif } from '@giphy/react-components'
import './GifSubmit.css';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { SubmittedGif } from '../models/SubmittedGif';
import ENVIRONMENT from '../common/environments';
import { GifCard, GifCardStyle } from './GifCard';
import { SUBMITTED_GIF_SIZE } from '../common/constants';


export interface GifSubmitProps {
    submittedGifs: Array<SubmittedGif>;
    voteGif: (gif: SubmittedGif) => void;
}
const cardRootStyle = {
    display: 'inline-block',
    borderRadius: '25px',
    justifyContent: 'space-between',
    marginTop: '15px',
    marginRight: '15px'
};

const useStyles = makeStyles({
    root: cardRootStyle,
    votedGif: {
        ...cardRootStyle,
        borderStyle: 'outset',
        borderColor: 'gold'
    },
    submittedGif: {
        ...cardRootStyle,
        borderStyle: 'outset',
        backgroundColor: 'lightgrey',
    }
});


export const GifSubmit: React.FC<GifSubmitProps> = props => {
    const [gifVotedFor, setGifVotedFor] = useState<string | null>(null);
    const classes = useStyles();

    // const disableVotingForGif = (submitedGifPlayer: string): boolean => {
    //     const thisPlayer: string | null = localStorage.getItem(LOCAL_STORAGE_USER);
    //     //In PROD, do not allow player to vote for themself
    //     // return gifVotedFor ? true : (ENVIRONMENT.ENV === ENVIRONMENT_PROD && submitedGifPlayer === thisPlayer);
    //     return gifVotedFor ? true : false;
    // };
    return (
        <Container>
            <div>
                {props.submittedGifs.length > 0 && props.submittedGifs.map((submittedGif: SubmittedGif) =>
                    // <GifCard
                    //     gif={submittedGif}
                    //     height={SUBMITTED_GIF_SIZE}
                    //     width={SUBMITTED_GIF_SIZE}
                    //     title={submittedGif.gifSearchText}
                    //     voteGif={(gif) => {
                    //         setGifVotedFor(gif.id)
                    //         props.voteGif(gif)
                    //     }}
                    //     disableVoting={gifVotedFor ? true : false}
                    // type={gifVotedFor ? GifCardStyle.Highlighted : GifCardStyle.Regular}>
                    // </GifCard>
                    <Card className={gifVotedFor === submittedGif.id ? classes.votedGif : classes.submittedGif} variant="elevation" square={true} key={submittedGif.id}>
                        {/* <CardHeader title={submittedGif.gifSearchText + "-" + submittedGif.numVotes}></CardHeader> */}
                        {/* <CardHeader title={submittedGif.gifSearchText} titleTypographyProps={{ variant: 'subtitle1' }}></CardHeader> */}

                        <CardContent>
                            <Typography variant="subtitle1">
                                {submittedGif.gifSearchText}
                                <br />
                            </Typography>
                            <Gif className="gif" gif={submittedGif.content} width={225} height={225} hideAttribution={true} noLink={true}></Gif>
                        </CardContent>
                        <CardActions disableSpacing className="voteButton">
                            <IconButton aria-label="Vote for gif" onClick={() => {
                                setGifVotedFor(submittedGif.id)
                                props.voteGif(submittedGif)
                            }} color='primary' disabled={gifVotedFor ? true : false}>
                                <ThumbUpIcon />
                            </IconButton>
                        </CardActions>
                    </Card>
                )}
            </div>
        </Container>
    )
}
