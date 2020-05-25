import React from 'react'
import { Container, Avatar, Button, makeStyles, Theme, createStyles, Grid, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import './Lobby.css';

interface LobbyProps {
    players: Array<string>;
    gameId: string;
    startGame: () => void; //AKA Start the game
}


export const Lobby: React.FC<LobbyProps> = props => {
    return (
        <Container>
            <h3>There are currently {props.players.length} user(s) in the game!</h3>

            <h4>Send the Game <b>{props.gameId}</b> to your friends so they can join the game session!</h4>

            <Button variant="contained" color="primary" onClick={() => props.startGame()}>Start Game
            </Button>
        </Container>
    )
}
