import React from 'react'

// UI + CSS
import { Container, Typography, Button, makeStyles, Theme, createStyles, Grid } from '@material-ui/core'
import './Lobby.scss';

// Models
import { User } from '../models/User';

interface LobbyProps {
    players: Array<User>;
    gameId: string;
    startGame: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        code: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 20,
            fontSize: 'xx-large',
            fontWeight: 'bolder'
        }
    }),
);

export const Lobby: React.FC<LobbyProps> = props => {
    const classes = useStyles();

    return (
        <Grid container justify="center" alignItems="flex-start">
            <Grid item>
                <Typography variant="h6">Send the game code to your friends so they can join the game session!</Typography>

                <Grid container className={classes.code} direction="column" spacing={1}>
                    <Grid item>
                        {props.gameId}
                    </Grid>

                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={() => props.startGame()}>Start Game</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
