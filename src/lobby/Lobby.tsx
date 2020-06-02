import React from 'react'
import { Container, Avatar, Button, makeStyles, Theme, createStyles, Grid, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import './Lobby.css';
import { User } from '../models/User';

interface LobbyProps {
    players: Array<User>;
    gameId: string;
    startGame: () => void;
}


export const Lobby: React.FC<LobbyProps> = props => {
    return (
        <Container>
            <h3>There are currently {props.players.length} player(s) in the game</h3>

            <h4>Send the game code to your friends so they can join the game session!</h4>
            <div className="gameCode">
                {props.gameId}
            </div>

            <Button variant="contained" color="primary" onClick={() => props.startGame()}>Start Game
            </Button>
        </Container>
    )
}
