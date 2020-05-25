import { ENVRIONMENT_LOCAL, ENVIRONMENT_QA, ENVIRONMENT_PROD } from "./constants";

const ENVIRONMENT = {
    LOCAL: {
        API_ENDPOINT: 'http://localhost:4000/graphql',
        WS_ENDPOINT: 'ws://localhost:4000/graphql',
        ENV: ENVRIONMENT_LOCAL,
        GIPHY_KEY: ''
    },
    QA: {
        ENV: ENVIRONMENT_QA,
        GIPHY_KEY: 'dc6zaTOxFJmzC',
        // API_ENDPOINT: 'http://localhost:4000/graphql',
        // WS_ENDPOINT: 'ws://localhost:4000/graphql',
    },
    PROD: {
        ENV: ENVIRONMENT_PROD,
        GIPHY_KEY: 'dc6zaTOxFJmzC'
    }
}

let env = ENVIRONMENT.LOCAL

export default env;