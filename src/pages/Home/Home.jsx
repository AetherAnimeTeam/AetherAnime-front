import {React, useMemo } from 'react';
import AnimeList from "../../components/AnimeList";
import "./Home.css";
import { getPopular } from "../../API/AnimeService";
import Banner from "../../components/Banner/Banner";
import useSWR from "swr";
import {fetcher} from "../../API/Base";

const Home = () => {
    const popularKey = useMemo(() => getPopular(25, 1), []);
    const announcedKey = useMemo(() => getPopular(25, 1, "anons"), []);

    const { data: popularAnime, error: popularAnimeError } = useSWR(popularKey, fetcher);
    const { data: announcedAnime, error: announcedAnimeError } = useSWR(announcedKey, fetcher);

    if (popularAnimeError || announcedAnimeError) return <div>Failed to load</div>;
    if (!popularAnime || !announcedAnime) return <div>Loading...</div>;
    console.log(popularAnime)
    return (
        <div>
            <Banner />

            <h1 className="AnimeListType">Популярное</h1>
            <AnimeList animes={popularAnime} />

            <h1 className="AnimeListType">Анонсированы</h1>
            <AnimeList animes={announcedAnime} />
        </div>
    );
};

export default Home;