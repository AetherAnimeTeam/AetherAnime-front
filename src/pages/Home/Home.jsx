import {useEffect, useState, React, useCallback,} from 'react';
import AnimeList from "../../components/AnimeList";
import "./Home.css"
import {useFetching} from "../../hooks/useFetching";
import AnimeService from "../../API/AnimeService";
import Banner from "../../components/Banner/Banner";

const Home = () => {
    const [popularAnime, setPopularAnime] = useState([])
    const [fetchPopular, isPopularLoading, popularError] = useFetching(useCallback(
        async (limit = 10, page = 1) => {
            const animes = await AnimeService.getPopular(limit, page)
            setPopularAnime(() => animes.data)
        }, [])
    )
    const [announcedAnime, setAnnouncedAnime] = useState([])
    const [fetchAnnounced, isLoading, announcedError] = useFetching(useCallback(
        async (limit = 10, page = 1) => {
            const animes = await AnimeService.getPopular(limit, page, "anons")
            setAnnouncedAnime(() => animes.data)
        }, [])
    )

    useEffect(()=> {
        fetchPopular();
        fetchAnnounced();
    }, [fetchPopular, fetchAnnounced]);

    return (
        <div>
            <Banner />

            <h1 className="AnimeListType">Популярное</h1>
            <AnimeList animes={popularAnime}/>
            <h1 className="AnimeListType">Анонсированы</h1>
            <AnimeList animes={announcedAnime}/>
        </div>
    );
};

export default Home;