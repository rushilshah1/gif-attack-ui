import React, { useState, useRef, useEffect } from 'react'
import { Container, Button, withStyles } from '@material-ui/core';
import { Topic, ITopic } from '../topic/Topic';
import { useTopic } from '../graphql/topic-hooks';
import './Game.css';
import { useMutation, useSubscription } from '@apollo/react-hooks';
import { GifSelect } from '../gif/GifSelect';
import { CREATE_GIF_MUTATION, GIF_CREATED_SUBSCRIPTION, IGif } from '../graphql/gif-hooks';
import { Gif } from '@giphy/react-components';
import { SubmittedGif } from '../gif/SubmittedGif';
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


// const StyledContainer = withStyles({
//     root: {
//         //background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
//         borderRadius: 3,
//         border: 0,
//         color: 'black',
//         height: '100%'
//     }
// })(Container);

export const Game: React.FC = props => {

    const tempGameId = '5ebb3d7469bb4c37860aa594'
    const [selectedTopic, selectTopic] = useState<string>('');
    const [submittedGifs, setSubmittedGifs] = useState<Array<any>>([]);
    const [hasUserSubmittedGif, setHasUserSubmittedGif] = useState<boolean>(false);

    //const mutationInput = { gameId: tempGameId, gif: gif }
    //, { variables: { input: mutationInput } }
    const [createGif, createGifResult] = useMutation(CREATE_GIF_MUTATION);
    const { data, loading, error } = useSubscription(GIF_CREATED_SUBSCRIPTION, {
        variables: { gameId: tempGameId }, onSubscriptionData: (response) => {
            gifReceived(response.subscriptionData.data.gifCreated.gif)
        }
    });

    const submitGif = async (gifObject: any) => {
        const gifString: string = JSON.stringify(gifObject);
        const mutationInput = { gameId: tempGameId, gif: gifString }
        await createGif({ variables: { input: mutationInput } });
        setHasUserSubmittedGif(true);
        console.log(`Create Gif Result: ${createGifResult}`);
    };

    const gifReceived = (gifString: string) => {
        const gifObject = JSON.parse(gifString);
        setSubmittedGifs(submittedGifs => [...submittedGifs, gifObject])
        console.log(`List of submitted gifs: ${submittedGifs}`);
    };

    const submitTopic = useTopic(tempGameId, (topic: ITopic) => {
        selectTopic(topic.text)
        console.log(`${selectedTopic} set in Game componenet`)
    });
    const setTopic = (text: string) => {
        console.log("Changing state from parent")
        selectTopic(text);
        console.log(`${selectedTopic} set in Game componenet`)
    }

    return (
        <Container>
            {/* {name ? (<h1 className="covalence-blue">Hello {name}</h1>) : (<h1 className="covalence-blue">Loading...</h1>)} */}
            <Topic topic={selectedTopic} submitTopic={text => (submitTopic(text))} setTopic={text => (selectTopic(text))} />
            <SubmittedGif submittedGifs={submittedGifs}></SubmittedGif>
            {/* {!hasUserSubmittedGif && <GifSelect selectGif={gif => (submitGif(gif))}></GifSelect>} */}
            {<GifSelect selectGif={gif => (submitGif(gif))}></GifSelect>}
        </Container>


    )
}


