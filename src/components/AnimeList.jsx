import React, {useRef} from 'react';
import AnimeItem from "./AnimeItem";
import classes from "./AnimeList.module.css"

const AnimeList = ({ animes }) => {

    const animeListRef = useRef(null)

    const scrollLeft = () => {
        animeListRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    };

    const scrollRight = () => {
        animeListRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    };

    return (
        <div className={classes.AnimeListContainer}>
            {/*<button className="Arrow left" onClick={scrollLeft}>&#9664;</button>*/}

            <div className={classes.AnimeList} ref={animeListRef}>
                { animes.map((anime, index) =>
                    <AnimeItem anime={anime} key={index}/> )}
            </div>
            {/*<button className="Arrow right" onClick={scrollRight}>&#9654;</button>*/}
        </div>
    );
};

export default AnimeList;