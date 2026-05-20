import React, { useRef, useEffect } from 'react';
import { PlayerControls } from './PlayerControls';
import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import { AlertCircle, Loader2 } from 'lucide-react';

interface CustomPlayerProps {
  id: string;
}

export const CustomPlayer: React.FC<CustomPlayerProps> = ({ id }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
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
  } = useVideoPlayer({
    videoElement: videoRef,
    containerElement: containerRef,
  });

  // Construct direct download stream link for GDrive.
  // Note: Only works optimally if file is public and under virus scan size limit (100MB).
  // Otherwise, GDrive may redirect to a warning page, which causes playback failure.
  const videoSrc = `https://drive.google.com/uc?export=download&id=${id}`;

  const handleError = () => {
    setIsLoading(false);
    setError(
      "Failed to load video stream. The video might be private, deleted, or too large (Google Drive virus scan block)."
    );
  };

  let hoverTimeout: NodeJS.Timeout;
  const handleMouseMove = () => {
    setIsHovering(true);
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      if (isPlaying) {
        setIsHovering(false);
      }
    }, 2500);
  };

  useEffect(() => {
    return () => clearTimeout(hoverTimeout);
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setIsHovering(false)}
      className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center group"
    >
      {/* Loading state */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 pointer-events-none bg-black/40">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
          <p className="text-sm tracking-widest text-neutral-300 animate-pulse">BUFFERING...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-neutral-900/90 p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-bold mb-2">Playback Error</h3>
          <p className="text-sm text-neutral-400 max-w-md">{error}</p>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleOnTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
      />

      {/* Custom Controls Overlay */}
      <PlayerControls
        isPlaying={isPlaying}
        progress={progress}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        playbackRate={playbackRate}
        isFullscreen={isFullscreen}
        isHovering={isHovering}
        togglePlay={togglePlay}
        handleVideoProgress={handleVideoProgress}
        handleVideoVolume={handleVideoVolume}
        toggleMute={toggleMute}
        changePlaybackRate={changePlaybackRate}
        toggleFullscreen={toggleFullscreen}
      />
    </div>
  );
};
