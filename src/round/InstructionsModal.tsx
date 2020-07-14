import React, { useState } from 'react'
//UI + CSS
import { makeStyles, Theme, createStyles, Button, withStyles } from '@material-ui/core';
import './InstructionsModal.scss';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            position: 'absolute',
            // minWidth: 450,
            // minHeight: 450,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }),
);

const CloseButton = withStyles({
    root: {
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'block'
    }
})(Button);

interface InstructionsModalProps {
    closeInstructionsModal: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = React.forwardRef((props, ref) => {
    const classes = useStyles();
    const [modalStyle] = useState({ top: '50%', left: '50%', transform: `translate(-50%, -50%)` });

    return (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="modal-title">Game Instructions</h2>
            <p id="modal-subtitle">
                Do you have what it takes to be crowned THE Gif King/Queen?
            </p>
            <p>
                Each round starts with a topic. A topic can be submitted by anyone in the game and is the basis
                for searching and submitting Gifs. Making some topics personalized to your friend group is bound to spice up the fun!
                Here are a few example topics to get your game started:
            </p>
            <ul>
                <li>2020 so far has me feeling like...</li>
                <li>My morning routine goes like... </li>
                <li>When I see my boys after months of quarantine...</li>
            </ul>
            <p>
                After a topic is submitted everyone needs to search and submit a gif that they feel best represents the topic.
                Keep in mind, that there is no single judge - instead the entire group will vote by clicking on the submitted gif that they enjoyed the best.
                After voting is complete, the results of the round will be shown and a winner will be crowned!
            </p>
            <p id="modal-closing">
                Even if you're down on the scoreboard, remember to never GIF up!
            </p>
            <CloseButton color='primary' variant="contained" onClick={() => props.closeInstructionsModal()}>Let's Play!</CloseButton>
        </div>


    )
});
