const ENVIRONMENT = {
    LOCAL: {
        API_ENDPOINT: 'http://localhost:4000/graphql',
        WS_ENDPOINT: 'ws://localhost:4000/graphql',
        ENV: 'local'
    },
    QA: {
        ENV: 'qa'
    },
    PROD: {
        ENV: 'prod'
    }
}

let env = ENVIRONMENT.LOCAL

export default env;