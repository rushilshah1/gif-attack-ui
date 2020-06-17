import { ENVIRONMENT_LOCAL, ENVIRONMENT_PROD } from "./constants";

const ENVIRONMENT = {
    LOCAL: {
        API_ENDPOINT: 'http://localhost:4000/graphql',
        WS_ENDPOINT: 'ws://localhost:4000/graphql',
        ENV: ENVIRONMENT_LOCAL,
        GIPHY_KEY: '9Ixlv3DWC1biJRI57RanyL7RTbfzz0o7'
    },
    PROD: {
        ENV: ENVIRONMENT_PROD,
        GIPHY_KEY: '9Ixlv3DWC1biJRI57RanyL7RTbfzz0o7',
        API_ENDPOINT: 'https://gif-attack-api.com/graphql',
        WS_ENDPOINT: 'wss://gif-attack-api.com/graphql',
    }
}

let env = ENVIRONMENT.LOCAL
console.log(process.env)
console.log(`Giphy key: ${process.env.REACT_APP_GIPHY_KEY}`)
if (window.location.hostname.includes('gif-attack.com')) {
    console.log("PROD mode");
    env = ENVIRONMENT.PROD;
}
export default env;