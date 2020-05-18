import React, { useState, useEffect } from 'react'
import { Container } from '@material-ui/core';
import { Topic, ITopic } from '../topic/Topic';
import { useTopic } from '../graphql/topic-hooks';
import './Round.css';
import { useMutation, useSubscription } from '@apollo/react-hooks';
import { GifSelect } from '../gif/GifSelect';
import { CREATE_GIF_MUTATION, GIF_CREATED_SUBSCRIPTION, IGif, VOTE_GIF_MUTATION, GIF_VOTED_SUBSCRIPTION } from '../graphql/gif-hooks';
import { SubmittedGif } from '../gif/SubmittedGif';
import { uniqueNamesGenerator, names } from 'unique-names-generator';
import { SubmittedGifModel } from '../models/SubmittedGifModel';

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



const tempGameId = '5ebb3d7469bb4c37860aa594'
const tempUserName = uniqueNamesGenerator({ dictionaries: [names], length: 1 });
export interface RoundProps {
    //isRoundComplete: (status: boolean) => boolean;
    roundNumber: number;
    users?: Array<string>;
    submittedGifs: Array<SubmittedGifModel>;
    addSubmitedGif: (submittedGif: SubmittedGifModel) => void;
    voteForSubmitedGif: (gifId: string) => void;
}

export const Round: React.FC<RoundProps> = props => {


    //console.log(`Game ${tempGameId} started. Playing as user ${tempUserName}`);
    const [selectedTopic, selectTopic] = useState<string>('');
    const [hasUserSubmittedGif, setHasUserSubmittedGif] = useState<boolean>(false);

    const [createGif, createGifResult] = useMutation(CREATE_GIF_MUTATION);
    const { data, loading, error } = useSubscription(GIF_CREATED_SUBSCRIPTION, {
        variables: { gameId: tempGameId }, onSubscriptionData: (response) => {
            gifReceived(response.subscriptionData.data.gifCreated)
        }
    });
    const [voteForGif, voteForGifResult] = useMutation(VOTE_GIF_MUTATION);
    const votedForSubscription = useSubscription(GIF_VOTED_SUBSCRIPTION, {
        variables: { gameId: tempGameId }, onSubscriptionData: (response) => {
            //console.log(`Subscription response: ${response.subscriptionData.data.gifVoteAdded}`);
            gifVoteReceived(response.subscriptionData.data.gifVoteAdded)
        }
    });

    //Logic to determine if the round is over (when everyone has casted their votes)
    // useEffect(() => {
    //     if (props.users.length === numVotesCasted) {

    //     }
    // }, [numVotesCasted])

    const submitGif = async (gifObject: any, searchText: string) => {
        const gifString: string = JSON.stringify(gifObject);
        const mutationInput: IGif = { gameId: tempGameId, gif: gifString, userName: tempUserName, gifSearchText: searchText, id: gifObject.id };
        await createGif({ variables: { input: mutationInput } });
        setHasUserSubmittedGif(true);
        console.log(`Create Gif Result: ${createGifResult}`);
    };

    const gifReceived = (gifResponse: IGif) => {
        const gifObject = JSON.parse(gifResponse.gif);
        gifResponse.gif = gifObject;
        gifResponse.id = gifObject.id;
        const submittedGif: SubmittedGifModel = new SubmittedGifModel(gifResponse);
        props.addSubmitedGif(submittedGif);
        console.log(`List of submitted gifs: ${props.submittedGifs}`);
    };

    const submitGifVote = async (gifId: string) => {
        const mutationInput: IGif = { gameId: tempGameId, id: gifId };
        await voteForGif({ variables: { input: mutationInput } });
        console.log(`Gif ${gifId} has been voted for`);
    }
    const gifVoteReceived = (gifResponse: IGif): boolean => {
        console.log(`Vote received from subscription callback ${gifResponse}`)
        props.voteForSubmitedGif(gifResponse.id);
        return true;
    }

    const submitTopic = useTopic(tempGameId, (topic: ITopic) => {
        selectTopic(topic.text)
        console.log(`${selectedTopic} set in Game componenet`)
    });

    return (
        <Container>
            <h3>Round {props.roundNumber}</h3>
            <Topic topic={selectedTopic} submitTopic={text => (submitTopic(text))} setTopic={text => (selectTopic(text))} />
            <SubmittedGif submittedGifs={props.submittedGifs} voteGif={(gifId) => (submitGifVote(gifId))}></SubmittedGif>
            {/* {!hasUserSubmittedGif && <GifSelect selectGif={gif => (submitGif(gif))}></GifSelect>} */}
            {<GifSelect selectGif={(gif, searchText) => (submitGif(gif, searchText))}></GifSelect>}
        </Container>


    )
}


