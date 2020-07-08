import React from 'react'
import { Grid, Hidden, Typography, Icon, withStyles, makeStyles, Theme, createStyles } from '@material-ui/core'
import { Timer } from '../round/Timer'
import './GameDetails.scss';
import { Game } from '../models/Game';

export interface GameDetailsProps {
    currentGame: Game;

}

// const StyledHelpIcon = withStyles({
//     root: {
//         fontSize: "15px",
//         width: 'auto'
//     }
// })(HelpIcon);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {

        },
        boldText: {
            fontWeight: "bold",
            fontStyle: theme.typography.fontFamily
        }
    })
);

export const GameDetails: React.FC<GameDetailsProps> = props => {
    const classes = useStyles();
    return (
        <Grid container spacing={2} direction="column" justify="flex-start" alignItems="center">
            <Hidden smDown>
                <Grid item>
                    <a href="/">
                        <img className="small-logo" src={require('./../assets/logo.png')} />
                    </a>
                </Grid>
            </Hidden>
            <Grid item>
                <div className="round-heading">
                    <div className="round-number">
                        <Typography variant="h4" component="h4" className={classes.boldText}>Round {props.currentGame.roundNumber}</Typography>
                        {/* <Icon color='primary' className='round-help' onClick={() => openInstructionsModal()}>
                            <StyledHelpIcon />
                        </Icon> */}
                    </div>
                </div>
                {/* {showInstructionsModal()} */}
            </Grid>

            {props.currentGame.roundActive &&
                <Grid item>
                    <Timer gameId={props.currentGame.id}></Timer>
                </Grid>}
        </Grid>
    )
}
