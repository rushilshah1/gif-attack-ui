import React, { useState, useEffect } from 'react'
import { Theme, createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './Topic.css';
import { TextField, Button } from '@material-ui/core';

interface TopicProps {
    submitTopic: (text: string) => void;
    topic: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: 20,
            width: '50%',
            marginLeft: 'auto',
            marginRight: 'auto'
        },
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            width: '50%',
            marginLeft: 'auto',
            marginRight: 'auto'
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
        submitButton: {
            textAlign: 'center',
            marginLeft: '20px',
            width: 'auto',
            minWidth: '50px',
            height: 'fit-content',
            // height: 'fit-content',
            bottom: 0
        },
        topicText: {
            width: "auto",
            minWidth: "200px",
            // height: 'fit-content',
        },
        boldText: {
            fontWeight: "bold"
        }
    }),
);

const ExpansionPanel = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            marginTop: 20,
            marginLeft: 'auto',
            marginRight: 'auto'
        },
    },
    expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        // backgroundColor: 'rgba(0, 0, 0, .03)',
        // borderBottom: '1px solid rgba(0, 0, 0, .125)',
        // marginBottom: -1,
        '&$expanded': {
        },
    },
    content: {
        '&$expanded': {
            // margin: '12px 0',
        },
    },
    expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        display: 'flex',
        marginBottom: 'auto',
        marginTop: 'auto'
    },
}))(MuiExpansionPanelDetails);

export const Topic: React.FC<TopicProps> = props => {
    const classes = useStyles();
    const [userSelectedTopic, setUserSelectedTopic] = useState<string>('');
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <div>
            {!props.topic && <Typography variant="h5" component="h5">There is no topic selected for the round yet</Typography>}
            {props.topic && <div className="topic">
                <Typography variant="h5" component="h5" className={classes.boldText}>Topic: &nbsp;</Typography>
                <Typography variant="h5" component="h5">{props.topic} </Typography>
            </div>
            }
            <ExpansionPanel expanded={expanded === 'topicSubmitForm'} onChange={handleChange('topicSubmitForm')} className={classes.root}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>I have a topic!</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div className="topic-form">
                        <TextField className={classes.topicText} color="secondary" id="standard-basic" label="Enter a topic" value={userSelectedTopic} onChange={(e) => setUserSelectedTopic(e.target.value)} multiline />
                        <Button variant="contained" color="primary"
                            onClick={() => {
                                props.submitTopic(userSelectedTopic);
                                setExpanded(false);
                                setUserSelectedTopic('');
                            }}
                            className={classes.submitButton}> Submit</Button>
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>

        </div>

    )
}
