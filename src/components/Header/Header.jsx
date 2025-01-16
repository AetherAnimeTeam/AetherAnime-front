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
import {getCredentials, getUserDataByToken, refreshToken} from "../../API/UserService";
import axios from "axios";
import SearchList from "../SeachList/SearchList";
import user from "../../pages/User/User";

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [animeName, setAnimeName] = useState("")
    // 0 - No error
    // 1 - Email
    // 2 - incorrect password or email
    // 3 - too simple password
    // 4 - different passwords
    // 5 - incorrect validation code
    const [errorCode, setError] = useState(0)
    const [cookies, setCookie, removeCookie] = useCookies(["access_token", "refresh_token"])
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const getData = async () => {
            if(cookies.access_token === "undefined" || cookies.access_token === undefined){
                if(cookies.refresh_token === "undefined" || cookies.refresh_token === undefined){
                    console.log("нет токенов")
                    setUserData(null);
                    setCurrentStep("login");
                    setEmail("");
                    setPassword("");
                    return;
                }
                removeCookie("access_token");
                const response = await refreshToken(cookies.refresh_token)
                setCookie("access_token", response.data.access, {maxAge: 24*60*60});
            }

            axios.get(...getUserDataByToken(cookies.access_token), {validateStatus: () => true})
                .then(r => setUserData(r.data));
        }
        getData();
    }, [cookies]);

    useEffect(() => {
        setTimeout(() => setError(0), 500)
    }, [errorCode]);

    const handleUser = () => {
        if(!userData)
            setIsModalOpen(true);
        else
            navigate(`/user/${userData.id}`);
    }

    useEffect(() => {
        const handleEscape = (e) => {
            if(e.key === 'Escape') {
                if(animeName) setAnimeName("");
                if(isModalOpen) setIsModalOpen(false);
            }
        };

        if (animeName) window.addEventListener('keydown', handleEscape);
        if (isModalOpen) window.addEventListener('keydown', handleEscape);

        return () => window.removeEventListener('keydown', handleEscape);

    }, [isModalOpen, animeName]);

    useEffect(  () => {
        if(currentStep !== "final" || userData === {}) return;
        const performLogin = async () => {
            const tokenResponse = await getCredentials(email, password)
            if(tokenResponse.status >= 400){
                setError(2)
                return;
            }
            setCookie("access_token", tokenResponse.data.access, {maxAge: tokenResponse.data.expires_in});
            setCookie("refresh_token", tokenResponse.data.refresh, {maxAge: 180*24*60*60});

            const response = await axios.get(...getUserDataByToken(tokenResponse.data.access));

            setIsModalOpen(false);
            setUserData(response.data);
            navigate(`/user/${response.data.id}`);
        }

        performLogin();

    }, [currentStep]);

    return (
        <header className={cls.Header}>
            <Link to="/">
                <Logo className={cls.Logo}/>
            </Link>
            <div className={cls.Main}>
                <div className={cls.Search}>
                    <input
                        type="text"
                        placeholder="Поиск аниме..."
                        value={animeName}
                        onChange={(e) => setAnimeName(e.target.value)}
                    />
                    <div onClick={(e) => {
                        if (e.target !== e.currentTarget) setAnimeName(""); }}>
                        {animeName ? <SearchList animeName={animeName}/> : null}
                    </div>

                </div>

                <Link to="/aya">
                    <NotificationIcon className={cls.icon}/>
                </Link>
                <Link to="/about">
                    <NotificationIcon className={cls.icon} />
                </Link>
                <Link to="/my">
                    <BookmarkIcon className={cls.icon} />
                </Link>
                <div className={cls.User} onClick={ handleUser }>
                    {userData ? null: <User/>}
                    <p>{userData?.username || "Войти"}</p>
                </div>
            </div>
            {isModalOpen && (
                <div className={cls.Modal} onClick={(e) => {
                    if (e.target === e.currentTarget) setIsModalOpen(false);
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
                                       errorCode={errorCode} setError={setError}/>
                        )}
                        {currentStep === 'register' && (
                            <RegisterForm setCurrentStep={setCurrentStep}
                                          password={password} setPassword={setPassword}
                                          email={email} setEmail={setEmail}
                                          errorCode={errorCode} setError={setError}/>
                        )}
                        {currentStep === 'code' && (
                            <CodeInput setCurrentStep={setCurrentStep} email={email}
                                       errorCode={errorCode} setError={setError}/>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;