import React, { useState, useEffect } from 'react'
import { Button, Container, withStyles, TextField } from '@material-ui/core'
import { GifOverlayProps, Gif } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { gifSearchData } from './GiphyMock';
import './GifSelect.css';
import ENVIRONMENT from '../common/environments';
import { ENVIRONMENT_LOCAL } from '../common/constants';
import ReactGiphySearchbox from 'react-giphy-searchbox';


const GifSelectionContainer = withStyles({
    root: {
        marginTop: '70px',
        padding: "20px",
        border: 'groove',
        borderRadius: '15px',
        height: 'auto',
        width: '70%',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',

    }
})(Container);

const StyledInputText = withStyles({
    root: {
        minWidth: "70%"
    }
})(TextField);

const SearchButton = withStyles({
    root: {
        verticalAlign: 'top',
        marginLeft: '15%',
        minWidth: '30%'
    }
})(Button);

const GifActionButton = withStyles({
    root: {
        margin: '20px'
    }
})(Button);

interface GifSelectProps {
    selectGif: (gif: any, searchText: string) => void;
}

const Overlay = ({ gif, isHovered }: GifOverlayProps) => {
    return <div className="overlay">{isHovered ? gif.title : ''}</div>
}



export const GifSelect: React.FC<GifSelectProps> = props => {

    const giphyClient = new GiphyFetch(ENVIRONMENT.GIPHY_KEY);
    const [gifSearchInput, setGifSearchInput] = useState<string>('');
    const [gifSearchResults, setGifSearchResults] = useState<Array<any>>([]);
    const [currentGif, setCurrentGif] = useState(null as any);
    const [searchError, setSearchError] = useState<string>('');

    useEffect(() => {
        if (gifSearchResults.length > 0) {
            pickRandomGif();
        }
    }, [gifSearchResults]);

    const giphySearch = async () => {
        try {
            setCurrentGif(null);
            const searchResults: any = (ENVIRONMENT.ENV === ENVIRONMENT_LOCAL) ? await searchApiMock(gifSearchInput) : await giphyClient.search(gifSearchInput);
            const results: Array<any> = searchResults.data;
            if (Array.isArray(results) && results.length) {
                setSearchError('');
            }
            else {
                setSearchError('No Gifs Found');
            }
            console.log(results)
            setGifSearchResults(gifSearchResults => [...results]);
        } catch (error) {
            setSearchError(error.message);
        }

    }

    const searchApiMock = async (searchInput: string) => {
        return new Promise<any>((resolve) => resolve(gifSearchData));
    }

    const pickRandomGif = () => {
        setCurrentGif(null);
        const numSearchResults: number = gifSearchResults.length
        const randomIndex: number = Math.floor(Math.random() * Math.floor(numSearchResults));
        setCurrentGif(gifSearchResults[randomIndex]);
    }



    return (
        <div className="gifSelection" >
            <ReactGiphySearchbox
                apiKey={ENVIRONMENT.GIPHY_KEY}
                onSelect={(gif) => {
                    console.log(gif)
                    setCurrentGif(gif)
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

            {/*<GifSelectionContainer>*/}
            {/* <div className="searchBar">
                <StyledInputText id="standard-basic" label="Search for a gif" value={gifSearchInput} onChange={(e) => setGifSearchInput(e.target.value)}></StyledInputText>
                <SearchButton variant="contained" color="primary" disabled={gifSearchInput === ''} onClick={() => {
                    giphySearch()
                }}> Search</SearchButton>
            </div> */}


            {/* {currentGif && <h3>{currentGif.title}</h3>}
            <div className="gif">
                {currentGif && <Gif className="gif-image" gif={currentGif} width={250} height={250} hideAttribution={true} noLink={true} />}
            </div>
            {searchError &&
                <div className="noResults">
                    {searchError}
                </div>
            }
            <div>
                {currentGif && <GifActionButton variant="contained" color="primary" onClick={() => {
                    pickRandomGif()
                }}>Shuffle</GifActionButton>}
                {currentGif && <GifActionButton variant="contained" color="primary" onClick={() => {
                    props.selectGif(currentGif, gifSearchInput)
                }}>Submit</GifActionButton>}
            </div> */}
            {/*</GifSelectionContainer>*/}
        </div >
    )
}
