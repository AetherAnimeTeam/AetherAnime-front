import {useEffect, useState, React, useCallback,} from 'react';
import AnimeList from "../../components/AnimeList";
import "./Home.css"
import {useFetching} from "../../hooks/useFetching";
import AnimeService from "../../API/AnimeService";

const Home = () => {
    const [popularAnime, setPopularAnime] = useState([])
    const [fetchPopular, isLoading, error] = useFetching(useCallback(
        async (limit = 10, page = 1) => {
            const animes = await AnimeService.getPopular(limit, page)
            setPopularAnime(() => animes.data)
        }, [])
    )

    useEffect(()=> {
        fetchPopular();
    }, [fetchPopular]);

    return (
        <div>
            <h1 className="AnimeListType">Популярное</h1>

            <AnimeList animes={popularAnime}/>
        </div>
    );
};

export default Home;