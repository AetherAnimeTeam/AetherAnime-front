import React from 'react';
import classes from "./AnimeItem.module.css";
import {useNavigate} from "react-router-dom";

const AnimeItem = (anime) => {

    const router = useNavigate()
    console.log(anime)

    return (
        <div
            onClick={() => {router(`/anime/${anime.anime.anime_id}`)}}
            className={classes.AnimeItem}>
            <img src={anime.anime.poster_url} alt={"preview"}></img>
            <p>{anime.anime.name_ru.split("!")[0]}</p>
        </div>
    );
};

export default AnimeItem;