import React from 'react';
import classes from "./AnimeItem.module.css";
import {useNavigate} from "react-router-dom";
import Score from "../UI/Score/Score";

const AnimeItem = ({anime, style}) => {
    // TODO: add width based preview selection
    const router = useNavigate()

    return (
        <div
            onClick={() => { router(`/anime/${anime.id}`) }}
            className={classes.AnimeItem}>

            {anime.score !== 0 ? <Score score={anime.score}/> : null }
            <div className={classes.ImageWrapper}>
                <img src={anime.poster.previewUrl} alt={"preview"}></img>
            </div>
            <h1>{anime.russian}</h1>

        </div>
    );
};

export default AnimeItem;