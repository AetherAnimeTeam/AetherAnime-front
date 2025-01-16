import {useEffect, useState} from "react";
import classes from "./Login.module.css";
import {register} from "../../API/UserService";
import {post} from "../../API/Base";

const RegisterForm = ({ setCurrentStep, password, setPassword, email, setEmail, errorCode, setError}) => {
    const [confirmPassword, setConfirmPassword] = useState("");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(confirmPassword !== password){
            setError(4);
            return;
        }
        if(!passwordRegex.test(password)){
            setError(3);
            return;
        }

        try {
            const {data: data, status: status} = await post(...register({username: email.split("@")[0].slice(0, 6),
                email: email, password: password}));
            if(status !== 201) {
                setError(1);
                return;
            }
        } catch (e) {
            setError(e.message); // TODO: Another one page for errors!
            return;
        }

        setCurrentStep('code');
    };

    return (
        <form onSubmit={handleSubmit} className={classes.Container}>
            <input
                className={errorCode === 1 ? `${classes.error} ${classes.shake}`: null}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                onInvalid={() => setError(1)}
            />
            <input
                className={(errorCode === 3 || errorCode === 4) ? `${classes.error} ${classes.shake}`: null}
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                onInvalid={() => setError(4)}
            />
            <input
                className={(errorCode === 3 || errorCode === 4) ? `${classes.error} ${classes.shake}`: null}
                type="password"
                placeholder="Повторитe пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                onInvalid={() => setError(4)}
            />
            <button type="submit">Зарегистрироваться</button>
            <p>У меня есть аккаунт, <a className={classes.clickableText}
                                       onClick={() => setCurrentStep('login')}>вход</a>
            </p>
      </form>
    );
  };

export default RegisterForm;