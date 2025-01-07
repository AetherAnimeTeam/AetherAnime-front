import React, {useState} from 'react';
import classes from "./Login.module.css"
import {ReactComponent as GoogleLogo} from "../../assets/icons/google.svg"

const LoginForm = ({ setCurrentStep }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      setCurrentStep('final');
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
            <button type="submit">Войти</button>
            <p>У меня нет аккаунта, <a className={classes.clickableText}
                                       onClick={() => setCurrentStep('register')}>регистрация</a>
            </p>
            <p style={{marginTop: 0}}> Восстановить <a className={classes.whiteClickableText}>пароль</a> </p>
            <div className={classes.Other_login_methods}>вход через соц. сети</div>
            <div className={classes.SocialNetworks}>
                <GoogleLogo />
            </div>
        </form>
    );
  };

export default LoginForm;