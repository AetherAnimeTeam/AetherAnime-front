import React from 'react';
import classes from "./HorizontalAnimeItem.module.css"
import {useNavigate} from "react-router-dom";

const HorizontalAnimeItem = ({ anime }) => {
    const navigate = useNavigate()

    return (
        <div className={classes.AnimeItemContainer} onClick={() => navigate(`/anime/${anime.id}`)}>
            <img src={anime.poster.previewUrl} className={classes.poster}/>
            <div className={classes.textInfo}>
                <p className={classes.name}>{anime.russian}</p>
                <div className={classes.meta}>
                    <h3 className={classes.score}>{anime.score || "-"}</h3>
                    <p className={classes.year}>{anime.releasedOn.year || "-"}</p>
                </div>
            </div>
        </div>
    );
};

export default HorizontalAnimeItem;