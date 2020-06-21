import React, { useState, useEffect } from 'react'
import { TextField, Button, withStyles } from '@material-ui/core'
import './Topic.css';

const StyledInputText = withStyles({
    root: {
        // paddingTop: "20px",
        width: "auto",
        minWidth: "400px"
    }
})(TextField);

const SubmitButton = withStyles({
    root: {
        display: 'block',

        padding: '10px',
        textAlign: 'center',
        justifyContent: 'normal',
        marginLeft: '20px',
        minWidth: '50px'
        // width: '50%'
    }
})(Button);

interface TopicProps {
    setTopic: (text: any) => any;
    submitTopic: (text: string) => void;
    topic: string;
}


export const Topic: React.FC<TopicProps> = props => {
    return (
        <div className="topic">
            <StyledInputText className="topicText" id="standard-basic" label="Enter a topic" value={props.topic} onChange={(e) => props.setTopic(e.target.value)} multiline></StyledInputText>
            <SubmitButton variant="contained" color="primary" onClick={() => {
                props.submitTopic(props.topic)
            }}> Submit</SubmitButton>
        </div>

    )
}
