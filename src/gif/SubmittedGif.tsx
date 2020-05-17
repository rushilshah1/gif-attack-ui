import React from 'react'
import { Container } from '@material-ui/core'
import { Gif } from '@giphy/react-components'
import './SubmittedGif.css';

export interface SubmittedGifProps {
    submittedGifs: Array<any>;
}

export const SubmittedGif: React.FC<SubmittedGifProps> = props => {


    return (
        <Container>
            <div>
                {props.submittedGifs.map((submittedGif) => <Gif className="submittedGif" key={submittedGif.id} gif={submittedGif} width={250} height={250} hideAttribution={true}></Gif>)}
            </div>
        </Container>
    )
}
