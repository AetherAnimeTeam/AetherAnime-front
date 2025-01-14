import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import classes from "./VideoPlayer.module.css";
import {ReactComponent as FullscreenIcon} from "../../assets/icons/fullscren.svg";
import {ReactComponent as PlayIcon} from "../../assets/icons/play.svg";
import {ReactComponent as LeftArrowIcon} from "../../assets/icons/left_arrow.svg";
import {ReactComponent as RightArrowIcon} from "../../assets/icons/right_arrow.svg";
import {ReactComponent as MutedIcon} from "../../assets/icons/muted.svg";
import {ReactComponent as NormalscreenIcon} from "../../assets/icons/normalscreen.svg";
import ProgressBar from "../ProgressBar/ProgressBar";

const VideoPlayer = () => {
    const containerRef = useRef(null);
    const playerRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const videoLink = "/testvideo.mp4"

    const togglePlay = () => setPlaying(!playing);
    const toggleMute = () => setMuted(!muted);
    const handleProgress = (state) => setProgress(state.played);
    const handleVolumeChange = (e) => setVolume(parseFloat(e));
    const handleDuration = (duration) => setDuration(duration);
    console.log(progress)
    const handleAcceleration = (acceleration) => {
        let newProgress = (playerRef.current.getCurrentTime() + acceleration) / duration;
        if(newProgress < 0) newProgress = 0;
        setProgress(newProgress);
        playerRef.current.seekTo(newProgress);
    }

    const handleSeekChange = (e) => {
        const newProgress = parseFloat(e);
        setProgress(newProgress);
        playerRef.current.seekTo(newProgress);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleSpeedChange = (e) => {
        const newSpeed = parseFloat(e.target.value);
        setSpeed(newSpeed);
        playerRef.current.getInternalPlayer().playbackRate = newSpeed;
    };

    const toggleFullScreen = () => {
        if (containerRef.current && screenfull.isEnabled)
            screenfull.request(containerRef.current);
        screenfull.exit()
    };

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullScreen(screenfull.isFullscreen);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div className={classes.playerContainer} ref={containerRef}
             style={{ width: isFullScreen ? "100%": "59.32vw",
                 height: isFullScreen ? "100vh": "33.33vw",
                 margin: isFullScreen ? "0": "auto",
                 borderRadius: isFullScreen ? "0": "0.83vw" }}>
            <div onClick={togglePlay} >
                <ReactPlayer
                    ref={playerRef}
                    url={videoLink}
                    playing={playing}
                    muted={muted}
                    volume={volume}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onEnded={() => setProgress(0)}
                    width="100%"
                    height="100%"
                />
            </div>
            <div className={classes.controlPanel}>
                <div>
                    <ProgressBar
                        min={0}
                        max={1}
                        step={0.01}
                        value={progress}
                        onChange={handleSeekChange}/>
                    <div className={classes.controlElements}>
                        <div className={classes.elementsBlock}>
                            {playing ? <PlayIcon className={classes.controlElement} onClick={togglePlay}/> :
                                <PlayIcon className={classes.controlElement} onClick={togglePlay}/>}

                            <RightArrowIcon className={classes.controlElement} onClick={() => handleAcceleration(-10)}/>
                            <LeftArrowIcon className={classes.controlElement} onClick={() => handleAcceleration(10)}/>

                            {muted ? <MutedIcon className={classes.controlElement} onClick={() =>setMuted(false)}/> :
                                <MutedIcon className={classes.controlElement} onClick={() => setMuted(true)}/> }

                            <p className={classes.duration}>{formatTime(progress * duration)} / {formatTime(duration)}</p>
                        </div>
                        <div className={classes.elementsBlock}>
                            {isFullScreen ? <NormalscreenIcon className={classes.controlElement} onClick={toggleFullScreen}/> :
                                <FullscreenIcon className={classes.controlElement} onClick={toggleFullScreen}/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;