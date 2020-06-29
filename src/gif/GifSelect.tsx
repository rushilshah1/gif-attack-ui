import React, { useState, useEffect } from 'react';
import './GifSelect.scss';
import ENVIRONMENT from '../common/environments';
import { ENVIRONMENT_LOCAL } from '../common/constants';
import ReactGiphySearchbox from 'react-giphy-searchbox';

interface GifSelectProps {
    selectGif: (gif: any, searchText: string) => void;
}

export const GifSelect: React.FC<GifSelectProps> = props => {

    const [gifSearchInput, setGifSearchInput] = useState<string>('');

    return (
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
                        { columns: 2, imageWidth: 150, gutter: 10 },
                        { mq: '700px', columns: 3, imageWidth: 190, gutter: 10 },
                        // { mq: '1000px', columns: 4, imageWidth: 200, gutter: 10 },
                    ]}
            />
        </div >
    )
}
