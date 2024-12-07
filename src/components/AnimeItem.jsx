import React from 'react';
import classes from "./AnimeItem.module.css";
import {useNavigate} from "react-router-dom";
import {ReactComponent as StarIcon} from "../assets/icons/star.svg";

const AnimeItem = ({anime}) => {

    const router = useNavigate()

    return (
        <div
            onClick={() => { router(`/anime/${anime.anime_id}`) }}
            className={classes.AnimeItem}>

            {anime.score !== 0 ?
            <div className={classes.Score}>
                <StarIcon style={{alignSelf: "center"}}/>
                <p>{anime.score}</p>
            </div> : null}

            <img src={anime.poster_url} alt={"preview"}></img>

            <p>{anime.name_ru.split("!")[0]}</p>

        </div>
    );
};

export default AnimeItem;