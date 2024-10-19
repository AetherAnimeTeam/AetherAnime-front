import React from 'react';
import classes from "./Header.module.css";
import {Link} from "react-router-dom";

const Header = () => {
    return (
        <header className={classes.Header}>
            <Link to="/" className={classes.Logo}>AetherAnime</Link>
            <div className={classes.Routes}>
                <Link to="/" className={classes.route}>Главное</Link>
                <Link to="/about" className={classes.route}>О нас</Link>
                <Link to="/my" className={classes.route}>Моё</Link>
            </div>

        </header>
    );
};

export default Header;