import React, { useEffect, useState } from 'react'
import { Container, Avatar, Button, makeStyles, Theme, createStyles, Grid, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { deepOrange, deepPurple, cyan, pink } from '@material-ui/core/colors';
import './Players.css';

interface PlayersProps {
    players: Array<string>;
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

export const Players: React.FC<PlayersProps> = props => {
    const classes = useStyles();
    const [playerAvatarsMap, setPlayerAvatarsMap] = useState<Map<string, string>>(new Map());

    const generateAvatarIcons = () => {
        return props.players.map((player: string) => {
            const nameSplit: Array<string> = player.split(" ", 2);
            let avatarName: string = nameSplit[0].charAt(0).toUpperCase();
            if (nameSplit.length > 1) {
                avatarName += nameSplit[1].charAt(0).toUpperCase()
            }
            let randomColor: string = playerAvatarsMap.has(player) ? playerAvatarsMap.get(player)! : COLORS[Math.floor(Math.random() * Math.floor(COLORS.length))];
            if (!playerAvatarsMap.has(player)) {
                playerAvatarsMap.set(player, randomColor);
            }

            return (<ListItem key={player}>
                <ListItemIcon>
                    <Avatar alt={player} className={classes[randomColor]}>

                        {avatarName}</Avatar>
                </ListItemIcon>
                <ListItemText primary={player} className="playerName" />
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
