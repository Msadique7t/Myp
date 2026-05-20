import { useState, useEffect, RefObject } from 'react';

interface UseVideoPlayerProps {
  videoElement: RefObject<HTMLVideoElement | null>;
  containerElement: RefObject<HTMLDivElement | null>;
}

export const useVideoPlayer = ({ videoElement, containerElement }: UseVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Play / Pause toggle
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Synchronize playing state with actual video element
  useEffect(() => {
    if (!videoElement.current) return;
    
    // Ignore error if play() is interrupted
    if (isPlaying) {
      videoElement.current.play().catch(e => {
        console.warn("Autoplay/Play prevented:", e);
        setIsPlaying(false);
      });
    } else {
      videoElement.current.pause();
    }
  }, [isPlaying, videoElement]);

  // Handle Time Update
  const handleOnTimeUpdate = () => {
    if (!videoElement.current) return;
    const current = videoElement.current.currentTime;
    const total = videoElement.current.duration;
    
    setCurrentTime(current);
    if (total) {
      setProgress((current / total) * 100);
    }
  };

  // Seek
  const handleVideoProgress = (newProgress: number) => {
    if (!videoElement.current) return;
    const newTime = (videoElement.current.duration / 100) * newProgress;
    videoElement.current.currentTime = newTime;
    setProgress(newProgress);
  };

  // Handle Loaded Metadata
  const handleLoadedMetadata = () => {
    if (!videoElement.current) return;
    setDuration(videoElement.current.duration);
    setIsLoading(false);
  };

  // Volume
  const handleVideoVolume = (value: number) => {
    if (!videoElement.current) return;
    videoElement.current.volume = value;
    setVolume(value);
    if (value === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // Mute toggle
  const toggleMute = () => {
    if (!videoElement.current) return;
    const muted = !isMuted;
    setIsMuted(muted);
    videoElement.current.muted = muted;
    if (muted) {
      videoElement.current.volume = 0;
      setVolume(0);
    } else {
      videoElement.current.volume = 1;
      setVolume(1);
    }
  };

  // Pre-configured playback rates
  const changePlaybackRate = (rate: number) => {
    if (!videoElement.current) return;
    videoElement.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerElement.current) return;
    
    if (!document.fullscreenElement) {
      containerElement.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Event listener for external fullscreen changes (like ESC key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return {
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    isFullscreen,
    isHovering,
    isLoading,
    error,
    
    setIsHovering,
    setIsLoading,
    setError,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleLoadedMetadata,
    handleVideoVolume,
    toggleMute,
    changePlaybackRate,
    toggleFullscreen,
  };
};
