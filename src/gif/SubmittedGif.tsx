import React, { useState } from 'react'
import { Container, Card, CardHeader, CardContent, CardActions, IconButton, Typography, makeStyles } from '@material-ui/core'
import { Gif } from '@giphy/react-components'
import './SubmittedGif.css';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { SubmittedGifModel } from '../models/SubmittedGifModel';

export interface SubmittedGifProps {
    submittedGifs: Array<SubmittedGifModel>;
    voteGif: (gifId: string) => void;
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


export const SubmittedGif: React.FC<SubmittedGifProps> = props => {
    const [gifVotedFor, setGifVotedFor] = useState<string | null>(null);
    const classes = useStyles();
    return (
        <Container>
            <div>
                {props.submittedGifs.length > 0 && props.submittedGifs.map((submittedGif: SubmittedGifModel) =>
                    <Card className={gifVotedFor === submittedGif.id ? classes.votedGif : classes.submittedGif} variant="elevation" square={true} key={submittedGif.id}>
                        {/* <CardHeader title={submittedGif.gifSearchText + "-" + submittedGif.numVotes}></CardHeader> */}
                        {/* <CardHeader title={submittedGif.gifSearchText} titleTypographyProps={{ variant: 'subtitle1' }}></CardHeader> */}

                        <CardContent>
                            <Typography variant="subtitle1">
                                {submittedGif.gifSearchText}
                                <br />
                            </Typography>
                            <Gif className="gif" gif={submittedGif.gif} width={200} height={200} hideAttribution={true}></Gif>
                        </CardContent>
                        <CardActions disableSpacing className="voteButton">
                            <IconButton aria-label="Vote for gif" onClick={() => {
                                setGifVotedFor(submittedGif.id)
                                props.voteGif(submittedGif.id)
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
