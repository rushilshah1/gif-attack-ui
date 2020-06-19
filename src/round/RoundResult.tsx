import React, { useEffect, useState } from 'react'
import './RoundResult.css';
import { SubmittedGif } from '../models/SubmittedGif';
import * as _ from "lodash";
import { Container, Card, CardHeader, CardContent, CardActions, IconButton, Divider, Fab, makeStyles, withStyles, Typography } from '@material-ui/core'
import { Gif } from '@giphy/react-components'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import { User } from '../models/User';

export interface RoundResultProps {
    players?: Array<User>;
    submittedGifs: Array<SubmittedGif>;
    startNewRound: () => void;
    updateScores: (userNames: Array<string>) => void;
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
    const [winnerGifs, setWinnerGifs] = useState<Array<SubmittedGif>>([]);
    const [consolationGifs, setConsolationGifs] = useState<Array<SubmittedGif>>([]);

    useEffect(() => {
        //Sort descending order
        const sortedGifs: Array<SubmittedGif> = props.submittedGifs.sort((a: SubmittedGif, b: SubmittedGif) => b.numVotes - a.numVotes);
        const maxVotes: number = sortedGifs[0].numVotes;
        const victoryLine: number = _.findLastIndex(sortedGifs, (gif: SubmittedGif) => gif.numVotes === maxVotes);
        setWinnerGifs(sortedGifs.slice(0, victoryLine + 1));
        setConsolationGifs(sortedGifs.slice(victoryLine + 1));
        console.log(`winner gifs: ${winnerGifs.length}`)
    }, []);

    useEffect(() => {
        if (winnerGifs.length === 1) { //Only update score for winner - no ties
            //Technically only 1, but making it generic to be expanded for "multiple" winners/ties
            //This logic is based on a username is unique and players cannot have to the same name
            //TODO: Add validation on home page form
            const winnerUsers: Array<string> = winnerGifs.map(gif => gif.userId);
            props.updateScores(winnerUsers);
        }
    }, [winnerGifs])


    const generateVoteIcons = (numVotes: number) => {
        const arrVotes: Array<any> = Array.from(new Array(numVotes), x => Math.random());
        return arrVotes.map(index =>
            < IconButton color='secondary' key={index}>
                <FavoriteOutlinedIcon />
            </IconButton >
        );
    }

    const generateGifPanel = (gifList: Array<SubmittedGif>, isWinner: boolean) => {
        const size: number = isWinner ? WINNER_GIF_SIZE : CONSOLIDATION_GIF_SIZE;
        const stylingClass = isWinner ? classes.winnerGif : classes.consolationGif;

        return gifList.map((gif: SubmittedGif) =>
            <Card className={stylingClass} variant="elevation" square={true} key={gif.id}>
                {/* <CardHeader title={submittedGif.gifSearchText + " - " + submittedGif.numVotes + " - " + submittedGif.userName}></CardHeader> */}
                {/* <CardHeader title={submittedGif.userName + " - " + submittedGif.gifSearchText} titleTypographyProps={{ variant: 'subtitle1' }}></CardHeader> */}
                <CardContent>
                    <Typography variant="subtitle1">
                        {gif.userId} - {gif.gifSearchText}
                    </Typography>
                    <Gif className="gif" gif={gif.content} width={size} height={size} hideAttribution={true} noLink={true}></Gif>
                </CardContent>
                <CardActions disableSpacing className="voteButton">
                    {generateVoteIcons(gif.numVotes)}
                </CardActions>

            </Card>
        );
    }
    return (
        <Container>
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
                            && generateGifPanel(winnerGifs, true)
                        }
                    </div>
                    {consolationGifs.length > 0 && <ResultDivider />}
                    {consolationGifs.length > 0 && <h2>Runner up(s):</h2>}
                    <div className="consolationCards">
                        {consolationGifs.length > 0
                            && generateGifPanel(consolationGifs, false)
                        }
                    </div>
                </div>
            </div>


        </Container>
    )
}
