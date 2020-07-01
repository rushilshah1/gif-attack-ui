import axios from 'axios';
import { get } from "lodash";
import ENVIRONMENT from '../common/environments';

const handleResponse = response => {
    if (get(response, 'data.errors')) {
        throw Object({ response })
    }
    return response.data.data;
}

export const getQuery = async (query: string) => {
    return await axios.get(ENVIRONMENT.API_ENDPOINT, {
        params: { query: query }
    }).then(handleResponse);
}
