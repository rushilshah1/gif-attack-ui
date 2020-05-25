import { ENVRIONMENT_LOCAL, ENVIRONMENT_QA, ENVIRONMENT_PROD } from "./constants";
import * as dotenv from "dotenv";

dotenv.config();

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
        API_ENDPOINT: 'http://gif-attack-api-qa.us-east-1.elasticbeanstalk.com/graphql',
        WS_ENDPOINT: 'ws://gif-attack-api-qa.us-east-1.elasticbeanstalk.com/graphql',
    },
    PROD: {
        ENV: ENVIRONMENT_PROD,
        GIPHY_KEY: 'dc6zaTOxFJmzC'
    }
}

let env = ENVIRONMENT.LOCAL
console.log(`ENV is ${process.env.ENV}`)
if (process.env.ENV === ENVIRONMENT_QA) {
    console.log("QA mode");
    env = ENVIRONMENT.QA;
}
export default env;