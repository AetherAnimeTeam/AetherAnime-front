import React, {useState} from 'react';
import classes from "./SearchList.module.css"
import useSWR from "swr";
import {getByName} from "../../API/AnimeService";
import {fetcher} from "../../API/Base";
import AnimeItem from "../AnimeItem/AnimeItem";
import HorizontalAnimeItem from "../HorizontalAnimeItem/HorizontalAnimeItem";

const SearchList = ({ animeName }) => {
    const {data: animeMeta, error: animeError} = useSWR(() => getByName(animeName), fetcher)

    if (animeError) return <div>Failed to load</div>;
    if (!animeMeta) return;

    return (
        <div className={classes.Container}>
            { animeMeta.map((anime, index) => <HorizontalAnimeItem anime={anime} key={index}/>) }
        </div>
    );
};

export default SearchList;