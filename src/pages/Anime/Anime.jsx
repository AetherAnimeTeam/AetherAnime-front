'use client'

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import {getDetailed, getPopular, setStatus} from "../../API/AnimeService";
import { fetcher } from "../../API/Base";
import { useCookies } from "react-cookie";
import { getComments, sendComment } from "../../API/CommentService";
import { Star, ChevronDown, Info, CheckCheck, Check, Clock, Pause, X } from "lucide-react";
import AnimeList from "../../components/AnimeList/AnimeList";
import CommentField from "../../components/CommentField/CommentField";
import Comment from "../../components/UI/Comment/Comment";
import Loader from "../../components/Loader/Loader";
import { motion } from "framer-motion";
import Modal from '../../components/Modal/Modal';
import "./Anime.css";
import "./tabs.css";
import PlayIcon from "../../assets/icons/play.svg";
import PlusIcon from "../../assets/icons/plus.svg";
import axios from "axios";
import {getAnimeStatus} from "../../API/UserService";

const Anime = () => {
  const params = useParams();
  const [cookie] = useCookies(["access_token"]);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isBookmarked, setBookmarked] = useState(false);
  const metadataValueRef = useRef(null);
  const [maxVisibleGenres, setMaxVisibleGenres] = useState(0);
  const [activeTab, setActiveTab] = useState('series');

  const descriptionRegex = /(\[character=\d+]|\[\/character])/g;
  const popularKey = useMemo(() => getPopular(25, 1), []);
  const { data: popularAnime, error: popularAnimeError } = useSWR(popularKey, fetcher);

  const ageRatingDict = { g: "0+", pg: "0+", pg_13: "13+", r: "17+", nc_17: "18+" };
  const statusToEnum = { "Смотрю": "watching", "Просмотрено": "completed", "В планах": "plan_to_watch",
    "Отложено": "on_hold", "Брошено": "dropped"};
  const enumToStatus = { "watching": "Смотрю", "completed": "Просмотрено", "plan_to_watch":  "В планах",
    "on_hold":  "Отложено", "dropped": "Брошено"};

  const animeKey = useMemo(() => getDetailed(params["id"]), [params]);
  const commentsKey = useMemo(() => getComments(params["id"]), [params]);

  const { data: animeMeta, error: metaError } = useSWR(animeKey, fetcher);
  const { data: comments, error: commentsError, mutate: commentsMutate } = useSWR(commentsKey, fetcher);

  useEffect(() => {
    const _getStatus = async () => {
      const response = await fetcher(...getAnimeStatus(params["id"], cookie["access_token"]))
      console.log(response)
      setSelectedStatus(enumToStatus[response["status"]])
    }
    _getStatus();
  }, []);
  useEffect(() => {
    const _setStatus = async () => {
      if (selectedStatus === "") return;
      await setStatus(params["id"], statusToEnum[selectedStatus], cookie["access_token"]);
    }
    _setStatus();
  }, [selectedStatus]);
  useEffect(() => {
    if (!metadataValueRef.current || !animeMeta?.genres) return;

    const calculateVisibleGenres = () => {
      const container = metadataValueRef.current;
      if (!container || container.offsetWidth === 0) return;

      const items = Array.from(container.children);
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.whiteSpace = 'nowrap';

      container.appendChild(tempSpan);

      let totalWidth = 0;
      let visibleCount = 0;
      const containerWidth = container.offsetWidth;
      const genreNames = animeMeta.genres.map(g => g.name);

      for (let i = 0; i < genreNames.length; i++) {
        tempSpan.textContent = genreNames[i] + (i < genreNames.length - 1 ? ', ' : '');
        const itemWidth = tempSpan.offsetWidth;

        if (totalWidth + itemWidth <= containerWidth) {
          totalWidth += itemWidth;
          visibleCount++;
        } else {
          break;
        }
      }

      container.removeChild(tempSpan);
      setMaxVisibleGenres(Math.max(visibleCount, 1)); // Минимум 1 жанр
    };

    const resizeObserver = new ResizeObserver(calculateVisibleGenres);
    resizeObserver.observe(metadataValueRef.current);

    calculateVisibleGenres();
    return () => resizeObserver.disconnect();
  }, [animeMeta?.genres]);

  const handleCommentSubmit = async (text) => {
    await sendComment(params["id"], text, cookie.access_token);
    await commentsMutate();
  };

  const renderMetadataValue = (items, showBadge = false) => {
    if (!items || items.length === 0) return <div className="metadata-value">Не указано</div>;

    const visibleCount = maxVisibleGenres > 0 ? maxVisibleGenres : items.length;
    const visibleItems = items.slice(0, visibleCount);
    const remaining = items.length - visibleCount;

    return (
      <div className="metadata-value" ref={metadataValueRef}>
        {visibleItems.map((item, index) => (
          <span key={index} className="genre-item">
            {item}
            {index < visibleItems.length - 1 && ', '}
          </span>
        ))}
        {showBadge && remaining > 0 && (
          <span 
            className="genre-badge"
            onClick={(e) => {
              e.stopPropagation();
              setShowMetadataModal(true);
            }}
          >
            +{remaining}
          </span>
        )}
      </div>
    );
  };

  const mainMetadata = [
    { 
      label: "Жанры", 
      value: animeMeta?.genres?.map((item) => item.name),
      showBadge: true
    },
    { label: "Студия", value: animeMeta?.studios },
    { label: "Рейтинг", value: animeMeta?.age_rating && ageRatingDict[animeMeta.age_rating] },
    {
      label: "Релиз",
      value: animeMeta?.release_date && new Date(animeMeta.release_date).toLocaleDateString(navigator.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  ];

  const additionalMetadata = [
    { label: "Тип", value: animeMeta?.type },
    { label: "Эпизоды", value: animeMeta?.episodes },
    { label: "Длительность", value: animeMeta?.episode_duration },
    { label: "Формат", value: animeMeta?.format },
  ];

  const statusOptions = [
    { value: "Смотрю", icon: <Check size={18} />, color: "#34d399" },
    { value: "Просмотрено", icon: <CheckCheck size={18} />, color: "#60a5fa" },
    { value: "В планах", icon: <Clock size={18} />, color: "#a78bfa" },
    { value: "Отложено", icon: <Pause size={18} />, color: "#fbbf24" },
    { value: "Брошено", icon: <X size={18} />, color: "#f87171" },
  ];

  const currentStatus = statusOptions.find(option => option.value === selectedStatus);

  if (metaError || popularAnimeError || commentsError) return <div>Error</div>;
  if (!animeMeta || !popularAnime || !comments) return <Loader />;

  const rawDescription = animeMeta.description?.replace(descriptionRegex, "") || "К сожалению, к данному тайтлу отсутствует описание. ⚡️";

  return (
    <div className="anime-page-container">
      <Modal
        isOpen={showMetadataModal}
        onClose={() => setShowMetadataModal(false)}
        title="Все метаданные"
      >
        <div className="metadata-grid">
          {[...mainMetadata, ...additionalMetadata].map(
            (item, index) =>
              item.value && (
                <div className="metadata-item" key={index}>
                  <span className="metadata-label">{item.label}</span>
                  <span className="metadata-value">
                    {Array.isArray(item.value) ? item.value.join(", ") : item.value}
                  </span>
                </div>
              ),
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showDescriptionModal}
        onClose={() => setShowDescriptionModal(false)}
        title="Полное описание"
      >
        <div className="description-modal-text">
          {rawDescription}
        </div>
      </Modal>

      <div className="anime-hero-section">
        <div
          className="anime-background-blur"
          style={{ backgroundImage: `url(${animeMeta.poster_url})` }}
          aria-hidden="true"
        />

        <div className="anime-content-wrapper">
          <motion.div
            className="anime-poster-container"
            whileHover={{
              y: -4,
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.2 }
            }}
            whileTap={{
              scale: 0.98,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.1 }
            }}
            initial={{ y: 0, boxShadow: "0 2px 4px rgba(0, 0, 0, 0)" }}
            transition={{
              type: "tween",
              ease: "easeInOut",
              duration: 0.3
            }}
          >
            <img
              src={animeMeta.poster_url || "/placeholder.svg"}
              alt="Постер аниме"
              className="anime-poster-image"
              loading="lazy"
            />
          </motion.div>

          <div className="anime-info-container">
            <div className="anime-title-block">
              <div className="anime-title-wrapper">
                <h1 className="anime-main-title">{animeMeta.name_ru}</h1>
                {animeMeta.name_original && (
                  <div className="anime-original-title">{animeMeta.name_original}</div>
                )}
              </div>
              <div className="anime-rating-status-container">
                <div
                  className="anime-rating-badge"
                  style={{
                    color: animeMeta.score >= 7 ? "#2ed573" : animeMeta.score >= 5 ? "#ffa502" : "#ff4757",
                  }}
                >
                  <Star
                    size={18}
                    fill={
                      animeMeta.score >= 7 ? "#2ed573" : animeMeta.score >= 5 ? "#ffa502" : "#ff4757"
                    }
                  />
                  <span>{animeMeta.score}</span>
                  <span className="rating-count">{animeMeta.score_count} оценок</span>
                </div>
              </div>
            </div>

            <div className="anime-metadata-container">
              <div className="metadata-grid">
                {mainMetadata.map(
                  (meta, index) =>
                    meta.value && (
                      <div className="metadata-item" key={index}>
                        <span className="metadata-label">{meta.label}</span>
                        {renderMetadataValue(
                          Array.isArray(meta.value) ? meta.value : [meta.value],
                          meta.showBadge
                        )}
                      </div>
                    ),
                )}
              </div>
              <button
                className="metadata-info-button"
                onClick={() => setShowMetadataModal(true)}
                aria-label="Показать дополнительную информацию"
              >
                <Info size={20} />
              </button>
            </div>

            <div className="anime-actions-container">
              <button className="anime-watch-button">
                <img
                  src={PlayIcon || "/placeholder.svg"}
                  alt="Смотреть"
                  className="watch-button-icon"
                />
                <span>Смотреть</span>
              </button>

              <div className="status-bookmark-container">
                <div
                  className="status-select-container"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                >
                  <div className="status-select-header"
                    style={{ 
                      backgroundColor: currentStatus ? `${currentStatus.color}20` : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {currentStatus ? (
                      <>
                        {currentStatus.icon}
                        <span>{selectedStatus}</span>
                      </>
                    ) : (
                      <>
                        <img src={PlusIcon} alt="Выбрать статус" className="status-icon" />
                        <span>Выбрать статус</span>
                      </>
                    )}

                    <motion.div
                      className="arrow-container"
                      animate={{ 
                        rotate: isStatusDropdownOpen ? 180 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <ChevronDown size={18} className="select-arrow-icon" />
                    </motion.div>
                  </div>
                  {isStatusDropdownOpen && (
                    <div className="status-select-dropdown">
                      {statusOptions.map((status) => (
                        <div
                          key={status.value}
                          className="status-option"
                          onClick={() => {
                            setSelectedStatus(status.value);
                            setIsStatusDropdownOpen(false);
                          }}
                          style={{ color: status.color }}
                        >
                          {status.icon}
                          <span>{status.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <motion.button 
                  className="favorite-button"
                  onClick={() => setBookmarked(!isBookmarked)}
                  whileHover={{ 
                    scale: 1.05,
                  }}
                  whileTap={{ 
                    scale: 0.9,
                  }}
                  transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                  }}
                >
                  <motion.svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffdb8b"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transformOrigin: 'bottom center',
                      backfaceVisibility: 'hidden',
                      overflow: 'visible'
                    }}
                    animate={{
                      rotateY: isBookmarked ? 360 : 0,
                      scale: isBookmarked ? [1, 1.4, 1] : 1,
                      y: isBookmarked ? [0, -8, 0] : 0
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "anticipate"
                    }}
                  >
                    <motion.path
                      d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                      initial={false}
                      animate={{
                        fill: isBookmarked ? 
                          'rgba(255, 219, 139, 1)' : 
                          'rgba(255, 219, 139, 0)'
                      }}
                      transition={{
                        duration: 0.4,
                        delay: isBookmarked ? 0.2 : 0,
                        ease: "circInOut"
                      }}
                    />
                  </motion.svg>
                </motion.button>
              </div>
            </div>

            <div className="anime-description-section">
              <div className="description-content">
                <p className="description-text">
                  {rawDescription.length > 250 
                    ? `${rawDescription.slice(0, 250)}...` 
                    : rawDescription}
                </p>
              </div>

              {rawDescription.length > 250 && (
                <button
                  className="description-toggle-button"
                  onClick={() => setShowDescriptionModal(true)}
                >
                  Подробнее
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'series' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('series')}
          >
            Серии
          </button>
          <button 
            className={`tab-button ${activeTab === 'similar' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('similar')}
          >
            Похожие
          </button>
          <button 
            className={`tab-button ${activeTab === 'comments' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            Комментарии
          </button>
        </div>

        <div className="tabs-content">
          {activeTab === 'series' && (
            <div className="episodes-grid">
              {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="episode-card"
                  whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="episode-content">
                    <div className="episode-number-badge">#{i + 1}</div>
                    <button className="play-button">
                      <img 
                        src={PlayIcon} 
                        alt="Play" 
                        className="play-icon" 
                      />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'similar' && (
            <AnimeList animes={popularAnime} name="Похожие тайтлы" />
          )}

          {activeTab === 'comments' && (
            <section className="comments-section">
              <h2 className="section-title">Комментарии</h2>
              {cookie.access_token ? (
                <CommentField sendComment={handleCommentSubmit} />
              ) : (
                <div className="auth-warning">Для написания комментариев требуется авторизация</div>
              )}
              <div className="comments-list">
                {comments.results?.map((obj) => (
                  <Comment key={obj.id} userId={obj.user} text={obj.content} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Anime;