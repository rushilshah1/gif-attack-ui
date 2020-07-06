import React, { useState, useEffect } from 'react'
import './Timer.scss';
import ENVIRONMENT from '../common/environments';
import { ENVIRONMENT_LOCAL } from '../common/constants';
import { ROUND_CLOCK_SUBSCRIPTION } from '../graphql/round';
import { useSubscription } from '@apollo/react-hooks';
import { IClock } from '../models/Round';
import { makeStyles, Theme, createStyles, Typography } from '@material-ui/core';

interface TimerProps {
    gameId: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {

        },
        timerRegular: {
            fontWeight: "bold"
        },
        timerWarning: {
            fontWeight: "bold",
            color: 'red'
        }
    })
);

export const Timer: React.FC<TimerProps> = props => {
    const classes = useStyles();
    const [clock, setClock] = useState<IClock | null>(null);

    const roundClockSubscription = useSubscription(ROUND_CLOCK_SUBSCRIPTION, {
        variables: { gameId: props.gameId },
        onSubscriptionData: (response) => {
            setClock(response.subscriptionData.data.roundClock)
        }
    });
    if (!clock) {
        return <div></div>;
    }
    return (
        <div>
            {clock.minutes === 0 && clock.seconds <= 30 ?
                <Typography variant="h4" component="h4" className={classes.timerWarning}>{clock.minutes}:{clock.seconds < 10 ? `0${clock.seconds}` : clock.seconds}</Typography>
                :
                <Typography variant="h4" component="h4" className={classes.timerRegular}>{clock.minutes}:{clock.seconds < 10 ? `0${clock.seconds}` : clock.seconds}</Typography>
            }
        </div>
    )
}
