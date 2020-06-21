import React, { useEffect, useState } from 'react'
import './RoundResult.css';
import { SubmittedGif } from '../models/SubmittedGif';
import * as _ from "lodash";
import { Container, Card, CardHeader, CardContent, CardActions, IconButton, Divider, Fab, makeStyles, withStyles, Typography } from '@material-ui/core'
import { Gif } from '@giphy/react-components'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import { User } from '../models/User';
import { WINNER_GIF_SIZE, CONSOLIDATION_GIF_SIZE } from '../common/constants';

export interface RoundResultProps {
    players: Array<User>;
    submittedGifs: Array<SubmittedGif>;
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
    }, []);

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
        const userNameByIdMap: Map<string, string> = new Map(props.players.map((player: User) => [player.id, player.name]));
        return gifList.map((gif: SubmittedGif) =>
            <Card className={stylingClass} variant="elevation" square={true} key={gif.id}>
                {/* <CardHeader title={submittedGif.gifSearchText + " - " + submittedGif.numVotes + " - " + submittedGif.userName}></CardHeader> */}
                {/* <CardHeader title={submittedGif.userName + " - " + submittedGif.gifSearchText} titleTypographyProps={{ variant: 'subtitle1' }}></CardHeader> */}
                <CardContent>
                    <Typography variant="subtitle1">
                        {userNameByIdMap.get(gif.userId)} {gif.gifSearchText && - gif.gifSearchText}
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
