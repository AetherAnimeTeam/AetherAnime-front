import React, {useMemo} from 'react';
import {useParams} from "react-router-dom";
import useSWR from "swr";
import {fetcher, getDetailed} from "../../API/AnimeService";
import "./Anime.css"
import {ReactComponent as Star} from "../../assets/icons/star_filled.svg";

const Anime = () => {
    const params = useParams()

    const ageRatingDict = {g: "0+", pg: "0+", pg_13: "13+", r: "17+", nc_17: "18+"}

    const animeMetaKey = useMemo(() => getDetailed(params["id"]), [params])
    const { data: animeMeta, error: metaError } = useSWR(animeMetaKey, fetcher);

    const stars = [...Array(10)].map((_, index) => (
        <Star key={index} className="Star" />
    ));

    if(metaError) return <div>Error</div>
    if(!animeMeta) return <div>Loading...</div>

    return (
        <div className="Anime">
            <div className="Media">
                <img src={animeMeta.poster_url} alt="poster"/>
            </div>
            <div className="Info">
                <h1>{animeMeta.name_ru}</h1>
                <p className="description">
                    {animeMeta.description ? animeMeta.description : "Описание отсутствует!"}
                </p>

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
                        <p className="Detail-value">{animeMeta.release_date.date}</p>
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
                        <p className="Detail-value"> ~{animeMeta.duration} минуты</p>
                        <p className="Detail-value">{animeMeta.episodes} эпизодов</p>
                        <p className="Detail-value">{animeMeta.episodes_aired} эпизодов</p>
                        <p className="Detail-value">{animeMeta['studios'].map(item => item.name).join(", ")}</p>
                        <p className="Detail-value">{ageRatingDict[animeMeta.age_rating]}</p>
                    </div>
                </div>
            </div>
            <div className="Rating">
                <h2>{animeMeta.score}</h2>
                <p>{animeMeta.score_count} оценок</p>
                <div className="Stars">
                    {stars}
                </div>
            </div>
        </div>
    );
};

export default Anime;