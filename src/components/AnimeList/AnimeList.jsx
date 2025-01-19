import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import AnimeItem from "../AnimeItem/AnimeItem";
import classes from "./AnimeList.module.css";
import { ReactComponent as Arrow } from "../../assets/icons/arrow.svg";

const AnimeList = React.memo(({ animes, name }) => {
  const animeListRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const width = window.screen.width;
  const scrollN = 8;

  const transformPx = useCallback(
    (x) => (x / 100) * width,
    [width]
  );

  const scrollW = useMemo(() => {
    return (
      scrollN * transformPx(11.15) +
      (scrollN + 1) * transformPx(0.83) -
      transformPx(1.77) +
      transformPx(0.2)
    );
  }, [scrollN, transformPx]);

  const handleScroll = useCallback(() => {
    if (!animeListRef.current) return;
    const scrolled = animeListRef.current.scrollLeft;
    const scrollWidth = animeListRef.current.scrollWidth;
    const clientWidth = animeListRef.current.clientWidth;

    setShowLeftArrow(scrolled > 0);
    setShowRightArrow(scrolled < scrollWidth - clientWidth);
  }, []);

  useEffect(() => {
    const listElement = animeListRef.current;
    if (listElement) {
      listElement.addEventListener("scroll", handleScroll);
      return () => listElement.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const scrollLeft = useCallback(() => {
    if (animeListRef.current) {
      animeListRef.current.scrollBy({ left: -scrollW, behavior: "smooth" });
    }
  }, [scrollW]);

  const scrollRight = useCallback(() => {
    if (animeListRef.current) {
      animeListRef.current.scrollBy({ left: scrollW, behavior: "smooth" });
    }
  }, [scrollW]);


  const itemStyles = useMemo(() => ({
    0: { marginLeft: "auto" },
    [animes.length - 1]: { marginRight: "auto" },
  }), [animes.length]);

  return (
    <div className={classes.AnimeListContainer}>
      <h1 className={classes.AnimeListType}>{name}</h1>

      <div className={classes.ListWrapper}>
        {/* Left arrow */}
        <div
          className={`${classes.ArrowContainer} ${classes.ArrowLeft} ${showLeftArrow ? '' : classes.hidden}`}
          onClick={scrollLeft}
        >
          <Arrow />
        </div>

        {/* Scrolling list */}
        <div className={classes.AnimeList} ref={animeListRef}>
          {animes.map((anime, index) => (
            <AnimeItem
              key={anime.id}
              anime={anime}
              style={itemStyles[index] || undefined}
            />
          ))}
        </div>

        {/* Right arrow */}
        <div
          className={`${classes.ArrowContainer} ${classes.ArrowRight} ${showRightArrow ? '' : classes.hidden}`}
          onClick={scrollRight}
        >
          <Arrow style={{ transform: "rotate(180deg)" }} />
        </div>
      </div>
    </div>
  );
});

export default AnimeList;
