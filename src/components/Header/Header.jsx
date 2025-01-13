import React, {useEffect, useState} from 'react';
import cls from "./Header.module.css";
import {Link, useNavigate} from "react-router-dom";
import {ReactComponent as NotificationIcon} from "../../assets/icons/notification.svg";
import {ReactComponent as BookmarkIcon} from "../../assets/icons/bookmark.svg";
import {ReactComponent as User} from "../../assets/icons/user.svg";
import {ReactComponent as Logo} from "../../assets/icons/logo.svg";
import LoginForm from "../Login/Login";
import RegisterForm from "../Login/Register";
import CodeInput from "../Login/CodeInput";
import {useCookies} from "react-cookie";
import {getCredentials, getUserDataById, getUserDataByToken} from "../../API/UserService";
import axios from "axios";

const Header = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [animeName, setAnimeName] = useState("")
    const [error, setError] = useState("")
    const [cookies, setCookie] = useCookies()
    const navigate = useNavigate()
    const userData = props.data

    const handleUser = () => {
        if(!userData.username)
            setIsModalOpen(true);
        else
            navigate(`/user/${userData.id}`);
    }

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isModalOpen)
                setIsModalOpen(false);
        };

        if (isModalOpen) window.addEventListener('keydown', handleEscape);

        return () => window.removeEventListener('keydown', handleEscape);

    }, [isModalOpen]);

    useEffect(  () => {
        if(currentStep !== "final" || userData === {}) return;
        const performLogin = async () => {
            const tokenResponse = await getCredentials(email, password)
            if(tokenResponse.status >= 400){
                setError("Неправильно введен пароль или логин!")
                return;
            }
            setCookie("access_token", tokenResponse.data.access, {maxAge: tokenResponse.data.expires_in});
            setCookie("refresh_token", tokenResponse.data.refresh, {maxAge: 180*24*60*60});

            const response = await axios.get(...getUserDataByToken(tokenResponse.data.access));

            setIsModalOpen(false);
            props.setUserData(response.data);
            navigate(`/user/${response.data.id}`);
        }

        performLogin();

    }, [currentStep]);

    return (
        <header className={cls.Header}>
            <Link to="/" className={cls.Logo}>
                <Logo />
            </Link>
            <div className={cls.Main}>
                <input
                    type="text"
                    placeholder="Поиск аниме..."
                    value={animeName}
                    onChange={(e) => setAnimeName(e.target.value)}
                />

                <Link to="/aya" className={cls.route}>
                    <NotificationIcon />
                </Link>
                <Link to="/about" className={cls.route}>
                    <NotificationIcon />
                </Link>
                <Link to="/my" className={cls.route}>
                    <BookmarkIcon />
                </Link>
                <div className={cls.User} onClick={ handleUser }>
                    {userData.username ? null: <User/>}
                    <p>{userData.username || "Войти"}</p>
                </div>
            </div>
            {isModalOpen && (
                <div className={cls.Modal} onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setIsModalOpen(false);
                    }
                }}>
                    <div className={cls.ModalContent}>
                        <h2 style={{marginBottom: 0}}>
                            {currentStep === 'login' && 'Вход'}
                            {currentStep === 'register' && 'Регистрация'}
                            {currentStep === 'code' && 'Введите код'}
                        </h2>
                        {currentStep === 'login' && (
                            <LoginForm setCurrentStep={setCurrentStep}
                                       password={password} setPassword={setPassword}
                                       email={email} setEmail={setEmail}
                                       error={error} setError={setError}/>
                        )}
                        {currentStep === 'register' && (
                            <RegisterForm setCurrentStep={setCurrentStep}
                                          password={password} setPassword={setPassword}
                                          email={email} setEmail={setEmail}
                                          error={error} setError={setError}/>
                        )}
                        {currentStep === 'code' && (
                            <CodeInput setCurrentStep={setCurrentStep} email={email}
                                       error={error} setError={setError}/>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;