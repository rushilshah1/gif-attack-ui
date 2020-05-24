import React from 'react'
import { Container, Avatar, Button } from '@material-ui/core'

interface LobbyProps {
    players: Array<string>;
    gameId: string;
    startGame: () => void; //AKA Start the game
}

export const Lobby: React.FC<LobbyProps> = props => {
    return (
        <Container>
            <p>Waiting for Game {props.gameId} to start...</p>
            {props.players.map((player: string) => {
                // const nameSplit: Array<string> = player.split(" ", 2);
                // let avatarName: string = nameSplit[0].charAt(0).toUpperCase();
                // if (nameSplit.length > 1) {
                //     avatarName += nameSplit[1].charAt(0).toUpperCase()
                // }
                return <Avatar alt={player} src="/fake.jpg" key={player}>{player.charAt(0)}</Avatar>
            })}
            <Button variant="contained" color="primary" onClick={() => props.startGame()}>Start Game
            </Button>
        </Container>
    )
}
