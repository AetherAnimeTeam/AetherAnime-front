import React, {useState} from 'react';
import classes from "./Banner.module.css"
import Questionnaire from "../Questionnaire/Questionnaire";

const Banner = () => {
      const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div className={classes.Banner}>
            <p>Пройдите опрос и помогите улучшить наши сервисы!</p>

            <button onClick={() => setModalOpen(true)}>Пройти опрос</button>
            <Questionnaire isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
            <img src={process.env.PUBLIC_URL+"/banner.jpg"} alt="banner"/>
        </div>
    );
};

export default Banner;