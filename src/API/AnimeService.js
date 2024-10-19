import axios from "axios";

export default class AnimeService {
    static async getPopular(limit = 10, page = 1){
        return await axios.get("http://127.0.0.1:8000/popular/", {
            params: {limit: limit, page: page},
        });
    }

    static async getDetailed(anime_id) {
        return await axios.get("http://127.0.0.1:8000/detailed/", {
            params: {anime_id: parseInt(anime_id)}
        });
    }
}