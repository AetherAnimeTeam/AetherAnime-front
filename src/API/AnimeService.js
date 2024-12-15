// import axios from "axios";
//
// const backendUrl = "http://127.0.0.1:8000"
//
// export default class AnimeService {
//     static async getPopular(limit = 10, page = 1, status = "latest"){
//         return await axios.get( `${backendUrl}/popular/`, {
//             params: {limit: limit, page: page, status: status},
//         });
//     }
//
//     static async getDetailed(anime_id) {
//         return axios.get(  `${backendUrl}/detailed/`, {
//             params: {anime_id: parseInt(anime_id)}
//         }).then(res => res.data);
//     }
// }

import axios from 'axios';

const backendUrl = "http://127.0.0.1:8000";

// Generic fetcher function for SWR
export const fetcher = async (url) => {
  const response = await axios.get(url);
  return response.data; // Return the data directly
};

// Service functions for SWR
export const getPopular = (limit = 10, page = 1, status = "latest") => {
  const url = `${backendUrl}/popular/?limit=${limit}&page=${page}&status=${status}`;
  return url; // Return the URL as the key for SWR
};

export const getDetailed = (anime_id) => {
  const url = `${backendUrl}/detailed/?anime_id=${parseInt(anime_id)}`;
  return url; // Return the URL as the key for SWR
};