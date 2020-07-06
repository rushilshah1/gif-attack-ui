import React, { useEffect, useState } from 'react'
import { Container, Avatar, Button, makeStyles, Theme, createStyles, Grid, List, ListItem, ListItemIcon, ListItemText, TableContainer, Paper, Table, TableHead, TableRow, TableCell, Typography, TableBody } from '@material-ui/core';
import { deepOrange, deepPurple, cyan, pink } from '@material-ui/core/colors';
import './Scoreboard.scss';
import { User } from '../models/User';
import MaterialTable from "material-table";


interface ScoreboardProps {
    players: Array<User>;
}

const tableCellStyle = {

}
const useStyles = makeStyles({
    table: {
        height: "auto"
    },
    header: {
        backgroundColor: '#14AFF2',
        width: '100%',
        minWidth: '100%'
    },
    headerCell: {
        ...tableCellStyle,
        color: 'white'
    },
    nameCell: {
        ...tableCellStyle,
        backgroundColor: '#F3FCFF',
        minWidth: '80%'
    },
    iconCell: {
        ...tableCellStyle,
        backgroundColor: '#F3FCFF',
        minWidth: '10%',
        paddingRight: 5
    },
    scoreCell: {
        ...tableCellStyle,
        backgroundColor: '#D5F4FF',
        minWidth: '10%'
    }
});


export const Scoreboard: React.FC<ScoreboardProps> = props => {
    const classes = useStyles();
    const [playerAvatarsMap, setPlayerAvatarsMap] = useState<Map<string, string>>(new Map());
    const maxScore: number = Math.max(...props.players.map(player => player.score));

    return (

        <Table className={classes.table} size="small" aria-label="scoreboard">
            <TableHead>
                <TableRow className={classes.header}>
                    <TableCell className={classes.headerCell}>
                        ATTACKERS
                        {/* <Typography>ATTACKERS</Typography> */}
                    </TableCell>
                    <TableCell className={classes.headerCell} />
                    <TableCell className={classes.headerCell} />
                </TableRow>
            </TableHead>
            <TableBody>
                {props.players.map(player => (
                    <TableRow key={player.id}>
                        <TableCell className={classes.nameCell} align="left">{player.name}</TableCell>
                        <TableCell className={classes.iconCell} align="right">{player.score === maxScore && maxScore !== 0
                            ? <img src={require('../assets/leader.png')} />
                            : <img src={require('../assets/attacker.png')} />}
                        </TableCell >
                        <TableCell className={classes.scoreCell} align="center">{player.score}</ TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

    )
}
