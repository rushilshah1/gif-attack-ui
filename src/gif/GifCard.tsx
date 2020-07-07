import React from 'react'

//UI + CSS
import { Typography, makeStyles, IconButton } from '@material-ui/core'
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import './GifCard.scss';

//Components
import { SubmittedGif } from '../models/SubmittedGif'

//Giphy
import { Gif } from '@giphy/react-components'

export enum GifCardStyle {
    Votable = "votable-gif-card",
    Unvotable = "unvotable-gif-card",
    Voted = "voted-gif-card",
}
interface IGifCardProps {
    gif: SubmittedGif;
    width: number;
    height: number;
    type: GifCardStyle;
    title?: string;
    showVoteIcons?: boolean;
    voteForGif?: (gif: SubmittedGif) => void;
    gifIdVotedFor?: string | null;
}

export const GifCard: React.FC<IGifCardProps> = props => {
    // const classes = useStyles();
    const generateVoteIcons = (numVotes: number) => {
        const arrVotes: Array<number> = Array.from(new Array(numVotes), x => Math.random());
        if (!arrVotes || !arrVotes.length) {
            return <IconButton />
        }
        return arrVotes.map(index => (
            < IconButton color='secondary' key={index} size="small" disableRipple={true}>
                <FavoriteOutlinedIcon color="secondary" />
            </IconButton >
        ));
    }

    return (
        <div className={props.type}>
            <Typography variant="subtitle1" >
                {props.title || <br />}
            </Typography>
            <Gif
                gif={props.gif.content}
                width={props.width}
                height={props.height}
                hideAttribution={true}
                noLink={true}
                onGifClick={() => {
                    if (!props.voteForGif || props.gifIdVotedFor) return;
                    props.voteForGif(props.gif)
                }}
            ></Gif>
            {props.showVoteIcons && generateVoteIcons(props.gif.numVotes)}
            <div className="vote-icon">
                {(props.voteForGif && !props.gifIdVotedFor) &&
                    <IconButton
                        aria-label="Vote for gif"
                        color='secondary'
                        onClick={() => {
                            if (!props.voteForGif || props.gifIdVotedFor) return;
                            props.voteForGif(props.gif)
                        }}>
                        <FavoriteOutlinedIcon />
                    </IconButton>}
            </div>
        </div>
    )
}
