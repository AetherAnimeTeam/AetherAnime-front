import React, { useMemo } from 'react';
import AnimeList from "../../components/AnimeList/AnimeList";
import "./Home.css";
import { getPopular } from "../../API/AnimeService";
import Banner from "../../components/Banner/Banner";
import useSWR from "swr";
import { fetcher } from "../../API/Base";
import Loader from "../../components/Loader/Loader"; 

const Home = () => {
    const popularKey = useMemo(() => getPopular(25, 1), []);
    const announcedKey = useMemo(() => getPopular(25, 1, "anons"), []);

    const { data: popularAnime, error: popularAnimeError } = useSWR(popularKey, fetcher);
    const { data: announcedAnime, error: announcedAnimeError } = useSWR(announcedKey, fetcher);

    if (popularAnimeError || announcedAnimeError) return <div>Failed to load</div>;

    if (!popularAnime || !announcedAnime) return <Loader />;

    return (
        <div>
            <Banner />
            <AnimeList animes={popularAnime} name="Популярное" />
            <AnimeList animes={announcedAnime} name="Анонсированы" />
        </div>
    );
};

export default Home;