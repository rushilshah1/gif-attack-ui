import React, { useEffect, useState } from 'react'
import { Container, Avatar, Button, makeStyles, Theme, createStyles, Grid, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { deepOrange, deepPurple, cyan, pink } from '@material-ui/core/colors';
import './Scoreboard.css';
import { User } from '../models/User';

interface ScoreboardProps {
    players: Array<User>;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        orange: {
            color: theme.palette.getContrastText(deepOrange[500]),
            backgroundColor: deepOrange[500],
            width: theme.spacing(7),
            height: theme.spacing(7),
        },
        purple: {
            color: theme.palette.getContrastText(deepPurple[500]),
            backgroundColor: deepPurple[500],
            width: theme.spacing(7),
            height: theme.spacing(7),
        },
        cyan: {
            color: theme.palette.getContrastText(cyan[500]),
            backgroundColor: cyan[500],
            width: theme.spacing(7),
            height: theme.spacing(7),
        },
        pink: {
            color: theme.palette.getContrastText(pink[500]),
            backgroundColor: pink[500],
            width: theme.spacing(7),
            height: theme.spacing(7),
        },
    }),
);

const COLORS: Array<string> = ['orange', 'purple', 'cyan', 'pink'];

export const Scoreboard: React.FC<ScoreboardProps> = props => {
    const classes = useStyles();
    const [playerAvatarsMap, setPlayerAvatarsMap] = useState<Map<string, string>>(new Map());

    const generateAvatarIcons = () => {
        return props.players.map((player: User) => {
            const playerName: string = player.name
            const nameSplit: Array<string> = playerName.split(" ", 2);
            let avatarName: string = nameSplit[0].charAt(0).toUpperCase();
            if (nameSplit.length > 1) {
                avatarName += nameSplit[1].charAt(0).toUpperCase()
            }
            let randomColor: string = playerAvatarsMap.has(playerName) ? playerAvatarsMap.get(playerName)! : COLORS[Math.floor(Math.random() * Math.floor(COLORS.length))];
            if (!playerAvatarsMap.has(playerName)) {
                playerAvatarsMap.set(playerName, randomColor);
            }

            return (<ListItem key={playerName}>
                <ListItemIcon>
                    <Avatar alt={playerName} className={classes[randomColor]}>

                        {avatarName}</Avatar>
                </ListItemIcon>
                <ListItemText primary={playerName} className="playerName" />
                <ListItemText primary={player.score} className="playerScore" />
            </ListItem>
            )
        })
    }

    return (
        <List className="playerList">
            <h3 className="player-title">Players:</h3>
            {generateAvatarIcons()}
        </List>

    )
}
