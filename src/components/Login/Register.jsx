import {useState} from "react";
import classes from "./Login.module.css";
import {register} from "../../API/UserService";
import {post} from "../../API/Base";

const RegisterForm = ({ setCurrentStep, password, setPassword, email, setEmail, error, setError}) => {
    const [confirmPassword, setConfirmPassword] = useState("");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(confirmPassword !== password){
            setError("Пароли не совпадают!");
            return;
        }
        if(!passwordRegex.test(password)){
            setError("Ваш пароль слишком простой!");
            return;
        }

        try {
            const {data: data, status: status} = await post(...register({username: email.split("@")[0], email: email, password: password}));
            if(status !== 201) {
                setError(data.email);
                return;
            }
        } catch (e) {
            setError(e.message);
            return;
        }

        setCurrentStep('code');
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
            <input
                type="password"
                placeholder="Повторитe пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <button type="submit">Зарегистрироваться</button>
            <p className={classes.ErrorText}>{error}</p>
            <p>У меня есть аккаунт, <a className={classes.clickableText}
                                       onClick={() => setCurrentStep('login')}>вход</a>
            </p>
      </form>
    );
  };

export default RegisterForm;