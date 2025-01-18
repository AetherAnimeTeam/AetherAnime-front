import React, {useMemo, useState} from 'react';
import {useParams} from "react-router-dom";

import useSWR from "swr";
import {getDetailed, getPopular} from "../../API/AnimeService";
import {fetcher} from "../../API/Base";

import "./Anime.css"
import {ReactComponent as Star} from "../../assets/icons/star_filled.svg";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import AnimeList from "../../components/AnimeList/AnimeList";
import CommentField from "../../components/CommentField/CommentField";
import Button from "../../components/UI/Button/Button";
import {useCookies} from "react-cookie";
import {getComments, sendComment} from "../../API/CommentService";
import Comment from "../../components/UI/Comment/Comment";
import {getUserDataById} from "../../API/UserService";

const Anime = () => {
    const params = useParams()
    const [cookie] = useCookies(["access_token"])
    const descriptionRegex = /(\[character=\d+]|\[\/character])/g;
    const popularKey = useMemo(() => getPopular(25, 1), []);
    const { data: popularAnime, error: popularAnimeError } = useSWR(popularKey, fetcher);
    const ageRatingDict = {g: "0+", pg: "0+", pg_13: "13+", r: "17+", nc_17: "18+"}
    const statusDict = {released: "Вышел"}
    const animeKey = useMemo(() => getDetailed(params["id"]), [params])
    const commentsKey = useMemo(() => getComments(params["id"]), [params])
    const { data: animeMeta, error: metaError } = useSWR(animeKey, fetcher);
    const { data: comments, error: commentsError, mutate: commentsMutate} = useSWR(commentsKey, fetcher)
    const stars = [...Array(10)].map((_, index) => (<Star key={index} className="Star" />));
    const makeComment = async (text) => {
        await sendComment(params["id"], text, cookie.access_token);
        await commentsMutate();
    }

    if(metaError || popularAnimeError || commentsError ) return <div>Error</div>
    if(!animeMeta || !popularAnime || !comments) return <div>Loading...</div>

    return (
        <div className="Container">
            <div className="Anime">
                <div className="Media">
                    <img src={animeMeta.poster_url} alt="poster"/>
                </div>
                <div className="Info">
                    <h1>{animeMeta.name_ru}</h1>
                    <p className="description">
                        {animeMeta.description ? animeMeta.description.replace(descriptionRegex, "") : "Описание отсутствует!"}
                    </p>

                    <div className="Details">
                        <div className="Details-block">
                            <p className="Detail-name">Название в оригинале</p>
                            <p className="Detail-name">Жанр</p>
                            <p className="Detail-name">Страна</p>
                            <p className="Detail-name">Дата выхода</p>
                            <p className="Detail-name">Статус</p>
                        </div>
                        <div className="Details-block">
                            <p className="Detail-value">{animeMeta.name_original}</p>
                            <p className="Detail-value">{animeMeta.genres.map(item => item.name).join(", ")}</p>
                            <p className="Detail-value">Япония</p>
                            <p className="Detail-value">{animeMeta.release_date}</p>
                            <p className="Detail-value">{statusDict[animeMeta.status]}</p>
                        </div>
                        <div className="Details-block">
                            <p className="Detail-name">Продолжительность серии</p>
                            <p className="Detail-name">Количество серий</p>
                            <p className="Detail-name">Вышло серий</p>
                            <p className="Detail-name">Студия</p>
                            <p className="Detail-name">Возрастной рейтинг</p>
                        </div>
                        <div className="Details-block">
                            <p className="Detail-value"> ~{animeMeta.duration} минуты</p>
                            <p className="Detail-value">{animeMeta.episodes} эпизодов</p>
                            <p className="Detail-value">{animeMeta.episodes_aired} эпизодов</p>
                            <p className="Detail-value">{animeMeta.studios.join(", ")}</p>
                            <p className="Detail-value">{ageRatingDict[animeMeta.age_rating]}</p>
                        </div>
                    </div>
                </div>
                <div className="Rating">
                <h2 style={{ color: `rgb(${
                    animeMeta.score >= 7 ? '47, 237, 110' : 
                        animeMeta.score >= 5 ? '250, 139, 59' : '222, 81, 81' })` }}>{animeMeta.score}</h2>
                    <div className="Stars"> {stars} </div>
                    <p>{animeMeta.score_count} оценок</p>
                </div>
            </div>
            <div className="Video">
                <VideoPlayer animeName={animeMeta.name_ru}/>
            </div>

            <AnimeList animes={popularAnime} name="Похожие"/>

            {cookie.access_token ? <div className="CommentsContainer">
                <h2 className="sub-header">Написать комментарий</h2>
                <CommentField sendComment={makeComment}/>
            </div> : <h2 className="sub-header" style={{marginLeft: "2.6vw", marginTop: "2.6vw"}}>
                Писать комментарии может только зарегистрированный пользователь!</h2> }

            {comments.results.map((obj) => <Comment userId={obj.user} text={obj.content}/>)}
        </div>

    );
};

export default Anime;