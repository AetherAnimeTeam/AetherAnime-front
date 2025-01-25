import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ErrorBlock.css';
import AnimeGirlCrying from '../../assets/gif/anime-girl-crying.gif';

const ErrorBlock = ({ 
    message, 
    buttonText, 
    onButtonClick, 
    isLoading = false,
    children 
}) => {
    const [attempt, setAttempt] = useState(0);
    const [maxAttempts] = useState(3);
    const [forceLoading, setForceLoading] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [attemptMessage, setAttemptMessage] = useState('');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => document.body.style.overflow = 'auto';
    }, []);

    useEffect(() => {
        let timer;
        if (isLoading) {
            setForceLoading(true);
            timer = setTimeout(() => {
                if (attempt < maxAttempts) {
                    setAttempt(prev => prev + 1);
                }
            }, 3000);
        } else {
            setAttempt(0);
            timer = setTimeout(() => setForceLoading(false), 1000);
        }
        return () => clearTimeout(timer);
    }, [isLoading, attempt]);

    useEffect(() => {
        if (attempt > 0 && attempt <= maxAttempts) {
            setAttemptMessage(`Попытка подключения ${attempt}/${maxAttempts}...`);
        }
    }, [attempt]);

    const handleClick = () => {
        if (!isLoading && attempt < maxAttempts) {
            setIsShaking(false);
            onButtonClick();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="error-overlay"
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
                exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                transition={{ 
                    duration: 0.4,
                    ease: [0.33, 1, 0.68, 1]
                }}
            >
                <motion.div
                    className="error-card"
                    initial={{ scale: 0.95, y: 20, opacity: 0 }}
                    animate={{ 
                        scale: 1,
                        y: 0,
                        opacity: 1,
                        x: isShaking ? [0, -8, 6, -6, 4, 0] : 0,
                        rotate: isShaking ? [0, -3, 2, -2, 1, 0] : 0
                    }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onAnimationComplete={() => attempt >= maxAttempts && setIsShaking(true)}
                    transition={{ 
                        type: 'spring',
                        stiffness: 300,
                        damping: 15,
                        mass: 0.5
                    }}
                >
                    <div className="content-wrapper">
                        <motion.p 
                            className="error-message"
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {attempt >= maxAttempts 
                                ? 'Не удалось подключиться 😢' 
                                : message}
                            <div className="attempt-message">
                                {attemptMessage}
                            </div>
                        </motion.p>

                        <div className="media-container">
                            <img 
                                src={AnimeGirlCrying} 
                                alt="Ошибка загрузки" 
                                className="error-visual"
                            />
                            <div className="sparkles">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="sparkle" />
                                ))}
                            </div>
                        </div>
                        
                        <motion.div 
                            className="action-container"
                            layout
                            transition={{ 
                                duration: 0.3,
                                ease: 'easeInOut'
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {(isLoading || forceLoading) ? (
                                    <motion.div
                                        key="loader"
                                        initial={{ opacity: 0, scaleY: 0.5 }}
                                        animate={{ opacity: 1, scaleY: 1 }}
                                        exit={{ opacity: 0, scaleY: 0.4 }}
                                        transition={{ 
                                            duration: 0.25,
                                            ease: 'easeInOut'
                                        }}
                                        className="progress-indicator"
                                    >
                                        <div className="loader-track" />
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        key="button"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ 
                                            duration: 0.25,
                                            ease: 'easeInOut'
                                        }}
                                        className="retry-button"
                                        onClick={handleClick}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={attempt >= maxAttempts}
                                    >
                                        {attempt >= maxAttempts 
                                            ? 'Попытки исчерпаны' 
                                            : buttonText}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ErrorBlock;