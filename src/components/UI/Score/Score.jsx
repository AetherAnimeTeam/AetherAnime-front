import React from 'react';
import classes from "./Score.module.css";
import {ReactComponent as StarIcon} from "../../../assets/icons/star.svg";

const Score = ({ score }) => {
    return (
        <div className={classes.Score}>
            <StarIcon style={{alignSelf: "center"}}/>
            <p>{score}</p>
        </div>
    );
};

export default Score;