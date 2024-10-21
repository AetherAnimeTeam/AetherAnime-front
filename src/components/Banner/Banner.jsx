import React from 'react';
import classes from "./Banner.module.css"
import {Link} from "react-router-dom";

const Banner = () => {
    return (
        <div className={classes.Banner}>
            <p>Пройдите опрос и помогите улучшить наши сервисы!</p>

            <Link className={classes.link} to="/questions">Пройти опрос</Link>
            <img src={process.env.PUBLIC_URL+"/banner.jpg"} alt="banner"/>
        </div>
    );
};

export default Banner;