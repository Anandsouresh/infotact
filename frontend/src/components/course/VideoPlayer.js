import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import './VideoPlayer.css';

const VideoPlayer = ({ videoUrl, title, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const youtubeRef = useRef(null);

  // Function to extract YouTube video ID from URL
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const isYoutubeUrl = videoUrl && getYoutubeId(videoUrl);

  useEffect(() => {
    if (!isYoutubeUrl && videoRef.current) {
      const video = videoRef.current;
      
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        
        // Mark as complete when 90% watched
        if (video.currentTime / video.duration >= 0.9) {
          onComplete && onComplete();
        }
      };

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [onComplete, isYoutubeUrl]);

  const togglePlay = () => {
    if (isYoutubeUrl) {
      if (isPlaying) {
        youtubeRef.current?.pauseVideo();
      } else {
        youtubeRef.current?.playVideo();
      }
    } else if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleProgress = (e) => {
    const time = (e.target.value / 100) * duration;
    if (isYoutubeUrl) {
      youtubeRef.current?.seekTo(time);
    } else {
      videoRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  const handleVolume = (e) => {
    const value = e.target.value / 100;
    if (isYoutubeUrl) {
      youtubeRef.current?.setVolume(value * 100);
    } else {
      videoRef.current.volume = value;
    }
    setVolume(value);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // YouTube event handlers
  const onYouTubeReady = (event) => {
    youtubeRef.current = event.target;
    setDuration(event.target.getDuration());
  };

  const onYouTubeStateChange = (event) => {
    setIsPlaying(event.data === 1);
    if (event.data === 1) { // Playing
      setCurrentTime(event.target.getCurrentTime());
      // Start progress tracking
      const progressInterval = setInterval(() => {
        setCurrentTime(event.target.getCurrentTime());
        // Check for completion
        if (event.target.getCurrentTime() / event.target.getDuration() >= 0.9) {
          onComplete && onComplete();
        }
      }, 1000);
      return () => clearInterval(progressInterval);
    }
  };

  const youtubeOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
    },
  };

  return (
    <div className="video-player" ref={playerRef}>
      <div className="video-container">
        {isYoutubeUrl ? (
          <YouTube
            videoId={getYoutubeId(videoUrl)}
            opts={youtubeOpts}
            onReady={onYouTubeReady}
            onStateChange={onYouTubeStateChange}
            className="video-element"
          />
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            onClick={togglePlay}
            className="video-element"
          />
        )}
        
        <div className="video-overlay">
          <h3 className="video-title">{title}</h3>
          
          <button className="play-button" onClick={togglePlay}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>

        <div className="video-controls">
          <div className="progress-bar">
            <input
              type="range"
              min="0"
              max="100"
              value={(currentTime / duration) * 100 || 0}
              onChange={handleProgress}
            />
            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="controls-right">
            <div className="volume-control">
              <button className="volume-button">
                {volume === 0 ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : volume < 0.5 ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 9v6h4l5 5V4L9 9H5zm11.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={handleVolume}
                className="volume-slider"
              />
            </div>

            <button className="fullscreen-button" onClick={toggleFullscreen}>
              {isFullscreen ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 