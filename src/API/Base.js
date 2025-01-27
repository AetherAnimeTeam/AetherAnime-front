import axios from "axios";

export const backendUrl = process.env["REACT_APP_BACKEND_URL"] || "http://127.0.0.1:8000";

export const fetcher = async (url, config = null) => {
    const response = await axios.get(url, {...config, validateStatus: () => true});
    return response.data;
};

export const post = async (url, data, headers) => {
    const response = await axios.post(url, data, {
        headers: {'Content-Type': 'application/json', ...headers},
        validateStatus: () => true });
    return {data: response.data, status: response.status};
}

export const makeFormData = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        formData.set(key, value)
    })

    return formData;
}