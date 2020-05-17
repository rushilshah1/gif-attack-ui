import React, { useState, useEffect } from 'react'
import { TextField, Button, withStyles } from '@material-ui/core'
import { useTopic } from '../graphql/topic-hooks';
import './Topic.css';

const StyledInputText = withStyles({
    root: {
        paddingTop: "20px",
        width: "auto",
        minWidth: "500px"
    }
})(TextField);

export type ITopic = { gameId?: string, text: string };

interface TopicProps {
    setTopic: (text: any) => any;
    submitTopic: (text: string) => void;
    topic: string;
}


export const Topic: React.FC<TopicProps> = props => {
    //const [userSubmitedTopic, setUserSubmitedTopic] = useState<string>(props.topic)
    // useEffect(() => {
    //     setUserSubmitedTopic(props.topic)
    //     console.log(`${userSubmitedTopic} is the topic in the Topic comp`);
    // });
    //onChange = { e => setUserSubmitedTopic(e.target.value)}
    return (
        <div className="topic">
            <div className="topicText">
                <StyledInputText className="topicText" id="standard-basic" label="Enter a topic" value={props.topic} onChange={(e) => props.setTopic(e.target.value)} multiline></StyledInputText>
            </div >
            <div className="submitButton">
                <Button variant="contained" color="primary" onClick={() => {
                    props.submitTopic(props.topic)
                }}> Submit</Button>
            </div>
        </div>

    )
}
