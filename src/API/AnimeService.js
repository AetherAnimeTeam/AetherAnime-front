import axios from "axios";

export default class AnimeService {
    static async getPopular(limit = 10, page = 1){
        return await axios.get("https://aetheranime-backend.onrender.com/popular/", {
            params: {limit: limit, page: page},
        });
    }

    static async getDetailed(anime_id) {
        return await axios.get("https://aetheranime-backend.onrender.com/detailed/", {
            params: {anime_id: parseInt(anime_id)}
        });
    }
}