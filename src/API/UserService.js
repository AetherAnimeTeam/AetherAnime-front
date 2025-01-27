import {backendUrl, post} from "./Base";
import axios from "axios";

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

export const deactivate = async (token) => {
    try {
        return await post(`${backendUrl}/api/user/deactivate/`, null, {Authorization: `Bearer ${token}`})
    } catch (e) {}
}


export const getUserDataByToken = (token) =>{
    const url = `${backendUrl}/api/user/`
    return [url, {headers: {Authorization: "Bearer " + token}}]
}

// export const setUserData = async (token, username=null, email=null, profile_picture=null, date_of_birth=null, tag=null) => {
export const setUserData = async (token, formData) => {
    try {
        // const userData = {}
        // if(username) userData["username"] = username
        // if(email) userData["email"] = email
        // if(profile_picture) userData["profile_picture"] = profile_picture
        // if(date_of_birth) userData["username"] = date_of_birth

        return await axios.put(`${backendUrl}/api/user/`, formData,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
    } catch (e) {}
}

export const getAnimeStatus = (anime_id, token) => {
    const url = `${backendUrl}/api/user/status/${anime_id}`
    return [url, {headers: {Authorization: "Bearer " + token}}]
}

export const getUserDataById = (userId) => `${backendUrl}/api/user/${userId}`