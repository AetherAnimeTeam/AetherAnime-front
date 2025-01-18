import {backendUrl, post} from "./Base";

export const getComments = (anime_id) => {
  const url = `${backendUrl}/api/comments/${anime_id}`;
  return url;
};

export const sendComment = async (anime_id, text, token) => {
    try {
        return await post(`${backendUrl}/api/comments/${anime_id}/`, JSON.stringify({text: text}),
            {Authorization: `Bearer ${token}`})
    } catch (e) {}
}
