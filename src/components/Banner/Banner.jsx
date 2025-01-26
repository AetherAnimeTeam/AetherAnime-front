import React from 'react';
import cls from "./Banner.module.css";
import {Link, useNavigate} from "react-router-dom";
import Button from "../UI/Button/Button";
import { ReactComponent as StarIcon } from "../../assets/icons/star_filled.svg";

const Banner = () => {
    const name = "Унесённые призраками";
    const description = "Махито ищет маму в сказочном мире. Шедевр Хаяо Миядзаки, получивший «Оскар» за лучшую анимацию";
    const navigate = useNavigate();

    return (
        <div className={cls.Banner}>
            <img src={require("../../assets/images/banner_new.jpeg") || ''} alt="banner" />
            <div className={cls.Card}>
                <h1>{name}</h1>
                <p>{description}</p>
                <div className={cls.additionalInfo}>
                    <div className={cls.scoreBanner}>
                        <StarIcon style={{ alignSelf: "center" }} />
                        <span>7.1</span>
                    </div>
                    <span className={cls.year}>2023</span>
                    <span className={cls.genre}>жанр</span>
                </div>
                <div className={cls.buttonsContainer}>
                    <button className={cls.watchButton} onClick={() => navigate(`/anime/199`)}>Смотреть</button>
                    <button className={cls.trailerButton}>Трейлер</button>
                </div>
            </div>
        </div>
    );
};

export default Banner;