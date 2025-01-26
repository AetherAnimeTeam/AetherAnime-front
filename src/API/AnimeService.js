import {backendUrl, post} from "./Base";


export const getPopular = (limit = 10, page = 1, status = "latest") => {
  const url = `${backendUrl}/api/animes/popularity/${status}/${page}/${limit}`;
  return url;
};

export const getDetailed = (anime_id) => {
  const url = `${backendUrl}/api/animes/${anime_id}`;
  return url;
};

export const getByName = (name) => {
  const url = `${backendUrl}/api/animes/search/${name}`
  return url
}
export const setStatus = async (anime_id, status, token) => {
    try {
        return await post(`${backendUrl}/api/animes/status/${anime_id}/`, JSON.stringify({status: status}),
            {Authorization: `Bearer ${token}`})
    } catch (e) {}
}