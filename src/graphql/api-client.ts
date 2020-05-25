import axios from 'axios';
import { get } from "lodash";
import ENVIRONMENT from '../common/environments';

const API_ENDPOINT: string = ENVIRONMENT.API_ENDPOINT;

const handleResponse = response => {
    if (get(response, 'data.errors')) {
        throw Object({ response })
    }
    return response.data.data;
}

export const getQuery = async (query: string) => {
    return await axios.get(API_ENDPOINT, {
        params: { query: query }
    }).then(handleResponse);

}