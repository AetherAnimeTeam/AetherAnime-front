import React from "react";
import "./Loader.css";

const Loader = () => {
    return (
        <div className="loaderContainer">
            <div className="loaderSpinner"></div>
            <div className="loaderText">Загрузка...</div>
        </div>
    );
};

export default Loader;