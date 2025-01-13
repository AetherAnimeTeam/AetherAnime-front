import React, {useEffect, useMemo, useState} from 'react';
import {ReactComponent as DiscordIcon} from "../../assets/icons/discord.svg";
import {ReactComponent as VKIcon} from "../../assets/icons/vk.svg";
import {ReactComponent as TelegramIcon} from "../../assets/icons/telegram.svg";
import "./User.css"
import StatusLine from "../../components/StatusLine/StatusLine";
import {getUserDataById} from "../../API/UserService";
import useSWR from "swr";
import {fetcher} from "../../API/Base";
import {useParams} from "react-router-dom";

const User = () => {
    const params = useParams()

    const userParams = useMemo(() => getUserDataById(params.id),
        [params.id]);

    console.log(userParams)
    const {data: userData, error: userDataError} = useSWR(userParams, fetcher)
    if (!userData) return <div>Loading...</div>;

    console.log(userData)

    const data = {
        "Ужасы": 80,
        "Драма": 70,
        "Фантастика": 60,
        "Романтика": 20,
        "Мелодрама": 15,
        "Триллер": 5};

    return (
        <div className="Container">
            <img className="Banner" src={require("../../assets/images/banner.png")}/>
            <div className="StatBackground"/>
            <img className="Photo" src={require("../../assets/images/dummy_photo.png")}/>
            <div className="InfoContainer">
                <div className="Credentials">
                    <p className="Name">{userData.username}</p>
                </div>
                <div className="SocialNetworks">
                    <VKIcon className="SocialIcon"/>
                    <DiscordIcon className="SocialIcon"/>
                    <TelegramIcon className="SocialIcon"/>
                </div>

                <StatusLine data={data} />
            </div>
        </div>
    );
};

export default User;