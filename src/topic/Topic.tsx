import React, { useState, useEffect } from 'react'
import { TextField, Button, withStyles } from '@material-ui/core'
import styled from 'styled-components';
import { useTopic } from '../graphql/topic-hooks';

// const StyledInputText = withStyles({
//     root: {
//         //background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
//         width: "auto",
//         minWidth: "200px"
//     }
// })(TextField);

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
                <TextField className="topicText" id="standard-basic" label="Enter a topic" value={props.topic} onChange={(e) => props.setTopic(e.target.value)} multiline></TextField>
            </div >
            <div>
                <Button variant="contained" color="primary" onClick={() => {
                    props.submitTopic(props.topic)
                }}> Submit</Button>
            </div>
        </div>

    )
}
