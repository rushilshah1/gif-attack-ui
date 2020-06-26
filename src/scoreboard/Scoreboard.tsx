import React, { useEffect, useState } from 'react'
import { Container, Avatar, Button, makeStyles, Theme, createStyles, Grid, List, ListItem, ListItemIcon, ListItemText, TableContainer, Paper, Table, TableHead, TableRow, TableCell, Typography, TableBody } from '@material-ui/core';
import { deepOrange, deepPurple, cyan, pink } from '@material-ui/core/colors';
import './Scoreboard.css';
import { User } from '../models/User';
import MaterialTable from "material-table";


interface ScoreboardProps {
    players: Array<User>;
}
/*
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
*/
const tableCellStyle = {

    // padding: 5
}
const useStyles = makeStyles({
    table: {
        height: "auto"
    },
    tableContainer: {
        minWidth: "25%",
        // minHeight: "100%",
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

        // <TableContainer component={Paper} className={classes.tableContainer}>
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
        // </TableContainer>

    )
}
