import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReactComponent as VKIcon } from "../../assets/icons/vk.svg";
import { ReactComponent as TelegramIcon } from "../../assets/icons/telegram_gray.svg";
import "./User.css";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('friends');

  return (
    <div className="user-profile">
      <div className="content-container">
        <div 
          className="user-banner"
          style={{ 
            backgroundImage: `url(${require("../../assets/images/profile_image.png")})`,
          }}
        />
        
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-info">
              <img 
                src={require("../../assets/images/profile_avatar.png") || "/placeholder.svg"}
                alt="Avatar" 
                className="profile-avatar" 
              />
              <div className="profile-details">
                <h1>Osaka_911</h1>
                <span className="profile-status">Был(а) 7 минут назад</span>
              </div>
            </div>
            <div className="profile-actions">
              <button className="add-friend">
                <UserPlus size={16} />
                Добавить в друзья
              </button>
              <div className="social-buttons">
                <button className="social-btn">
                  <VKIcon />
                </button>
                <button className="social-btn">
                  <TelegramIcon />
                </button>
              </div>
            </div>
          </div>

          <nav className="profile-tabs">
            <button 
              className={activeTab === 'lists' ? 'active' : ''}
              onClick={() => setActiveTab('lists')}
            >
              Списки
            </button>
            <button 
              className={activeTab === 'comments' ? 'active' : ''}
              onClick={() => setActiveTab('comments')}
            >
              Комментарии
            </button>
            <button 
              className={activeTab === 'favorites' ? 'active' : ''}
              onClick={() => setActiveTab('favorites')}
            >
              Избранное
            </button>
            <button 
              className={activeTab === 'reviews' ? 'active' : ''}
              onClick={() => setActiveTab('reviews')}
            >
              Рецензии
            </button>
            <button 
              className={activeTab === 'history' ? 'active' : ''}
              onClick={() => setActiveTab('history')}
            >
              История просмотра
            </button>
            <button 
              className={activeTab === 'friends' ? 'active' : ''}
              onClick={() => setActiveTab('friends')}
            >
              Друзья
            </button>
          </nav>

          <div className="profile-content-area">
            <div className="search-bar">
              <input type="text" placeholder="Поиск..." />
            </div>
            <div className="friends-section">
              <div className="friends-categories">
                <button className="active">Друзья</button>
                <button>Заявки в друзья</button>
                <button>Отправленные запросы</button>
              </div>
              <div className="friends-list">
                {Array(8).fill().map((_, i) => (
                  <div key={i} className="friend-item">
                    <img 
                      src={require("../../assets/images/profile_avatar.png") || "/placeholder.svg"}
                      alt="Friend avatar" 
                      className="friend-avatar"
                    />
                    <div className="friend-info">
                      <span className="friend-name">НикНикНикНик</span>
                      <span className="friend-count">2343 друзей</span>
                    </div>
                    <div className="friend-actions">
                      <button className="accept">✓</button>
                      <button className="reject">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
