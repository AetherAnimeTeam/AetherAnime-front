import React, {useState} from 'react';
import classes from "./Banner.module.css"
import Questionnaire from "../Questionnaire/Questionnaire";

const Banner = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={classes.Banner}>
            <p>Пройдите опрос и помогите улучшить наши сервисы!</p>

            <button onClick={openModal}>Пройти опрос</button>
            {isModalOpen && <Questionnaire closeModal={closeModal} />}

            <img src={process.env.PUBLIC_URL+"/banner.jpg"} alt="banner"/>
        </div>
    );
};

export default Banner;