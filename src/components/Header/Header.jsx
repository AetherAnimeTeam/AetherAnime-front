import React, { useEffect, useState, useRef } from 'react';
import cls from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as NotificationIcon } from "../../assets/icons/bell.svg";
import { ReactComponent as AyaIcon } from "../../assets/icons/aya_new.svg";
import { ReactComponent as BookmarkIcon } from "../../assets/icons/bookmark.svg";
import { ReactComponent as User } from "../../assets/icons/user.svg";
import { ReactComponent as Logo } from "../../assets/icons/origami.svg";
import { ReactComponent as MenuIcon } from "../../assets/icons/menu.svg";
import { ReactComponent as SearchIcon } from "../../assets/icons/search.svg";
import { ReactComponent as HomeIcon } from "../../assets/icons/house.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/x.svg";
import LoginForm from "../Login/Login";
import RegisterForm from "../Login/Register";
import CodeInput from "../Login/CodeInput";
import { useCookies } from "react-cookie";
import { getCredentials, getUserDataByToken, refreshToken } from "../../API/UserService";
import axios from "axios";
import SearchList from "../SeachList/SearchList";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [animeName, setAnimeName] = useState("");
    const [errorCode, setError] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies(["access_token", "refresh_token"]);
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [isSearchActive, setIsSearchActive] = useState(false); 
    const searchContainerRef = useRef(null); 

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsSearchActive(false); 
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleAnimeClick = () => {
        setIsSearchActive(false); 
    };

    useEffect(() => {
        const getData = async () => {
            if (cookies.access_token === "undefined" || cookies.access_token === undefined) {
                if (cookies.refresh_token === "undefined" || cookies.refresh_token === undefined) {
                    setUserData(null);
                    setCurrentStep("login");
                    setEmail("");
                    setPassword("");
                    return;
                }
                removeCookie("access_token");
                const response = await refreshToken(cookies.refresh_token);
                setCookie("access_token", response.data.access, { maxAge: 24 * 60 * 60 });
            }

            axios.get(...getUserDataByToken(cookies.access_token), { validateStatus: () => true })
                .then(r => setUserData(r.data));
        };
        getData();
    }, [cookies]);

    useEffect(() => {
        setTimeout(() => setError(0), 500);
    }, [errorCode]);

    const handleUser = () => {
        if (!userData)
            setIsModalOpen(true);
        else
            navigate(`/user/${userData.id}`);
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                if (animeName) setAnimeName("");
                if (isModalOpen) setIsModalOpen(false);
            }
        };

        if (animeName) window.addEventListener('keydown', handleEscape);
        if (isModalOpen) window.addEventListener('keydown', handleEscape);

        return () => window.removeEventListener('keydown', handleEscape);
    }, [isModalOpen, animeName]);

    useEffect(() => {
        if (currentStep !== "final" || userData === {}) return;
        const performLogin = async () => {
            const tokenResponse = await getCredentials(email, password);
            if (tokenResponse.status >= 400) {
                setError(2);
                return;
            }
            setCookie("access_token", tokenResponse.data.access, { maxAge: tokenResponse.data.expires_in });
            setCookie("refresh_token", tokenResponse.data.refresh, { maxAge: 180 * 24 * 60 * 60 });

            const response = await axios.get(...getUserDataByToken(tokenResponse.data.access));

            setIsModalOpen(false);
            setUserData(response.data);
            navigate(`/user/${response.data.id}`);
        };

        performLogin();
    }, [currentStep]);

    return (
        <header className={cls.header}>
            <div className={cls.headerWrapper}>
                <div className={cls.logoAndSearchContainer}>
                    <Link to="/" className={cls.logoContainer}>
                        <Logo className={cls.logo} />
                        <span className={cls.logoText}>AetherAnime</span>
                    </Link>

                    <div className={cls.searchContainer} ref={searchContainerRef}>
                        <input
                            type="text"
                            placeholder="Поиск аниме..."
                            value={animeName}
                            onChange={(e) => setAnimeName(e.target.value)}
                            onFocus={() => setIsSearchActive(true)}
                        />
                        <SearchIcon className={cls.searchIcon} />
                        {isSearchActive && animeName.length > 2 && (
                            <div className={cls.searchResultsWrapper}>
                                <SearchList animeName={animeName} onAnimeClick={handleAnimeClick} setAnimeName={setAnimeName} />
                            </div>
                        )}
                    </div>
                </div>

                <div className={cls.iconsContainer}>
                    <Link to="/about" className={cls.iconLink}>
                        <NotificationIcon className={cls.icon} />
                    </Link>
                    <Link to="/my" className={cls.iconLink}>
                        <BookmarkIcon className={cls.icon} />
                    </Link>
                    <Link to="/aya" className={cls.iconLink}>
                        <AyaIcon className={cls.icon} />
                    </Link>
                    <button className={cls.loginButton} onClick={handleUser}>
                        {userData ? null : <User />}
                        <p>{userData?.username || "Войти"}</p>
                    </button>
                </div>

                <label className={cls.hamburgerMenu}>
                    <input
                        type="checkbox"
                        checked={isMenuOpen}
                        onChange={() => setIsMenuOpen(!isMenuOpen)}
                    />
                    <MenuIcon className={cls.hamburgerIcon} />
                </label>
            </div>

            <div className={`${cls.mobileMenu} ${isMenuOpen ? cls.mobileMenuOpen : ''}`}>
                <Link to="/" className={cls.mobileMenuItem}>
                    <HomeIcon className={cls.mobileMenuIcon} />
                    <span>Главная</span>
                </Link>
                <Link to="/about" className={cls.mobileMenuItem}>
                    <NotificationIcon className={cls.mobileMenuIcon} />
                    <span>Увед.</span>
                </Link>
                <Link to="/my" className={cls.mobileMenuItem}>
                    <BookmarkIcon className={cls.mobileMenuIcon} />
                    <span>Закладки</span>
                </Link>
                <Link to="/aya" className={cls.mobileMenuItem}>
                    <AyaIcon className={cls.mobileMenuIcon} />
                    <span>Aya</span>
                </Link>
                <Link className={cls.mobileMenuItem} onClick={handleUser}>
                    <User className={cls.mobileMenuIcon} />
                    <span>{userData?.username || "Войти"}</span>
                </Link>
            </div>

            {isModalOpen && (
                <div className={cls.modalOverlay} onClick={(e) => {
                    if (e.target === e.currentTarget) setIsModalOpen(false);
                }}>
                    <div className={cls.modalContent}>
                        <CloseIcon 
                            className={cls.closeIcon} 
                            onClick={() => setIsModalOpen(false)}
                            style={{color: "white"}}
                        />
                        <h2 style={{ marginBottom: 0 }}>
                            {currentStep === 'login' && 'Вход'}
                            {currentStep === 'register' && 'Регистрация'}
                            {currentStep === 'code' && 'Введите код'}
                        </h2>
                        {currentStep === 'login' && (
                            <LoginForm setCurrentStep={setCurrentStep}
                                password={password} setPassword={setPassword}
                                email={email} setEmail={setEmail}
                                errorCode={errorCode} setError={setError} />
                        )}
                        {currentStep === 'register' && (
                            <RegisterForm setCurrentStep={setCurrentStep}
                                password={password} setPassword={setPassword}
                                email={email} setEmail={setEmail}
                                errorCode={errorCode} setError={setError} />
                        )}
                        {currentStep === 'code' && (
                            <CodeInput setCurrentStep={setCurrentStep} email={email}
                                errorCode={errorCode} setError={setError} />
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;