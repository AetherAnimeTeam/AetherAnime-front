import React from 'react';
import classes from "./HorizontalAnimeItem.module.css";
import { useNavigate } from "react-router-dom";
import { ReactComponent as StarIcon } from "../../assets/icons/star_filled.svg";

const HorizontalAnimeItem = ({ anime, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/anime/${anime.id}`); 
        onClick(); 
    };

    return (
        <div className={classes.AnimeItemContainer} onClick={handleClick}>
            <img src={anime.poster.previewUrl} className={classes.poster} alt={anime.russian} />
            <div className={classes.textInfo}>
                <p className={classes.name}>{anime.russian}</p>
                <div className={classes.meta}>
                    <div className={classes.scoreBanner}>
                        <StarIcon style={{ alignSelf: "center" }} />
                        <span>{anime.score || "-"}</span>
                    </div>
                    <p className={classes.year}>{anime.releasedOn?.year || "-"}</p>
                </div>
            </div>
        </div>
    );
};

export default HorizontalAnimeItem;