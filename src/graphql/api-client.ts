import axios from 'axios';
import { get } from "lodash";

const API_ENDPOINT: string = 'http://localhost:4000/graphql'

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