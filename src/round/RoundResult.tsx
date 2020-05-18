import React, { useEffect, useState } from 'react'
import './RoundResult.css';
import { SubmittedGifModel } from '../models/SubmittedGifModel';
import * as _ from "lodash";
import { Container, Card, CardHeader, CardContent, CardActions, IconButton, Divider, Fab } from '@material-ui/core'
import { Gif } from '@giphy/react-components'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

export interface RoundResultProps {
    submittedGifs: Array<SubmittedGifModel>;
    startNewRound: () => void;
}

export const RoundResult: React.FC<RoundResultProps> = props => {

    const [winnerGifs, setWinnerGifs] = useState<Array<SubmittedGifModel>>([]);
    const [consolationGifs, setConsolationGifs] = useState<Array<SubmittedGifModel>>([]);

    useEffect(() => {
        //Sort descending order
        const sortedGifs: Array<SubmittedGifModel> = props.submittedGifs.sort((a: SubmittedGifModel, b: SubmittedGifModel) => b.numVotes - a.numVotes);
        const maxVotes: number = sortedGifs[0].numVotes;
        const victoryLine: number = _.findLastIndex(sortedGifs, (gif: SubmittedGifModel) => gif.numVotes === maxVotes);
        setWinnerGifs(sortedGifs.slice(0, victoryLine + 1));
        setConsolationGifs(sortedGifs.slice(victoryLine + 1));
    }, []);


    return (
        <Container>
            <h2> Round Results</h2>
            <Fab color="secondary" aria-label="next round" onClick={() => props.startNewRound()}>
                <ArrowForwardIosIcon />
            </Fab>
            {winnerGifs.length > 0 && <h2>Winner!!</h2>}
            {winnerGifs.length > 0
                && winnerGifs.map((submittedGif: SubmittedGifModel) =>
                    <Card className="winnerGif" variant="elevation" square={true} key={submittedGif.id}>
                        <CardHeader title={submittedGif.gifSearchText + " - " + submittedGif.numVotes + " - " + submittedGif.userName}></CardHeader>
                        {/* <CardHeader title={submittedGif.gifSearchText}></CardHeader> */}
                        <CardContent><Gif className="gif" gif={submittedGif.gif} width={300} height={300} hideAttribution={true}></Gif></CardContent>
                    </Card>
                )}
            <Divider />
            {winnerGifs.length > 0 && <h2>Runner up(s):</h2>}
            {consolationGifs.length > 0
                && consolationGifs.map((submittedGif: SubmittedGifModel) =>
                    <Card className="consolationGif" variant="elevation" square={true} key={submittedGif.id}>
                        <CardHeader title={submittedGif.gifSearchText + " - " + submittedGif.numVotes + " - " + submittedGif.userName}></CardHeader>
                        {/* <CardHeader title={submittedGif.gifSearchText}></CardHeader> */}
                        <CardContent><Gif className="gif" gif={submittedGif.gif} width={150} height={150} hideAttribution={true}></Gif></CardContent>
                    </Card>
                )}
        </Container>
    )
}
