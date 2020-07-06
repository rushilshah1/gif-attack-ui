import React, { useState, useEffect } from 'react'

// UI + CSS
import './Topic.scss';
import { TextField, Button, Grid, IconButton } from '@material-ui/core';
import { Theme, createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';

// ExpansionPanel
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface TopicProps {
    submitTopic: (text: string) => void;
    topic: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '50%',
            marginLeft: 'auto',
            marginRight: 'auto'
        },
        alignItemsAndJustifyContent: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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
        '&$expanded': {
        },
    },
    content: {
        '&$expanded': {
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
    const [enableTopicDeletion, setEnableTopicDeletion] = useState<boolean>(false);

    const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <Grid container direction="column" alignItems="center">
            {!props.topic && <ExpansionPanel expanded={expanded === 'topicSubmitForm'} onChange={handleChange('topicSubmitForm')} className={classes.root}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>I have a topic!</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container direction="row" className={classes.alignItemsAndJustifyContent} spacing={2}>
                        <Grid item lg={8}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                id="standard-basic"
                                label="Enter a topic"
                                value={userSelectedTopic}
                                onChange={(e) => setUserSelectedTopic(e.target.value)}
                                multiline />
                        </Grid>
                        <Grid item lg={3}>
                            <Button variant="contained" color="primary" fullWidth={true} size="small"
                                onClick={() => {
                                    props.submitTopic(userSelectedTopic);
                                    setEnableTopicDeletion(true);
                                    setExpanded(false);
                                    setUserSelectedTopic('');
                                }}
                            > Submit</Button>
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>}
            {props.topic &&
                <Grid item>
                    <div className="topic">
                        <Typography variant="h5" component="h5" className={classes.boldText}>Topic: &nbsp;</Typography>
                        <Typography variant="h5" component="h5">{props.topic} </Typography>
                            &nbsp;
                            {enableTopicDeletion && <IconButton
                            size="small"
                            edge='start'
                            onClick={() => {
                                props.submitTopic('')
                                setEnableTopicDeletion(false);
                            }}>
                            <DeleteIcon color="primary">
                            </DeleteIcon>
                        </IconButton>}
                    </div>
                </Grid>
            }
        </Grid>
    )
}
