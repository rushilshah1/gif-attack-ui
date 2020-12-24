import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
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
    const [refresh, setRefresh] = useState<boolean>(false);
    const [gifSearchInput, setGifSearchInput] = useState<string>('');

    const showSearchbox = () => {
        try {
            return <ReactGiphySearchbox
                apiKey={ENVIRONMENT.GIPHY_KEY}
                onSelect={(gif) => {
                    props.selectGif(gif, gifSearchInput);
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
            />;
        } catch (error) {
            console.error(error);
            console.error("****");
            return <h1>There was an unexpected error in the Giphy searchbox...</h1>;
        }

    }

    return (
        <Grid container direction="row" justify="center">
            <div className="gif-selection" >
                {showSearchbox()}
            </div >
        </Grid>
    )


}
