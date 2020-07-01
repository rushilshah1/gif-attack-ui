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
import { GifCard, GifCardStyle } from '../gif/GifCard';

// Constants
import { WINNER_GIF_SIZE, CONSOLIDATION_GIF_SIZE } from '../common/constants';

export interface RoundResultProps {
    players: Array<User>;
    submittedGifs: Array<SubmittedGif>;
    startNewRound: () => void;
}

const ResultDivider = withStyles({
    root: {
        marginTop: '2%',
        marginBottom: '2%'
    }
})(Divider);

export const RoundResult: React.FC<RoundResultProps> = props => {
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
                <Grid item lg={3} key={gif.id}>
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
            return <h2>There were no submitted gifs this round!</h2>;
        }
        else if (winnerGifs.length === 1) {
            return <h1>Winner!</h1>
        }
        else if (winnerGifs.length > 1) {
            return <h2>Tie!</h2>;
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
            return <h2>There were no votes cast this round!</h2>
        }
        if (consolationGifs.length > 0) {
            return (
                <div>
                    <ResultDivider />
                    <h2>Runner up(s):</h2>
                </div>
            );
        }
    }
    const showConsolationGifs = () => {
        if (consolationGifs.length > 0) {
            return (
                <Grid container direction="row" justify="center" alignItems="flex-start">
                    {generateGifPanel(consolationGifs, false)}
                </Grid>
            )
        }

    };
    return (
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
    )
}
