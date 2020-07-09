import React, { useState } from 'react';
//UI + CSS
import './GifSelect.scss';
import { Grid } from '@material-ui/core';
//Components
import ReactGiphySearchbox from 'react-giphy-searchbox';
//Constants
import ENVIRONMENT from '../common/environments';

interface IGifSelectProps {
    selectGif: (gif: any, searchText: string) => void;
}

export const GifSelect: React.FC<IGifSelectProps> = props => {

    const [gifSearchInput, setGifSearchInput] = useState<string>('');

    return (
        <Grid container direction="row" justify="center">
            <div className="gif-selection" >
                <ReactGiphySearchbox
                    apiKey={ENVIRONMENT.GIPHY_KEY}
                    onSelect={(gif) => {
                        props.selectGif(gif, gifSearchInput)
                    }}
                    onSearch={(text) => setGifSearchInput(text)}
                    wrapperClassName={"searchbox-wrapper"}
                    searchFormClassName={"searchbox-search"}
                    listWrapperClassName={"searchbox-list"}
                    listItemClassName={"searchbox-image"}
                    gifListHeight={350}
                    gifPerPage={10}
                    masonryConfig={
                        [
                            { columns: 1, imageWidth: 150, gutter: 5 },
                            { mq: '650px', columns: 2, imageWidth: 150, gutter: 10 },
                            { mq: '1300px', columns: 3, imageWidth: 190, gutter: 10 },
                        ]}
                />
            </div >
        </Grid>
    )
}
