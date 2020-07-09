import React, { useState } from 'react'

//UI + CSS
import './GameDetails.scss';
import { Grid, Hidden, Typography, Icon, withStyles, makeStyles, Theme, createStyles, Modal, Backdrop } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';

//Components
import { Timer } from '../round/Timer'
import { Game } from '../models/Game';
import { LOCAL_STORAGE_PLAYED_BEFORE } from '../common/constants';
import { InstructionsModal } from '../round/InstructionsModal';

export interface IGameDetailsProps {
    currentGame: Game;
}

const StyledHelpIcon = withStyles({
    root: {
        fontSize: "15px",
        width: 'auto',
    }
})(HelpIcon);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        boldText: {
            fontWeight: "bold",
            fontStyle: theme.typography.fontFamily
        }
    })
);

export const GameDetails: React.FC<IGameDetailsProps> = props => {
    const classes = useStyles();
    const [openInstructions, setOpenInstructions] = useState<boolean>(localStorage.getItem(LOCAL_STORAGE_PLAYED_BEFORE) ? false : true);

    /*Instructions Modal */
    const openInstructionsModal = () => {
        setOpenInstructions(true);
    }

    const closeInstructionsModal = () => {
        setOpenInstructions(false);
        localStorage.setItem(LOCAL_STORAGE_PLAYED_BEFORE, 'true');
    }

    const showInstructionsModal = () => {
        return openInstructions && <Modal
            open={openInstructions}
            onClose={closeInstructionsModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 1500,
            }}>
            <InstructionsModal closeInstructionsModal={() => closeInstructionsModal()} />
        </Modal>;
    }

    return (
        <Grid container spacing={1} direction="column" justify="flex-start" alignItems="center">
            <Hidden smDown>
                <Grid item>
                    <a href="/">
                        <img className="small-logo" src={require('./../assets/logo.png')} />
                    </a>
                </Grid>
            </Hidden>
            {props.currentGame.gameStarted &&
                <Grid item>
                    <div className="round-number">
                        <Typography variant="h4" component="h4" className={classes.boldText}>Round {props.currentGame.roundNumber}</Typography>
                        <Icon color='primary' className='round-help' onClick={() => openInstructionsModal()}>
                            <StyledHelpIcon />
                        </Icon>
                    </div>
                    {showInstructionsModal()}
                </Grid>}

            {props.currentGame.roundActive &&
                <Grid item>
                    <Timer gameId={props.currentGame.id}></Timer>
                </Grid>}
        </Grid>
    )
}
