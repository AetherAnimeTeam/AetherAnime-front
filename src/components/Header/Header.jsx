import React, { useState, useEffect } from 'react';
import cls from "./Header.module.css";
import { Link } from "react-router-dom";
import { ReactComponent as SearchIcon } from "../../assets/icons/search.svg";
import { ReactComponent as NotificationIcon } from "../../assets/icons/notification.svg";
import { ReactComponent as BookmarkIcon } from "../../assets/icons/bookmark.svg";
import { ReactComponent as User } from "../../assets/icons/user.svg";
import {ReactComponent as Logo} from "../../assets/icons/logo.svg";
import LoginForm from "../Login/Login";
import RegisterForm from "../Login/Register";
import CodeInput from "../Login/CodeInput";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('login');
  const [animeName, setAnimeName] = useState("")

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

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
        <Link to="/about" className={cls.route}>
          <NotificationIcon />
        </Link>
        <Link to="/my" className={cls.route}>
          <BookmarkIcon />
        </Link>
        <div className={cls.User} onClick={() => setIsModalOpen(true)}>
          <User />
          <p>Войти</p>
        </div>
      </div>
      {isModalOpen && (
        <div className={cls.Modal} onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsModalOpen(false);
          }
        }}>
          <div className={cls.ModalContent}>
              <h2  style={{marginBottom: 0}}>
                {currentStep === 'login' && 'Вход'}
                {currentStep === 'register' && 'Регистрация'}
                {currentStep === 'code' && 'Введите код'}
              </h2>
            {currentStep === 'login' && (
              <LoginForm setCurrentStep={setCurrentStep} />
            )}
            {currentStep === 'register' && (
              <RegisterForm setCurrentStep={setCurrentStep} />
            )}
            {currentStep === 'code' && (
              <CodeInput setIsModalOpen={setIsModalOpen} />
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;