import React from 'react';
import classes from "./StatisticBlock.module.css"
const StatisticBlock = ({ blockName, data }) => {
    return (
        <div className={classes.StatisticsContainer}>
            <h2 className={classes.StatisticsName}>{ blockName }</h2>
            {data ?
                <div>

                </div> :
                <div>
                    <p className={classes.NoInfoText}>Отсутствует информация</p>
                </div>}
        </div>
    );
};

export default StatisticBlock;