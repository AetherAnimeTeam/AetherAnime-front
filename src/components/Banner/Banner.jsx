import React from 'react';
import cls from "./Banner.module.css"
import {Link} from "react-router-dom";
import Button from "../UI/Button/Button";

const Banner = () => {
    return (
        <div className={cls.Banner}>
            {/*<Link to="/">*/}
            {/*    <Button />*/}
            {/*</Link>*/}
            <img src={require("../../assets/images/banner.png") || ''} alt="banner"/>
        </div>
    );
};

export default Banner;