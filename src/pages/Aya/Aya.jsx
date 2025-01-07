import React from 'react';
import "./Aya.css"

const Aya = () => {
    return (
        <div className="Aya">
            <img src={require("../../assets/images/aya.png") || ''} alt="aa"/>

            <h1>Айя сейчас обучается, скоро она придет сюда</h1>
            <p>Следите за обновлениями в нашем телеграмм канале <a href="https://t.me/aether_anime" target="_blank">AetherAnime</a></p>
        </div>
    );
};

export default Aya;