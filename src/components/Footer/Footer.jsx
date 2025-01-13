import React from 'react';
import {ReactComponent as TelegramIcon} from "../../assets/icons/telegram_gray.svg";
import classes from "./Footer.module.css"

const Footer = () => {
    return (
        <div className={classes.Footer}>
            <p className={classes.Text}>Техническая поддержка</p>
            <div className={classes.Telegram} >
                <TelegramIcon className={classes.Icon} />
                <a className={classes.Link} href="https://t.me/aether_anime">Aether Anime</a>
            </div>
        </div>
    );
};

export default Footer;