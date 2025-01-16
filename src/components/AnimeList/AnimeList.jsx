import React, {useEffect, useRef, useState} from 'react';
import AnimeItem from "../AnimeItem/AnimeItem";
import classes from "./AnimeList.module.css";
import { ReactComponent as Arrow } from "../../assets/icons/arrow.svg";

const AnimeList = ({ animes, name}) => {
    const animeListRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [isFullWidth, setFullWidth] = useState(false);
    const scrollN = 8;

    useEffect(() => {
        const handleScroll = () => {
            if (animeListRef.current) {
                const scrolled = animeListRef.current.scrollLeft;
                const scrollWidth = animeListRef.current.scrollWidth;
                const clientWidth = animeListRef.current.clientWidth;
                console.log(scrolled)
                setShowLeftArrow(scrolled > 0);
                setShowRightArrow(scrolled < scrollWidth - clientWidth);
            }
        };
        if (animeListRef.current)
            animeListRef.current.addEventListener('scroll', handleScroll);

        return () => {
            if (animeListRef.current)
                animeListRef.current.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollLeft = () => {
        if (animeListRef.current) {
            let scrollW = scrollN * 11.15 + (scrollN + 1) * 0.83 - 1.77;
            // if(animeListRef.current.scrollLeft === 0)
            //     scrollW += 1.25 - 2.21;

            animeListRef.current.scrollBy({ left: -scrollW / 100 * window.screen.width, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (animeListRef.current) {
            let scrollW = scrollN * 11.15 + (scrollN + 1) * 0.83 - 1.77;
            // let scrollW = scrollN * 11.67 + (scrollN + 1) * 0.42;
            // if(animeListRef.current.scrollLeft === 0)
            //     scrollW += 1.25 - 2.21;

            animeListRef.current.scrollBy({ left: scrollW / 100 * window.screen.width, behavior: 'smooth' });
        }
    };

    const styles = {
        0: { marginLeft: "auto" },
        length: { marginRight: "auto" }
    };

    return (
        <div className={classes.AnimeListContainer}>
            <h1 className={classes.AnimeListType}>{name}</h1>

            <div className={classes.ListWrapper}>
                <div className={`${classes.ArrowContainer} ${classes.ArrowLeft} ${showLeftArrow ? '' : classes.hidden}`}
                     onClick={scrollLeft}>
                    <Arrow/>
                </div>

                <div className={classes.AnimeList} ref={animeListRef}>
                    {animes.map((anime, index) => (
                        <AnimeItem key={anime.id} anime={anime} style={styles[index]}/>
                    ))}
                </div>

                <div className={`${classes.ArrowContainer} ${classes.ArrowRight} ${showRightArrow ? '' : classes.hidden}`}
                     onClick={scrollRight}>
                    <Arrow style={{transform: "rotate(180deg)"}}/>
                </div>
            </div>
        </div>
    );
};

export default AnimeList;