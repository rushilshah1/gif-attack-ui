import React from 'react'
import { SubmittedGif } from '../models/SubmittedGif'
import { Card, CardContent, Typography, CardActions, makeStyles, IconButton } from '@material-ui/core'
import { Gif } from '@giphy/react-components'
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import './GifCard.css';

export enum GifCardStyle {
    Highlighted = "highlightedGif",
    Regular = "regularGif",
}
interface IGifCardProps {
    gif: SubmittedGif;
    width: number;
    height: number;
    type: GifCardStyle;
    title?: string;
    showVoteIcons?: boolean;
    voteGif?: (gif: SubmittedGif) => void;
    disableVoting?: boolean;
}

const cardRootStyle = {
    display: 'inline-block',
    borderRadius: '25px',
    justifyContent: 'space-between',
    marginTop: '15px',
    marginRight: '15px',
    borderStyle: 'outset'
};

const useStyles = makeStyles({
    root: cardRootStyle,
    highlightedGif: {
        ...cardRootStyle,
        borderColor: 'gold'
    },
    regularGif: {
        ...cardRootStyle,
        backgroundColor: 'lightgrey',
    }
});

export const GifCard: React.FC<IGifCardProps> = props => {
    const classes = useStyles();
    const generateVoteIcons = (numVotes: number) => {
        const arrVotes: Array<any> = Array.from(new Array(numVotes), x => Math.random());
        return arrVotes.map(index =>
            < IconButton color='secondary' key={index}>
                <FavoriteOutlinedIcon />
            </IconButton >
        );
    }

    const generateVoteButton = () => {
        return (
            <IconButton aria-label="Vote for gif" onClick={() => {
                if (!props.voteGif) return;
                props.voteGif(props.gif)
            }} color='secondary' disabled={props.disableVoting ? true : false}>
                <FavoriteOutlinedIcon />
            </IconButton>)
    }
    return (
        // <Card className={classes[props.type]} variant="elevation" square={true} key={props.gif.id}>
        //     <CardContent>
        //         <Typography variant="subtitle1">
        //             {props.title}
        //             <br />
        //         </Typography>
        //         <Gif gif={props.gif.content} width={props.width} height={props.height} hideAttribution={true} noLink={true}></Gif>
        //     </CardContent>
        //     <CardActions disableSpacing className="cardActions">
        //         {props.showVoteIcons && generateVoteIcons(props.gif.numVotes)}
        //         {props.voteGif && generateVoteButton()}
        //     </CardActions>
        // </Card>
        <div className="gif-card">
            <Typography variant="subtitle1">
                {props.title}
            </Typography>
            <Gif gif={props.gif.content} width={props.width} height={props.height} hideAttribution={true} noLink={true}></Gif>
            <div className="num-votes">
                {props.showVoteIcons && generateVoteIcons(props.gif.numVotes)}
            </div>
            <div className="vote-icon">
                {props.voteGif && generateVoteButton()}
            </div>
        </div>
    )
}
