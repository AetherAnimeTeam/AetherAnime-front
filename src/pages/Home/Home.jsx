import React, { useMemo, useState } from 'react';
import AnimeList from "../../components/AnimeList/AnimeList";
import "./Home.css";
import { getPopular } from "../../API/AnimeService";
import Banner from "../../components/Banner/Banner";
import useSWR from "swr";
import { fetcher } from "../../API/Base";
import Loader from "../../components/Loader/Loader";
import ErrorBlock from "../../components/ErrorBlock/ErrorBlock";

const Home = () => {
    const popularKey = useMemo(() => getPopular(25, 1), []);
    const announcedKey = useMemo(() => getPopular(25, 1, "anons"), []);
    const [isRetrying, setIsRetrying] = useState(false);

    const { 
        data: popularAnime, 
        error: popularAnimeError, 
        mutate: popularMutate,
        isValidating: isPopularLoading
    } = useSWR(popularKey, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false
    });
    
    const { 
        data: announcedAnime, 
        error: announcedAnimeError, 
        mutate: announcedMutate,
        isValidating: isAnnouncedLoading
    } = useSWR(announcedKey, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false
    });

    const handleRetry = async () => {
        setIsRetrying(true);
        try {
            await Promise.all([popularMutate(), announcedMutate()]);
        } finally {
            setIsRetrying(false);
        }
    };

    if (popularAnimeError || announcedAnimeError) {
        return (
            <ErrorBlock
                message="Ой, сайт не работает, приносим извинения :("
                buttonText="Попробовать снова"
                onButtonClick={handleRetry}
                isLoading={isRetrying}
            />
        );
    }

    if (!popularAnime || !announcedAnime) {
        return <Loader />;
    }

    return (
        <div>
            <Banner />
            <AnimeList animes={popularAnime} name="Популярное" />
            <AnimeList animes={announcedAnime} name="Анонсированы" />
        </div>
    );
};

export default Home;