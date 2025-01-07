import React from 'react';
import classes from "./AnimeItem.module.css";
import {useNavigate} from "react-router-dom";
import Score from "./UI/Score/Score";

const AnimeItem = ({anime}) => {

    const router = useNavigate()

    return (
        <div
            onClick={() => { router(`/anime/${anime.anime_id}`) }}
            className={classes.AnimeItem}>

            {anime.score !== 0 ? <Score score={anime.score}/> : null }

            <img src={anime.poster_url} alt={"preview"}></img>

            <h1>{anime.name_ru.split("!")[0]}</h1>

        </div>
    );
};

export default AnimeItem;