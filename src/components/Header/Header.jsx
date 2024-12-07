import React from 'react';
import cls from "./Header.module.css";
import {Link} from "react-router-dom";
import {ReactComponent as SearchIcon} from "../../assets/icons/search.svg";
import {ReactComponent as NotificationIcon} from "../../assets/icons/notification.svg";
import {ReactComponent as BookmarkIcon} from "../../assets/icons/bookmark.svg";
import {ReactComponent as User} from "../../assets/icons/user.svg";

const Header = () => {
    return (
        <header className={cls.Header}>
            <Link to="/" className={cls.Logo}>AetherAnime</Link>
            <div className={cls.Routes}>
                <Link to="/" className={cls.route}>
                    <SearchIcon/>
                </Link>

                <Link to="/about" className={cls.route}>
                    <NotificationIcon/>
                </Link>

                <Link to="/my" className={cls.route}>
                    <BookmarkIcon/>
                </Link>

                <div className={cls.User}>
                    <User />
                    <p>Войти</p>
                </div>
            </div>

        </header>
    );
};

export default Header;