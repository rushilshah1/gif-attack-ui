import React from 'react';

//UI + CSS
import { Table, TableHead, TableRow, TableCell, TableBody, makeStyles } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import './Scoreboard.scss';

//Components
import { User } from '../models/User';
import { SubmittedGif } from '../models/SubmittedGif';

interface ScoreboardProps {
    players: Array<User>;
    submittedGifs: Array<SubmittedGif>;
    submissionActive: boolean;
}

const tableCellStyle = {
    minWidth: '10%',
    backgroundColor: '#F3FCFF'
}
const useStyles = makeStyles({
    table: {
        height: "auto"
    },
    header: {
        backgroundColor: '#14AFF2'
    },
    headerCell: {
        color: 'white'
    },
    nameCell: {
        ...tableCellStyle,
        minWidth: '70%'
    },
    submittedCell: {
        ...tableCellStyle,
        paddingRight: 0,
        color: 'green'
    },
    iconCell: {
        ...tableCellStyle,
        paddingLeft: 5,
        paddingRight: 5
    },
    scoreCell: {
        ...tableCellStyle,
        backgroundColor: '#D5F4FF',
    }
});


export const Scoreboard: React.FC<ScoreboardProps> = props => {
    const classes = useStyles();
    const maxScore: number = Math.max(...props.players.map(player => player.score));

    const showCheckMark = (hasSubmitted: boolean, votedGif: string) => {
        const isComplete: boolean = (props.submissionActive) ? hasSubmitted : votedGif !== '';
        return isComplete ? <DoneIcon color="inherit" fontSize={"large"} /> : null;
    }
    return (
        <Table className={classes.table} size="small" aria-label="scoreboard">
            <TableHead>
                <TableRow className={classes.header}>
                    <TableCell className={classes.headerCell}>
                        ATTACKERS
                    </TableCell>
                    <TableCell className={classes.headerCell} />
                    <TableCell className={classes.headerCell} />
                    <TableCell className={classes.headerCell} />
                </TableRow>
            </TableHead>
            <TableBody>
                {props.players.map((player: User) => (
                    <TableRow key={player.id}>
                        <TableCell className={classes.nameCell} align="left">{player.name}</TableCell>
                        <TableCell className={classes.submittedCell} align="right">
                            {showCheckMark(player.hasSubmitted, player.votedGif)}
                        </TableCell >
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
