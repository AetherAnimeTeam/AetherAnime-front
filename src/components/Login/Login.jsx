import React, {useState} from 'react';
import classes from "./Login.module.css"
import {ReactComponent as GoogleLogo} from "../../assets/icons/google.svg"
import {useCookies} from "react-cookie";

const LoginForm = ({ setCurrentStep, password, setPassword, email, setEmail, error, setError}) => {
    const [cookies, setCookies] = useCookies(["access_token", "refresh_token", "expires_in"])

    const handleSubmit = (e) => {
        e.preventDefault();

        setCurrentStep("final");
    };

    return (
        <form onSubmit={handleSubmit} className={classes.Container}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <p className={classes.ErrorText} style={{marginTop: "122px"}}>{error}</p>

            <button type="submit">Войти</button>
            <p style={{marginBottom: "5px"}}>У меня нет аккаунта, <a className={classes.clickableText}
                                                                     onClick={() => setCurrentStep('register')}>регистрация</a>
            </p>
            <p style={{marginTop: 0}}> Восстановить <a className={classes.whiteClickableText}>пароль</a></p>
            <div className={classes.Other_login_methods}>вход через соц. сети</div>
            <div className={classes.SocialNetworks}>
                <GoogleLogo/>
            </div>
        </form>
    );
};

export default LoginForm;