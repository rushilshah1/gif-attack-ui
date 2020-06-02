import React, { useState } from 'react'
import { makeStyles, Theme, createStyles, Button } from '@material-ui/core';


const getModalStyle = () => {
    return {
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
    };
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            position: 'absolute',
            minWidth: 450,
            minHeight: 450,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }),
);

interface InstructionsModalProps {
    closeInstructionsModal: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = React.forwardRef((props, ref) => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);


    // const instructions = (
    //     <div style={modalStyle} className={classes.paper}>
    //         <h2 id="modal-title">Game Instructions</h2>
    //         <p id="modal-subtitle">
    //             Do you have what it takes to be crowned Gif King/Queen?
    //         </p>
    //         <p>
    //             Each round starts with a topic. A topic can be submitted by anyone in the game and is the basis
    //             for searching and submitting Gifs! Making some personal topics to your friend group is bound to spice up the fun!
    //             Here are few example topics to get your game started:
    //             <ul>
    //                 <li>2020 so far has me feeling like...</li>
    //                 <li>My morning routine goes like... </li>
    //                 <li>When I see my boys after months of quarantine...</li>
    //             </ul>
    //         </p>
    //         <p>
    //             After a topic is submitted everyone needs to search and submit a gif that they feel best represents the topic.
    //             Keep in mind, that there is no one judge - instead the entire group will vote on the submitted gif that they enjoyed the best.
    //             After voting is complete, the results of the round will be shown and a winner will be crowned!
    //         </p>
    //         <p>
    //             Even if you're down on the scoreboard, remember to never GIF up!
    //         </p>
    //         {/* <Button color='primary' variant="contained" >Let's Play!</Button> */}
    //     </div>
    // );

    return (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="modal-title">Game Instructions</h2>
            <p id="modal-subtitle">
                Do you have what it takes to be crowned THE Gif King/Queen?
            </p>
            <p>
                Each round starts with a topic. A topic can be submitted by anyone in the game and is the basis
                for searching and submitting Gifs! Making some personal topics to your friend group is bound to spice up the fun!
                Here are few example topics to get your game started:
            </p>
            <ul>
                <li>2020 so far has me feeling like...</li>
                <li>My morning routine goes like... </li>
                <li>When I see my boys after months of quarantine...</li>
            </ul>
            <p>
                After a topic is submitted everyone needs to search and submit a gif that they feel best represents the topic.
                Keep in mind, that there is no one judge - instead the entire group will vote on the submitted gif that they enjoyed the best.
                After voting is complete, the results of the round will be shown and a winner will be crowned!
            </p>
            <p>
                Even if you're down on the scoreboard, remember to never GIF up!
            </p>
            <Button color='primary' variant="contained" onClick={() => props.closeInstructionsModal()}>Let's Play!</Button>
        </div>


    )
});
