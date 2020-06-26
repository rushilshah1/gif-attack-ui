import { ENVIRONMENT_LOCAL, ENVIRONMENT_PROD } from "./constants";

const ENVIRONMENT = {
    LOCAL: {
        API_ENDPOINT: 'http://localhost:4000/graphql',
        WS_ENDPOINT: 'ws://localhost:4000/graphql',
        ENV: ENVIRONMENT_LOCAL,
        GIPHY_KEY: process.env.REACT_APP_GIPHY_KEY
    },
    PROD: {
        API_ENDPOINT: 'https://gif-attack-api.com/graphql',
        WS_ENDPOINT: 'wss://gif-attack-api.com/graphql',
        ENV: ENVIRONMENT_PROD,
        GIPHY_KEY: process.env.REACT_APP_GIPHY_KEY
    }
}
let env = ENVIRONMENT.LOCAL
if (window.location.hostname.includes('gif-attack.com') || window.location.hostname.includes('.amplifyapp.com')) {
    console.log("PROD mode");
    env = ENVIRONMENT.PROD;
}
export default env;