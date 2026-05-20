import React, { useRef, useEffect, useState } from 'react';
import { PlayerControls } from './PlayerControls';
import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import { AlertCircle, Loader2, Key } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

interface CustomPlayerProps {
  id: string;
}

export const CustomPlayer: React.FC<CustomPlayerProps> = ({ id }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [apiError, setApiError] = useState<string | null>(null);
  const [oauthToken, setOauthToken] = useState<string | null>(null);

  const {
    isPlaying, progress, currentTime, duration, volume, isMuted, playbackRate,
    isFullscreen, isHovering, isLoading, error,
    setIsHovering, setIsLoading, setError, togglePlay, handleOnTimeUpdate,
    handleVideoProgress, handleLoadedMetadata, handleVideoVolume, toggleMute,
    changePlaybackRate, toggleFullscreen
  } = useVideoPlayer({ videoElement: videoRef, containerElement: containerRef });

  const API_KEY = "AIzaSyCtYjaL1xP_3AKt6qvvamDmoXQeCPozWEk";
  const CLIENT_ID = "228985320176-et0vchdg77mdvv8f6477llt60342ud0q.apps.googleusercontent.com";

  useEffect(() => {
    const scriptId = 'google-gsi-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const authParam = oauthToken ? `access_token=${oauthToken}` : `key=${API_KEY}`;
  const videoSrc = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&${authParam}`;

  useEffect(() => {
    if (videoRef.current) {
      setApiError(null);
      setError(null);
      setIsLoading(true);
      videoRef.current.load();
    }
  }, [videoSrc, id, setError, setIsLoading]);

  const handleError = async () => {
    setIsLoading(false);
    setError(null);
    setApiError("Checking stream permissions...");
    
    try {
      // Attempt to ping the endpoint to get the exact Google REST JSON error
      // Use 0-1 range to avoid downloading full video if successful
      const res = await fetch(videoSrc, { method: 'GET', headers: { Range: 'bytes=0-1' } });
      if (!res.ok) {
        let msg = `HTTP Error ${res.status}`;
        try {
          const data = await res.json();
          msg = data.error?.message || msg;
        } catch (e) {
          // not json
        }
        setApiError(msg);
      } else {
        setApiError("Browser failed to decode video stream format, or stream was abruptly closed.");
      }
    } catch (err: any) {
      setApiError("Network CORS Error. The video might be private, or the API key restricts this domain.");
    }
  };

  const handleOAuthLogin = () => {
    if (!window.google) {
      alert("Google Identity script is still loading. Please try again in a moment.");
      return;
    }
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      callback: (tokenResponse: any) => {
        if (tokenResponse && tokenResponse.access_token) {
          setOauthToken(tokenResponse.access_token);
        }
      },
    });
    client.requestAccessToken();
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
      className="relative w-full h-full bg-black overflow-hidden flex flex-col group"
    >
      {isLoading && !apiError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 pointer-events-none bg-neutral-900 border border-neutral-800">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
          <p className="text-sm tracking-widest text-neutral-400 animate-pulse">LOADING STREAM...</p>
        </div>
      )}

      {apiError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-neutral-900/95 p-6 text-center shadow-xl">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-bold mb-2 tracking-tight">Stream Access Error</h3>
          <p className="text-sm text-neutral-400 max-w-md mb-6">{apiError}</p>
          
          <button 
            onClick={handleOAuthLogin}
            className="flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 transition-colors px-6 py-2.5 rounded-md font-semibold mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ring-offset-2 ring-offset-neutral-900 cursor-pointer pointer-events-auto"
          >
            <Key size={18} />
            <span>Sign in with Google</span>
          </button>
          
          <p className="text-xs text-neutral-500 max-w-sm font-mono">
            If the media is restricted, authentication is required to bypass standard drive policies.
          </p>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full flex-1 border-none outline-none object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleOnTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onPlaying={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        playsInline
      />

      <PlayerControls
        isPlaying={isPlaying} progress={progress} currentTime={currentTime}
        duration={duration} volume={volume} isMuted={isMuted} playbackRate={playbackRate}
        isFullscreen={isFullscreen} isHovering={isHovering} togglePlay={togglePlay}
        handleVideoProgress={handleVideoProgress} handleVideoVolume={handleVideoVolume}
        toggleMute={toggleMute} changePlaybackRate={changePlaybackRate} toggleFullscreen={toggleFullscreen}
      />
    </div>
  );
};

