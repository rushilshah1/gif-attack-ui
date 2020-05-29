import React, { useState, useEffect } from 'react'
import './Timer.css';
import ENVIRONMENT from '../common/environments';
import { ENVIRONMENT_LOCAL } from '../common/constants';

interface IClock {
    minutes: number;
    seconds: number;
}

interface TimerProps {
    completeRound: () => void;
}
export const Timer: React.FC<TimerProps> = props => {
    const initialClock: IClock = (ENVIRONMENT.ENV === ENVIRONMENT_LOCAL) ? { minutes: 0, seconds: 50 } : { minutes: 2, seconds: 30 }
    const [clock, setClock] = useState<IClock>(initialClock);

    useEffect(() => {
        let interval = setInterval(() => {
            if (clock.seconds > 0) {
                setClock(prevClock => {
                    return { ...prevClock, ...{ seconds: prevClock.seconds - 1 } }
                });
            }
            if (clock.seconds === 0) {
                if (clock.minutes === 0) {
                    clearInterval(interval);
                    props.completeRound(); //Complete round when timer expires
                }
                else {
                    setClock(prevClock => {
                        return { minutes: prevClock.minutes - 1, seconds: 59 }
                    })
                }
            }

        }, 1000);
        return () => clearInterval(interval);
    }, [clock]);

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
