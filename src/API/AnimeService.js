import {backendUrl} from "./Base";


export const getPopular = (limit = 10, page = 1, status = "latest") => {
  const url = `${backendUrl}/api/animes/popularity/${status}/${page}/${limit}`;
  return url;
};

export const getDetailed = (anime_id) => {
  const url = `${backendUrl}/api/animes/${anime_id}`;
  return url;
};