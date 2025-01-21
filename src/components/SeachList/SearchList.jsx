import React from 'react';
import classes from "./SearchList.module.css";
import useSWR from "swr";
import { getByName } from "../../API/AnimeService";
import { fetcher } from "../../API/Base";
import HorizontalAnimeItem from "../HorizontalAnimeItem/HorizontalAnimeItem";

const SearchList = ({ animeName, onAnimeClick, setAnimeName }) => {
    const { data: animeMeta, error: animeError, isValidating } = useSWR(
        () => getByName(animeName),
        fetcher
    );

    if (animeError) return <div>Failed to load</div>;

    const displayedAnime = animeMeta ? animeMeta.slice(0, 12) : [];

    const handleResetSearch = () => {
        setAnimeName(""); 
    };

    return (
        <div className={classes.searchResultsContainer}>
            {isValidating ? (
                <div className={classes.searchLoader}>Загрузка...</div>
            ) : displayedAnime.length > 0 ? (
                displayedAnime.map((anime, index) => (
                    <HorizontalAnimeItem
                        anime={anime}
                        key={index}
                        onClick={onAnimeClick}
                    />
                ))
            ) : (
                <div className={classes.searchNoResults}>
                    <p>Ничего не нашли :(</p>
                    <button
                        className={classes.searchResetButton}
                        onClick={handleResetSearch}
                    >
                        Сбросить поиск
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchList;