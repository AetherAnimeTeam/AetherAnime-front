import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useFetching} from "../../hooks/useFetching";
import AnimeService from "../../API/AnimeService";
import "./Anime.css"
import {ReactComponent as Star} from "../../assets/icons/star_filled.svg";

const Anime = () => {
    const [animeMeta, setAnimeMeta] = useState([])
    const [isExpanded, setExpanded] = useState(false)

    const params = useParams()

    const ageRatingDict = {g: "0+", pg: "0+", pg_13: "13+", r: "17+", nc_17: "18+"}

    const [fetchAnimeMeta, isLoading, error] = useFetching(useCallback(
        async (limit = 10, page = 1) => {
            const animes = await AnimeService.getDetailed(params["id"])
            setAnimeMeta(() => animes.data)
        }, [params])
    )

    useEffect(() => {
        fetchAnimeMeta(params["id"])
    }, [fetchAnimeMeta, params]);

    console.log(animeMeta)
    return (
        <div className="Anime">
            {/*{isLoading ? <>*/}
            <div className="Media">
                <img src={animeMeta.poster_url} alt="poster"/>
            </div>
            <div className="Info">
                <h1>{animeMeta.name_ru}</h1>
                <p className="description" style={{
                    background: isExpanded ? 'none' : 'linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(0, 0, 0, 0))',
                    color: isExpanded ? 'white' : 'transparent',
                    WebkitBackgroundClip: isExpanded ? 'inherit' : 'text',
                    backgroundClip: isExpanded ? 'inherit' : 'text',
                    maxHeight: isExpanded ? '100%' : '162px',

                }}>
                    {animeMeta.description ? animeMeta.description : "Описание отсутствует!"}
                </p>
                {/*<p className="expand_description" onClick={() => setExpanded(!isExpanded)}>Подробнее</p>*/}

                <div className="Details">
                    <div className="Details-block">
                        <p className="Detail-name">Название в оригинале</p>
                        <p className="Detail-name">Жанр</p>
                        <p className="Detail-name">Страна</p>
                        <p className="Detail-name">Дата выхода</p>
                        <p className="Detail-name">Статус</p>
                    </div>
                    <div className="Details-block">
                        <p className="Detail-value">{animeMeta.name_original}</p>
                        <p className="Detail-value">{animeMeta.genres.map(item => item.name).join(", ")}</p>
                        <p className="Detail-value">Япония</p>
                        <p className="Detail-value">{animeMeta.date}</p>
                        <p className="Detail-value">{animeMeta.status}</p>
                    </div>
                    <div className="Details-block">
                        <p className="Detail-name">Продолжительность серии</p>
                        <p className="Detail-name">Количество серий</p>
                        <p className="Detail-name">Вышло серий</p>
                        <p className="Detail-name">Студия</p>
                        <p className="Detail-name">Возрастной рейтинг</p>
                    </div>
                    <div className="Details-block">
                        <p className="Detail-value">{animeMeta.duration}</p>
                        <p className="Detail-value">{animeMeta.episodes}</p>
                        <p className="Detail-value">{animeMeta.episodes_aired}</p>
                        <p className="Detail-value">{animeMeta['studios'].map(item => item.name).join(", ")}</p>
                        <p className="Detail-value">{ageRatingDict[animeMeta.age_rating]}</p>
                    </div>
                </div>
            </div>
            <div className="Rating">
                <h2>{animeMeta.score}</h2>
                <p>{animeMeta.score_count} оценок</p>
                <div className="Stars">
                    <Star className="Star"/>
                    <Star className="Star"/>
                    <Star className="Star"/>
                    <Star className="Star"/>
                    <Star className="Star"/>
                    <Star className="Star"/>
                    <Star className="Star"/>
                    <Star className="Star"/>
                    <Star className="Star"/>
                    <Star className="Star"/>
                </div>
            </div>
        </div>
    );
};

export default Anime;