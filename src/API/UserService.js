import {backendUrl, post} from "./Base";

export const register = (data) => {
  const url = `${backendUrl}/api/user/register/`;
  return [url, JSON.stringify(data)];
};

export const verifyEmail = (data) => {
    const url = `${backendUrl}/api/user/verify-email/`;
    return [url, JSON.stringify(data)]
}

export const getCredentials = async (email, password) => {
    try {
        return await post(`${backendUrl}/api/user/token/`, JSON.stringify({email: email, password: password}))
    } catch (e) {}
}

export const refreshToken = async (refreshToken) => {
    try {
        return await post(`${backendUrl}/api/user/token/refresh/`, JSON.stringify({refresh: refreshToken}))
    } catch (e) {}
}

export const getUserDataByToken = (token) =>{
    const url = `${backendUrl}/api/user/`
    return [url, {headers: {Authorization: "Bearer " + token}}]
}

export const getAnimeStatus = (anime_id, token) => {
    const url = `${backendUrl}/api/user/status/${anime_id}`
    return [url, {headers: {Authorization: "Bearer " + token}}]
}

export const getUserDataById = (userId) => `${backendUrl}/api/user/${userId}`