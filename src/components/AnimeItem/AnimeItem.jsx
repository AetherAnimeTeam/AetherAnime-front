import React, { useCallback } from 'react';
import classes from "./AnimeItem.module.css";
import { useNavigate } from "react-router-dom";
import Score from "../UI/Score/Score";

const AnimeItem = React.memo(({ anime, style }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/anime/${anime.id}`);
  }, [navigate, anime.id]);

  return (
    <div
      className={classes.AnimeItem}
      style={style}
      onClick={handleClick}
    >
      {anime.score !== 0 ? <Score score={anime.score} /> : null}

      <div className={classes.ImageWrapper}>
        <img src={anime.poster.previewUrl} alt="preview" />
      </div>

      <h1>{anime.russian}</h1>
    </div>
  );
});

export default AnimeItem;
