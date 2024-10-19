import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useFetching} from "../../hooks/useFetching";
import AnimeService from "../../API/AnimeService";
import "./Anime.css"

const Anime = () => {
    const [animeMeta, setAnimeMeta] = useState([])
    const params = useParams()

    const [fetchAnimeMeta, isLoading, error] = useFetching(useCallback(
        async (limit = 10, page = 1) => {
            const animes = await AnimeService.getDetailed(params["id"])
            setAnimeMeta(() => animes.data)
        }, [params])
    )

    useEffect(() => {
        fetchAnimeMeta(params["id"])
    }, [fetchAnimeMeta, params]);

    return (
        <div className="Anime">
            <img src={animeMeta.poster_url} alt="poster"/>

            <div className="AnimeText">
                <h1>{animeMeta.name_ru}</h1>
                <p>{animeMeta.description? animeMeta.description: "Описание отсутствует!"}</p>
            </div>
        </div>
    );
};

export default Anime;