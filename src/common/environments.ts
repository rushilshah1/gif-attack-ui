import { ENVRIONMENT_LOCAL, ENVIRONMENT_PROD } from "./constants";

const ENVIRONMENT = {
    LOCAL: {
        API_ENDPOINT: 'http://localhost:4000/graphql',
        WS_ENDPOINT: 'ws://localhost:4000/graphql',
        ENV: ENVRIONMENT_LOCAL,
        GIPHY_KEY: 'dc6zaTOxFJmzC'
    },
    PROD: {
        ENV: ENVIRONMENT_PROD,
        GIPHY_KEY: 'dc6zaTOxFJmzC',
        API_ENDPOINT: 'https://gif-attack-api.com/graphql',
        WS_ENDPOINT: 'wss://gif-attack-api.com/graphql',
    }
}

let env = ENVIRONMENT.LOCAL
if (window.location.hostname.includes('gif-attack.com')) {
    console.log("PROD mode");
    env = ENVIRONMENT.PROD;
}
export default env;