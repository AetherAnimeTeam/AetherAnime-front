import React from 'react';
import cls from "./Banner.module.css"
import {Link} from "react-router-dom";
import Button from "../UI/Button/Button";
import Score from "../UI/Score/Score";

const Banner = () => {

    const name = "Унесенные призраками"
    const description = "Махито ищет маму в сказочном мире. Шедевр Хаяо Миядзаки, получивший «Оскар» за лучшую анимацию"


    return (
        <div className={cls.Banner}>
            <img src={require("../../assets/images/banner.png") || ''} alt="banner"/>
            <div className={cls.Card}>
                <h1>{name}</h1>
                <p>{description}</p>

                {/*<div className={cls.additionalInfo}>*/}
                {/*    <Score score={7.1}/>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default Banner;