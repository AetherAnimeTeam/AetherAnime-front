import React, {useState, useEffect, useRef, useMemo} from 'react';
import { UserPlus } from 'lucide-react';
import { ReactComponent as VKIcon } from "../../assets/icons/vk_icon.svg";
import { ReactComponent as TelegramIcon } from "../../assets/icons/tg_icon.svg";
import {backendUrl, fetcher, post} from '../../API/Base';
import Loader from "../../components/Loader/Loader"
import "./User.css";
import {useParams} from "react-router-dom";
import useSWR from "swr";
import {deactivate, getUserDataById, setUserData} from "../../API/UserService";
import {useCookies} from "react-cookie";

const UserProfile = () => {
  const params = useParams();
  const [localUserData, setLocalUserData] = useState({username: "", email: ""});
  const [activeTab, setActiveTab] = useState('settings');
  const [cookie, setCookie, removeCookie] = useCookies(["access_token", "refresh_token"])
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [error, setError] = useState('');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const tabsRef = useRef([]);
  const fileInputRef = useRef(null);
  const userKey = useMemo(() => getUserDataById(params["id"]), [params])
  const {data: userData, mutate: userMutate, error: userError} = useSWR(userKey, fetcher)

  useEffect(() => {
    return () => {
      if (previewAvatar) URL.revokeObjectURL(previewAvatar);
    };
  }, [previewAvatar]);

  const updateIndicator = () => {
    const activeIndex = ['settings', 'lists', 'comments'].indexOf(activeTab);
    const tabNode = tabsRef.current[activeIndex];
    if (tabNode) {
      const { offsetLeft, offsetWidth } = tabNode;
      setIndicatorStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  };

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

  const updateUserData = async (formData) => {
    console.log('Демо-данные для отправки:', Object.fromEntries(formData));
    await setUserData(cookie["access_token"], ...userData)
    return {
      ...userData,
      profile_picture: formData.get('profile_picture') 
        ? URL.createObjectURL(formData.get('profile_picture')) 
        : userData.profile_picture
    };
  };

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const data = await getUserDataByToken();
  //       setUserData({
  //         username: data.username,
  //         email: data.email,
  //         profile_picture: data.profile_picture
  //       });
  //     } catch (err) {
  //       console.error('Ошибка загрузки данных:', err);
  //       setError('Демо-режим: данные не загружены');
  //     }
  //   };
  //
  //   if (activeTab === 'settings') {
  //     fetchUserData();
  //   }
  // }, [activeTab]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/') || file.type === 'image/gif') {
      setError('Разрешены только файлы изображений (PNG, JPEG, WEBP)');
      e.target.value = null;
      return;
    }

    setError('');
    setLocalUserData(prev => ({ ...prev, profile_picture: file }));
    setPreviewAvatar(URL.createObjectURL(file));
    setHasUnsavedChanges(true);
    e.target.value = null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalUserData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData();
    formData.append('username', localUserData.username);
    formData.append('email', localUserData.email);
    if (localUserData.profile_picture instanceof File) {
      formData.append('profile_picture', localUserData.profile_picture);
    }

    try {
      console.log(formData)
      const updatedUser = await setUserData(cookie["access_token"], formData);
      // alert('Демо-режим: данные не сохраняются');
      setLocalUserData(prev => ({
        ...prev,
        ...updatedUser,
        profile_picture: updatedUser.profile_picture || prev.profile_picture
      }));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Ошибка обновления:', error);
      setError('Демо-режим: изменения не сохраняются');
    }
  };

  const handleLogout = () => {
    if(window.confirm('Вы уверены, что хотите выйти?')) {
      removeCookie('access_token');
      removeCookie('refresh_token');
      window.location.href = '/';
    }
  };

  const handleDeleteAccount = async () => {
    if(window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить!')) {
      const confirmation = prompt('Введите "ПОДТВЕРДИТЬ" для удаления аккаунта:');
      if(confirmation === 'ПОДТВЕРДИТЬ') {
        await deactivate(cookie["access_token"]);
        removeCookie('access_token');
        removeCookie('refresh_token');
        window.location.href = '/';
      } else {
        alert('Подтверждение не удалось');
      }
    }
  };

  useEffect(() => {
    if (!userData) return;
    setLocalUserData(userData);
  }, [userData]);

  if (!userData) return <Loader />;

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
                src={previewAvatar || `https://api-aetheranime.yfrite.tatar${userData.profile_picture}` || require("../../assets/images/profile_avatar.png")}
                alt="Avatar" 
                className="profile-avatar" 
                onClick={handleAvatarClick}
                style={{ cursor: 'pointer' }}
              />
              <div className="profile-details">
                <h1>{localUserData.username}</h1>
                <span className="profile-status">Был(а) недавно</span>
              </div>
            </div>
            <div className="profile-actions">
              <button className="add-friend">
                <UserPlus size={16} />
                Добавить в друзья
              </button>
              <div className="social-buttons">
                <button className="social-btn">
                  <VKIcon className="social-icon" />
                </button>
                <button className="social-btn">
                  <TelegramIcon className="social-icon" />
                </button>
              </div>
            </div>
          </div>
          <nav className="profile-tabs">
            {['settings', 'lists', 'comments'].map((tab, index) => (
              <button 
                key={tab}
                ref={el => tabsRef.current[index] = el}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'settings' && 'Настройки'}
                {tab === 'lists' && 'Списки'}
                {tab === 'comments' && 'Комментарии'}
              </button>
            ))}
            <div className="tab-indicator" style={indicatorStyle} />
          </nav>
          <div className="profile-content-area">
            {activeTab === 'settings' && (
              <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                  <label>Аватар профиля</label>
                  <div className="avatar-upload">
                    <img 
                      src={previewAvatar || `https://api-aetheranime.yfrite.tatar${userData.profile_picture}` || require("../../assets/images/profile_avatar.png")}
                      alt="Avatar" 
                      className="avatar-preview"
                      onClick={handleAvatarClick}
                      style={{ cursor: 'pointer' }}
                    />
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/webp"
                      style={{ display: 'none' }}
                    />
                  </div>
                  <span className="hint-text">Нажмите на аватар для изменения</span>
                </div>

                {hasUnsavedChanges && (
                  <div className="unsaved-changes-message">
                    Изменения не сохранены. Для применения нажмите «Сохранить изменения».
                  </div>
                )}

                <div className="form-group">
                  <label>Имя пользователя</label>
                  <input
                    type="text"
                    name="username"
                    value={localUserData.username}
                    onChange={handleInputChange}
                    placeholder="Введите ваше имя"
                  />
                </div>

                <div className="form-group">
                  <label>Электронная почта</label>
                  <input
                    type="email"
                    name="email"
                    value={localUserData.email}
                    onChange={handleInputChange}
                    placeholder="example@mail.com"
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="save-button">
                  Сохранить изменения
                </button>

                <div className="account-actions">
                  <button 
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                  >
                    Выйти из аккаунта
                  </button>
                  
                  <button
                    type="button"
                    className="delete-account-button"
                    onClick={handleDeleteAccount}
                  >
                    Удалить аккаунт
                  </button>
                </div>
              </form>
            )}
            {activeTab === 'lists' && <div className="lists-section"></div>}
            {activeTab === 'comments' && <div className="comments-section"></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;