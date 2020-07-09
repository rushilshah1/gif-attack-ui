import React, { useState } from 'react';
//UI + CSS
import { makeStyles, Theme, createStyles, Typography } from '@material-ui/core';
import './Timer.scss';
//Apollo + GraphQL
import { ROUND_CLOCK_SUBSCRIPTION } from '../graphql/round';
import { useSubscription } from '@apollo/react-hooks';
//Components
import { IClock } from '../models/Round';

interface ITimerProps {
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

export const Timer: React.FC<ITimerProps> = props => {
    const classes = useStyles();
    const [clock, setClock] = useState<IClock | null>(null);

    const roundClockSubscription = useSubscription(ROUND_CLOCK_SUBSCRIPTION, {
        variables: { gameId: props.gameId },
        onSubscriptionData: (response) => {
            setClock(response.subscriptionData.data.roundClock)
        }
    });

    const showTimer = () => {
        if (!clock) {
            return;
        }
        else {
            return clock.minutes === 0 && clock.seconds <= 30 ?
                <Typography variant="h4" component="h4" className={classes.timerWarning}>{clock.minutes}:{clock.seconds < 10 ? `0${clock.seconds}` : clock.seconds}</Typography> :
                <Typography variant="h4" component="h4" className={classes.timerRegular}>{clock.minutes}:{clock.seconds < 10 ? `0${clock.seconds}` : clock.seconds}</Typography>
        }
    };

    return (
        <div>
            {showTimer()}
        </div>
    )
}
