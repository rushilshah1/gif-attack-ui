import React, { useState, useRef, useEffect } from 'react'
import { Container, Button, withStyles } from '@material-ui/core';
import { Topic, ITopic } from '../topic/Topic';
import { useTopic } from '../graphql/topic-hooks';

// interface Person {
//     firstName: string;
//     lastName: string;
// }

// interface Props {
//     text: string;
//     ok?: boolean;
//     i?: number;
//     fn?: (bob: string) => string;
//     person: Person
//     handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
// }

// interface TextNode {
//     text: string
// }

// interface IProps {

// }


const StyledContainer = withStyles({
    root: {
        //background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'black',
        height: '100%'
    }
})(Container);

export const Game: React.FC = props => {
    /*
    const [name, setName] = useState<string | null>(null);

    const delay = async (ms: number) => {
        await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
    };

    const getName = async () => {
        let r = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
        let data: Object = await r.json();
        //await delay(3000)
        setName(data['name']);
    }
    useEffect(() => {
        getName();
    }, []);
    */

    const tempGameId = '5ebb3d7469bb4c37860aa594'
    const [selectedTopic, selectTopic] = useState<string>('');
    const submitTopic = useTopic(tempGameId, (topic: ITopic) => {
        postTopic(topic)
    });

    const postTopic = (topic: ITopic) => {
        selectTopic(topic.text)
        console.log(`${selectedTopic} set in Game componenet`)

    }

    const setTopic = (text: string) => {
        console.log("Changing state from parent")
        selectTopic(text);
        console.log(`${selectedTopic} set in Game componenet`)
    }
    return (
        <StyledContainer>
            {/* {name ? (<h1 className="covalence-blue">Hello {name}</h1>) : (<h1 className="covalence-blue">Loading...</h1>)} */}
            <Topic topic={selectedTopic} submitTopic={text => (submitTopic(text))} setTopic={text => (selectTopic(text))} />
        </StyledContainer>


    )
}


