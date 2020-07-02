import React, { useEffect, useState } from 'react'
import * as _ from "lodash";
import { partition } from 'lodash';

// UI + CSS
import './RoundResult.css';
import { Container, Card, CardHeader, CardContent, CardActions, IconButton, Divider, Fab, makeStyles, withStyles, Typography, Grid, Theme, createStyles } from '@material-ui/core'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

// Models
import { SubmittedGif } from '../models/SubmittedGif';
import { User } from '../models/User';
import { Game } from '../models/Game';
import { GifCard, GifCardStyle } from '../gif/GifCard';

// Constants
import { WINNER_GIF_SIZE, CONSOLIDATION_GIF_SIZE } from '../common/constants';

export interface RoundResultProps {
    players: Array<User>;
    submittedGifs: Array<SubmittedGif>;
    startNewRound: () => void;
    currentGame: Game;
}

const ResultDivider = withStyles({
    root: {
        marginTop: '4%',
        marginBottom: '4%',
    }
})(Divider);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {

        },
        boldText: {
            fontWeight: "bold",
            fontStyle: theme.typography.fontFamily
        }
    })
);

export const RoundResult: React.FC<RoundResultProps> = props => {
    const classes = useStyles();
    const [winnerGifs, setWinnerGifs] = useState<Array<SubmittedGif>>([]);
    const [consolationGifs, setConsolationGifs] = useState<Array<SubmittedGif>>([]);
    useEffect(() => {
        //Sort descending order
        if (props.submittedGifs && props.submittedGifs.length) {
            const partitionedGifsByTag: Array<Array<SubmittedGif>> = partition(props.submittedGifs, 'isWinner');
            setWinnerGifs(winnerGifs => partitionedGifsByTag[0]);
            const sortedConsolationGifs = partitionedGifsByTag[1].sort((a: SubmittedGif, b: SubmittedGif) => b.numVotes - a.numVotes);
            setConsolationGifs(consolationGifs => sortedConsolationGifs);
        }

    }, []);

    const generateGifPanel = (gifList: Array<SubmittedGif>, isWinner: boolean) => {
        const size: number = isWinner ? WINNER_GIF_SIZE : CONSOLIDATION_GIF_SIZE;
        const cardType = isWinner ? GifCardStyle.Voted : GifCardStyle.Unvotable;
        const userNameByIdMap: Map<string, string> = new Map(props.players.map((player: User) => [player.id, player.name]));
        return gifList.map((gif: SubmittedGif) => {
            const gifCardTitle: string = userNameByIdMap.get(gif.userId) + (gif.gifSearchText ? ` - ${gif.gifSearchText}` : '');
            return (
                <Grid item lg={isWinner ? 6 : 4} key={gif.id}>
                    <GifCard
                        gif={gif}
                        height={size}
                        width={size}
                        title={gifCardTitle}
                        showVoteIcons={true}
                        type={cardType}
                        key={gif.id}>
                    </GifCard>
                </Grid>)
        });
    }

    const showWinnerHeading = () => {
        if (!props.submittedGifs || !props.submittedGifs.length) {
            return <Typography variant="h5" component="h5" className={classes.boldText}>There were no submitted gifs this round!</Typography>;
        }
        else if (winnerGifs.length === 1) {
            return <Typography variant="h5" component="h5" className={classes.boldText}>Winner!</Typography>
        }
        else if (winnerGifs.length > 1) {
            return <Typography variant="h5" component="h5" className={classes.boldText}>Tie!</Typography>;
        }
    }
    const showWinningGifs = () => {
        if (winnerGifs.length > 0) {
            return (
                <Grid container direction="row">
                    {generateGifPanel(winnerGifs, true)}
                </Grid>
            )
        }
    };
    const showConsolationHeading = () => {
        if (winnerGifs.length === 0 && consolationGifs.length > 0) {
            return <Typography variant="h5" component="h5" className={classes.boldText}>There were no votes cast this round!</Typography>
        }
        if (consolationGifs.length > 0) {
            return (
                <Typography variant="h5" component="h5" className={classes.boldText}>Runner up(s):</Typography>
            );
        }
    }
    const showConsolationGifs = () => {
        if (consolationGifs.length > 0) {
            return (
                <Grid container direction="row">
                    {generateGifPanel(consolationGifs, false)}
                </Grid>
            )
        }

    };
    return (
        <Grid container>
            <Grid item md={10}>
                <Grid container justify="center" alignItems="center" direction="column">
                    <Grid item className="next-round">
                        {showWinnerHeading()}

                        <div className="next-round-icon">
                            <Fab color="secondary" aria-label="next round" onClick={() => props.startNewRound()} size="small">
                                <ArrowForwardIosIcon />
                            </Fab>
                        </div>
                    </Grid>

                    <Grid item>
                        {showWinningGifs()}
                    </Grid>

                    <Grid item>
                        {showConsolationHeading()}
                    </Grid>

                    <Grid item>
                        {showConsolationGifs()}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
