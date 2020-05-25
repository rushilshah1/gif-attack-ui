import React, { useEffect, useState } from 'react'
import './RoundResult.css';
import { SubmittedGifModel } from '../models/SubmittedGifModel';
import * as _ from "lodash";
import { Container, Card, CardHeader, CardContent, CardActions, IconButton, Divider, Fab, makeStyles, withStyles, Typography } from '@material-ui/core'
import { Gif } from '@giphy/react-components'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';

export interface RoundResultProps {
    submittedGifs: Array<SubmittedGifModel>;
    startNewRound: () => void;
}

const cardRootStyle = {
    display: 'inline-block',
    borderRadius: '25px',
    justifyContent: 'space-between',
    marginTop: '15px',
    marginRight: '15px',
    borderStyle: 'outset'
};

const useStyles = makeStyles({
    root: cardRootStyle,
    winnerGif: {
        ...cardRootStyle,
        borderColor: 'gold'
    },
    consolationGif: {
        ...cardRootStyle,
        backgroundColor: 'lightgrey',
    }
});

const ResultDivider = withStyles({
    root: {
        marginTop: '2%',
        marginBottom: '2%'
    }
})(Divider);

const WINNER_GIF_SIZE: number = 250;
const CONSOLIDATION_GIF_SIZE: number = 150;

export const RoundResult: React.FC<RoundResultProps> = props => {
    const classes = useStyles();
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


    const generateVoteIcons = (numVotes: number) => {
        const arrVotes: Array<any> = Array.from(new Array(numVotes), x => Math.random());
        return arrVotes.map(index =>
            < IconButton color='secondary' key={index}>
                <FavoriteOutlinedIcon />
            </IconButton >
        );
    }
    return (
        <Container>
            {/* <div className="next-round-title">
                    <h1> Round Results</h1>
                </div> */}

            <div className="next-round-action">
                <Fab color="secondary" aria-label="next round" onClick={() => props.startNewRound()} size="large">
                    <ArrowForwardIosIcon />
                </Fab>
                <h4 className="next-round-text">Next Round</h4>
                <div className="results">
                    {winnerGifs.length === 1 && <h2>We have a Winner!</h2>}
                    {winnerGifs.length > 1 && <h2>We have a Tie!</h2>}
                    <div className="winnerCards">
                        {winnerGifs.length > 0
                            && winnerGifs.map((submittedGif: SubmittedGifModel) =>
                                <Card className={classes.winnerGif} variant="elevation" square={true} key={submittedGif.id}>

                                    {/* <CardHeader title={submittedGif.gifSearchText + " - " + submittedGif.numVotes + " - " + submittedGif.userName}></CardHeader> */}
                                    {/* <CardHeader title={submittedGif.userName + " - " + submittedGif.gifSearchText} titleTypographyProps={{ variant: 'subtitle1' }}></CardHeader> */}
                                    <CardContent>
                                        <Typography variant="subtitle1">
                                            {submittedGif.userName} - {submittedGif.gifSearchText}
                                        </Typography>
                                        <Gif className="gif" gif={submittedGif.gif} width={WINNER_GIF_SIZE} height={WINNER_GIF_SIZE} hideAttribution={true}></Gif>
                                    </CardContent>
                                    <CardActions disableSpacing className="voteButton">
                                        {generateVoteIcons(submittedGif.numVotes)}
                                    </CardActions>

                                </Card>
                            )}
                    </div>
                    <ResultDivider />
                    {consolationGifs.length > 0 && <h2>Runner up(s):</h2>}
                    <div className="consolationCards">
                        {consolationGifs.length > 0
                            && consolationGifs.map((submittedGif: SubmittedGifModel) =>
                                <Card className={classes.consolationGif} variant="elevation" square={true} key={submittedGif.id}>

                                    {/* <CardHeader title={submittedGif.userName + " - " + submittedGif.gifSearchText} titleTypographyProps={{ variant: 'subtitle1' }}></CardHeader> */}

                                    <CardContent>
                                        <Typography variant="subtitle1">
                                            {submittedGif.userName} - {submittedGif.gifSearchText}
                                        </Typography>
                                        <Gif className="gif" gif={submittedGif.gif} width={CONSOLIDATION_GIF_SIZE} height={CONSOLIDATION_GIF_SIZE} hideAttribution={true}></Gif>
                                    </CardContent>
                                    <CardActions disableSpacing={true} className="voteButton">
                                        {generateVoteIcons(submittedGif.numVotes)}
                                    </CardActions>
                                </Card>
                            )}
                    </div>
                </div>
            </div>


        </Container>
    )
}
