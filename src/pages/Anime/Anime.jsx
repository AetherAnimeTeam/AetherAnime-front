import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { getDetailed, getPopular } from "../../API/AnimeService";
import { fetcher } from "../../API/Base";
import { useCookies } from "react-cookie";
import { getComments, sendComment } from "../../API/CommentService";
import { Star, ChevronDown, Info, Eye, Check, Clock, Pause, X } from "lucide-react";
import AnimeList from "../../components/AnimeList/AnimeList";
import CommentField from "../../components/CommentField/CommentField";
import Comment from "../../components/UI/Comment/Comment";
import Loader from "../../components/Loader/Loader";
import { motion, AnimatePresence } from "framer-motion";
import "./Anime.css";
import PlayIcon from "../../assets/icons/play.svg";
import BookmarkIcon from "../../assets/icons/bookmark.svg";
import PlusIcon from "../../assets/icons/plus.svg";

const Anime = () => {
  const params = useParams();
  const [cookie] = useCookies(["access_token"]);
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const descriptionRegex = /(\[character=\d+]|\[\/character])/g;
  const popularKey = useMemo(() => getPopular(25, 1), []);
  const { data: popularAnime, error: popularAnimeError } = useSWR(popularKey, fetcher);

  const ageRatingDict = { g: "0+", pg: "0+", pg_13: "13+", r: "17+", nc_17: "18+" };
  const statusDict = { released: "Вышел", ongoing: "Выходит", anons: "Анонс" };

  const animeKey = useMemo(() => getDetailed(params["id"]), [params]);
  const commentsKey = useMemo(() => getComments(params["id"]), [params]);

  const { data: animeMeta, error: metaError } = useSWR(animeKey, fetcher);
  const { data: comments, error: commentsError, mutate: commentsMutate } = useSWR(commentsKey, fetcher);

  const handleCommentSubmit = async (text) => {
    await sendComment(params["id"], text, cookie.access_token);
    await commentsMutate();
  };

  const mainMetadata = [
    { label: "Жанры", value: animeMeta?.genres?.map((item) => item.name) },
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

  const renderMetadataValue = (items, maxVisible = 2) => {
    if (!items || items.length === 0) return "Не указано";
    return items.slice(0, maxVisible).join(", ");
  };

  const statusOptions = [
    { value: "Смотрю", icon: <Eye size={18} />, color: "#2ed573" },
    { value: "Просмотрено", icon: <Check size={18} />, color: "#70a5ff" },
    { value: "В планах", icon: <Clock size={18} />, color: "#a855f7" },
    { value: "Отложено", icon: <Pause size={18} />, color: "#eab308" },
    { value: "Брошено", icon: <X size={18} />, color: "#ff4757" },
  ];

  const currentStatus = statusOptions.find(option => option.value === selectedStatus);

  if (metaError || popularAnimeError || commentsError) return <div>Error</div>;
  if (!animeMeta || !popularAnime || !comments) return <Loader />;

  const rawDescription = animeMeta.description?.replace(descriptionRegex, "") || "Описание отсутствует!";

  return (
    <div className="anime-page-container">
      <AnimatePresence>
        {showMetadataModal && (
          <motion.div
            className="metadata-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMetadataModal(false)}
          >
            <motion.div
              className="metadata-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="metadata-modal-close"
                onClick={() => setShowMetadataModal(false)}
                aria-label="Закрыть модальное окно"
              >
                &times;
              </button>
              <h3 className="metadata-modal-title">Все метаданные</h3>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

                {animeMeta.status && (
                  <div className="anime-status-badge">{statusDict[animeMeta.status]}</div>
                )}
              </div>
            </div>

            <div className="anime-metadata-container">
              <div className="metadata-grid">
                {mainMetadata.map(
                  (meta, index) =>
                    meta.value && (
                      <div className="metadata-item" key={index}>
                        <span className="metadata-label">{meta.label}</span>
                        <span className="metadata-value">
                          {renderMetadataValue(Array.isArray(meta.value) ? meta.value : [meta.value])}
                        </span>
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
											borderColor: currentStatus?.color || 'rgba(255, 255, 255, 0.1)',
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
												blur: { duration: 0.2 }
											}}
											style={{ originY: 0.5 }}
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

                <button className="favorite-button">
                  <img
                    src={BookmarkIcon}
                    alt="Добавить в избранное"
                    className="favorite-button-icon"
                  />
                </button>
              </div>
            </div>

            <div className="anime-description-section">
              <motion.div
                className="description-content"
                initial={false}
                animate={{ 
                  maxHeight: isDescriptionExpanded ? "1000px" : "100px",
                  transition: { duration: 0.3 } 
                }}
              >
                <p className="description-text">{rawDescription}</p>
              </motion.div>
              
              {rawDescription.length > 150 && (
                <button
                  className="description-toggle-button"
                  onClick={() => setDescriptionExpanded(!isDescriptionExpanded)}
                >
                  {isDescriptionExpanded ? "Свернуть" : "Развернуть"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimeList animes={popularAnime} name="Похожие тайтлы" />

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
    </div>
  );
};

export default Anime;