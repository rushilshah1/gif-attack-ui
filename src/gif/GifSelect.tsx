import React, { useState, useEffect } from 'react'
import { Button, Container, withStyles, TextField } from '@material-ui/core'
import { GifOverlayProps, Gif } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { gifSearchData } from './GiphyMock';
import './GifSelect.css';
import ENVIRONMENT from '../common/environments';
import { ENVRIONMENT_LOCAL } from '../common/constants';

const GifSelectionContainer = withStyles({
    root: {
        marginTop: '70px',
        padding: "20px",
        border: 'groove',
        borderRadius: 3,
        height: 'auto',
        width: '70%',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',

    }
})(Container);

const StyledInputText = withStyles({
    root: {
        // paddingTop: "20px",
        // paddingRight: "10px",
        display: 'inline-flex',
        width: "auto",
        minWidth: "200px"
    }
})(TextField);

const SearchButton = withStyles({
    root: {
        display: 'inline-flex',
        verticalAlign: 'top',
        marginLeft: '15%',
        minWidth: '40%'
        // minWidth: '30px'
    }
})(Button);

const GifActionButton = withStyles({
    root: {
        margin: '20px',

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
            const searchResults: any = (ENVIRONMENT.ENV === ENVRIONMENT_LOCAL) ? await searchApiMock(gifSearchInput) : await giphyClient.search(gifSearchInput);
            //const searchResults: any = await giphyClient.search(gifSearchInput);

            //let results: any[] = Math.random() < 0.5 ? searchResults.data : [];
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
        <GifSelectionContainer>
            <div className="searchBar">
                <StyledInputText id="standard-basic" label="Search for a gif" value={gifSearchInput} onChange={(e) => setGifSearchInput(e.target.value)}></StyledInputText>
                <SearchButton variant="contained" color="primary" disabled={gifSearchInput === ''} onClick={() => {
                    giphySearch()
                }}> Search</SearchButton>
            </div>
            {/* <Carousel gifHeight={300} gutter={15} fetchGifs={fetchGifs} overlay={Overlay} /> */}
            {currentGif && <h3>{currentGif.title}</h3>}
            <div className="gif">
                {currentGif && <Gif gif={currentGif} width={250} height={250} hideAttribution={true} noLink={true} />}
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
            </div>
        </GifSelectionContainer>

    )
}
