import React, { useState, useEffect } from 'react'
import { Button, Container, withStyles, TextField } from '@material-ui/core'
import { GifOverlayProps, Gif } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { gifSearchData } from './GiphyMock';
import './GifSelect.css';

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

const delay = async (ms: number) => {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
};

const Overlay = ({ gif, isHovered }: GifOverlayProps) => {
    return <div className="overlay">{isHovered ? gif.title : ''}</div>
}



export const GifSelect: React.FC<GifSelectProps> = props => {
    const giphyClient = new GiphyFetch('dc6zaTOxFJmzC')
    const [gifSearchInput, setGifSearchInput] = useState<string>('');
    const [gifSearchResults, setGifSearchResults] = useState<Array<any>>([]);
    const [currentGif, setCurrentGif] = useState(null as any);

    useEffect(() => {
        if (gifSearchResults.length > 0) {
            pickRandomGif();
        }
    }, [gifSearchResults]);

    const giphySearch = async () => {
        //const searchResults: GifsResult = await giphyClient.search(searchInput);
        const searchResults: any = await searchApiMock(gifSearchInput)
        let results: any[] = searchResults.data;
        console.log(results)
        setGifSearchResults(gifSearchResults => [...results]);

    }

    const searchApiMock = async (searchInput: string) => {
        return new Promise<any>((resolve) => resolve(gifSearchData));
    }

    const pickRandomGif = async () => {
        setCurrentGif(null);
        //await delay(1000);
        const numSearchResults: number = gifSearchResults.length
        const randomIndex: number = Math.floor(Math.random() * Math.floor(numSearchResults));
        setCurrentGif(gifSearchResults[randomIndex]);

    }
    // const fetchGifs = async (offset: number) => {
    //     await delay(3000);
    //     return gifSearchData;
    // }

    // fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
    const fetchGifs = async (offset?: number): Promise<any> => {
        return new Promise<any>((resolve) => {

            resolve(gifSearchData);
        });
        // const trendingGifs = await gf.trending({ offset, limit: 10 })
        // console.log(trendingGifs);
        // debugger;
        // return trendingGifs;
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
                {currentGif && <Gif gif={currentGif} width={250} height={250} hideAttribution={true} />}
            </div>
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
