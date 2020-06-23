import React, { useState, useEffect } from 'react'
import './Timer.css';
import ENVIRONMENT from '../common/environments';
import { ENVIRONMENT_LOCAL } from '../common/constants';
import { ROUND_CLOCK_SUBSCRIPTION } from '../graphql/round';
import { useSubscription } from '@apollo/react-hooks';
import { IClock } from '../models/Round';

interface TimerProps {
    gameId: string;
}
export const Timer: React.FC<TimerProps> = props => {
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
                <div className="timer-warning">
                    <h1>{clock.minutes}:{clock.seconds < 10 ? `0${clock.seconds}` : clock.seconds}</h1>
                </div>
                :
                <div className="timer-standard">
                    <h1>{clock.minutes}:{clock.seconds < 10 ? `0${clock.seconds}` : clock.seconds}</h1>
                </div>
            }
        </div>
    )
}
