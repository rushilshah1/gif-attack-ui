import React, { useEffect, useState } from 'react'
import './RoundResult.css';
import { SubmittedGif } from '../models/SubmittedGif';
import * as _ from "lodash";
import { Container, Card, CardHeader, CardContent, CardActions, IconButton, Divider, Fab, makeStyles, withStyles, Typography } from '@material-ui/core'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { User } from '../models/User';
import { WINNER_GIF_SIZE, CONSOLIDATION_GIF_SIZE } from '../common/constants';
import { partition } from 'lodash';
import { GifCard, GifCardStyle } from '../gif/GifCard';

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
            setConsolationGifs(consolationGifs => partitionedGifsByTag[1]);
        }

    }, []);

    const generateGifPanel = (gifList: Array<SubmittedGif>, isWinner: boolean) => {
        const size: number = isWinner ? WINNER_GIF_SIZE : CONSOLIDATION_GIF_SIZE;
        const cardType = isWinner ? GifCardStyle.Highlighted : GifCardStyle.Regular;
        const userNameByIdMap: Map<string, string> = new Map(props.players.map((player: User) => [player.id, player.name]));
        return gifList.map((gif: SubmittedGif) => {
            const gifCardTitle: string = userNameByIdMap.get(gif.userId) + (gif.gifSearchText ? ` - ${gif.gifSearchText}` : '');
            return <GifCard gif={gif} height={size} width={size} title={gifCardTitle} showVoteIcons={true} type={cardType} key={gif.id}></GifCard>
        });
    }

    const showWinnerHeading = () => {
        if (!props.submittedGifs || !props.submittedGifs.length) {
            return <h2>There were no submitted gifs this round!</h2>;
        }
        else if (winnerGifs.length === 1) {
            return <h2>We have a Winner!</h2>
        }
        else if (winnerGifs.length > 1) {
            return <h2>We have a Tie!</h2>;
        }
    }
    const showWinningGifs = () => {
        if (winnerGifs.length > 0) {
            return (
                <div className="winnerCards">
                    {generateGifPanel(winnerGifs, true)}
                </div>
            )
        }
    };
    const showConsolationHeading = () => {
        if (winnerGifs.length === 0 && consolationGifs.length > 0) {
            return <h2>There were no votes cast this round!</h2>
        }
        if (consolationGifs.length > 0) {
            return (<div>
                <ResultDivider />
                <h2>Runner up(s):</h2>
            </div>);
        }
    }
    const showConsolationGifs = () => {
        if (consolationGifs.length > 0) {
            return (
                <div className="consolationCards">
                    {generateGifPanel(consolationGifs, false)}
                </div>
            )
        }

    };
    return (
        <Container>
            <div className="next-round-action">
                <Fab color="secondary" aria-label="next round" onClick={() => props.startNewRound()} size="large">
                    <ArrowForwardIosIcon />
                </Fab>
                <h4 className="next-round-text">Next Round</h4>
                <div className="results">
                    {showWinnerHeading()}
                    {showWinningGifs()}
                    {showConsolationHeading()}
                    {showConsolationGifs()}
                </div>
            </div>


        </Container>
    )
}
