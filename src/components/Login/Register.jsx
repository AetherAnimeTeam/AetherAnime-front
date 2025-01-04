import {useState} from "react";
import classes from "./Login.module.css";

const RegisterForm = ({ setCurrentStep }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      setCurrentStep('login');
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
            <p>У меня есть аккаунт, <a className={classes.clickableText}
                                       onClick={() => setCurrentStep('login')}>вход</a>
            </p>
      </form>
    );
  };

export default RegisterForm;