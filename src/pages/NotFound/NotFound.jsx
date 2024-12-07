import React from 'react';
import "./NotFound.css"

const NotFound = () => {
    return (
        <div className="NotFound">
            <img src={require("../../assets/images/404.png") || ''} alt="aa"/>

            <h1>Упс, такой страницы не существует</h1>
        </div>
    );
};

export default NotFound;