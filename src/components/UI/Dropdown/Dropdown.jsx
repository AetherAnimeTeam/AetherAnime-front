import React from 'react';
import classes from "./Dropdown.module.css"
import {ReactComponent as UserIcon} from "../../../assets/icons/user.svg";
import {ReactComponent as FriendsIcon} from "../../../assets/icons/friends.svg";
import {ReactComponent as SettingsIcon} from "../../../assets/icons/settings.svg";
import {ReactComponent as LogoutIcon} from "../../../assets/icons/logout.svg";

const Dropdown = () => {
    return (
        <div className={classes.dropdownContainer}>
            <div className={classes.dropdownItem}>
                <UserIcon/>
                <p className={classes.dropdownText}>Мой профиль</p>
            </div>
            <div className={classes.dropdownItem}>
                <FriendsIcon/>
                <p className={classes.dropdownText}>Друзья</p>
            </div>
            <div className={classes.dropdownItem}>
                <SettingsIcon/>
                <p className={classes.dropdownText}>Настройки</p>
            </div>
            <div className={classes.dropdownItem}>
                <LogoutIcon/>
                <p className={classes.dropdownText}>Выход</p>
            </div>
        </div>
    );
};

export default Dropdown;