import React, { useState } from 'react'
import { Container, Card, CardHeader, CardContent, CardActions, IconButton } from '@material-ui/core'
import { Gif } from '@giphy/react-components'
import './SubmittedGif.css';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { SubmittedGifModel } from '../models/SubmittedGifModel';

export interface SubmittedGifProps {
    submittedGifs: Array<SubmittedGifModel>;
    voteGif: (gifId: string) => void;
}

export const SubmittedGif: React.FC<SubmittedGifProps> = props => {
    const [gifVotedFor, setGifVotedFor] = useState<string | null>(null);

    return (
        <Container>
            <div>
                {props.submittedGifs.length > 0 && props.submittedGifs.map((submittedGif: SubmittedGifModel) =>
                    <Card className={gifVotedFor === submittedGif.id ? "votedGif" : "submittedGif"} variant="elevation" square={true} key={submittedGif.id}>
                        {/* <CardHeader title={submittedGif.gifSearchText + "-" + submittedGif.numVotes}></CardHeader> */}
                        <CardHeader title={submittedGif.gifSearchText}></CardHeader>
                        <CardContent><Gif className="gif" gif={submittedGif.gif} width={250} height={250} hideAttribution={true}></Gif></CardContent>
                        <CardActions disableSpacing >
                            <IconButton aria-label="Vote for gif" onClick={() => {
                                setGifVotedFor(submittedGif.id)
                                props.voteGif(submittedGif.id)
                            }} className='voteButton' color='primary'>
                                {/* disabled={gifVotedFor ? true : false}  */}
                                <ThumbUpIcon />
                            </IconButton>
                        </CardActions>
                    </Card>
                )}
            </div>
        </Container>
    )
}
