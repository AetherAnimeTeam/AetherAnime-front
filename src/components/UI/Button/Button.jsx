import React from 'react';
import cls from "./Button.module.css";

const Button = (props) => {
    return (
        <button className={cls.Button} {...props}>

        </button>
    );
};

export default Button;