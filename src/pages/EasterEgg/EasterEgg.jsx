import React from 'react';
import "./EasterEgg.css"

const EasterEgg = () => {
    return (
        <div>
            <img className="image" src={require("../../assets/images/easter_egg.png")}/>
        </div>
    );
};

export default EasterEgg;