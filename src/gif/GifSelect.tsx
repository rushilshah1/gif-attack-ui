import React, { useState, useEffect } from 'react';
import ENVIRONMENT from '../common/environments';

//UI + CSS
import './GifSelect.scss';
import { Grid } from '@material-ui/core';

//Components
import ReactGiphySearchbox from 'react-giphy-searchbox';

interface GifSelectProps {
    selectGif: (gif: any, searchText: string) => void;
}

export const GifSelect: React.FC<GifSelectProps> = props => {

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
                            // { mq: '1000px', columns: 4, imageWidth: 200, gutter: 10 },
                        ]}
                />
            </div >
        </Grid>
    )
}
