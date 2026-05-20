import React from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings } from 'lucide-react';
import { formatTime } from '../../lib/formatTime';
import { cn } from '../../lib/utils';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface PlayerControlsProps {
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isHovering: boolean;
  togglePlay: () => void;
  handleVideoProgress: (value: number) => void;
  handleVideoVolume: (value: number) => void;
  toggleMute: () => void;
  changePlaybackRate: (rate: number) => void;
  toggleFullscreen: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  progress,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackRate,
  isFullscreen,
  isHovering,
  togglePlay,
  handleVideoProgress,
  handleVideoVolume,
  toggleMute,
  changePlaybackRate,
  toggleFullscreen,
}) => {
  return (
    <div 
      className={cn(
        "absolute inset-0 flex flex-col justify-end transition-opacity duration-300 pointer-events-none",
        isHovering || !isPlaying ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Dark gradient overlay at bottom for visibility */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent z-0" />

      {/* Controls Container */}
      <div className="relative z-10 px-4 pb-4 pt-2 pointer-events-auto">
        
        {/* Progress Bar */}
        <div className="w-full flex items-center mb-2 group cursor-pointer relative h-3"
             onPointerDown={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const handleMove = (moveEvent: PointerEvent) => {
                 let percentage = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                 handleVideoProgress(Math.max(0, Math.min(100, percentage)));
               };
               
               const handleUp = () => {
                 window.removeEventListener('pointermove', handleMove);
                 window.removeEventListener('pointerup', handleUp);
               };
               
               window.addEventListener('pointermove', handleMove);
               window.addEventListener('pointerup', handleUp);
               
               // Initial click update
               handleMove(e as unknown as PointerEvent);
             }}
        >
          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden group-hover:h-1.5 transition-all">
            <div 
              className="h-full bg-blue-500 relative"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Thumb */}
          <div 
             className="absolute h-3 w-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1/2 -translate-y-1/2 top-1/2 shadow"
             style={{ left: `${progress}%` }}
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-white">
            <button 
              onClick={togglePlay} 
              className="hover:text-blue-400 transition-colors focus:outline-none"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group">
              <button onClick={toggleMute} className="hover:text-blue-400 focus:outline-none">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVideoVolume(parseFloat(e.target.value))}
                className="w-0 scale-x-0 opacity-0 group-hover:opacity-100 group-hover:w-20 group-hover:scale-x-100 origin-left transition-all duration-300 accent-blue-500 h-1.5 cursor-pointer"
              />
            </div>

            {/* Time display */}
            <div className="text-xs font-mono select-none tracking-wide">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-4 text-white">
            {/* Settings (Playback Rate) */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="hover:text-blue-400 focus:outline-none p-1">
                  <Settings size={20} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content 
                  className="min-w-[120px] bg-neutral-900 border border-neutral-700 text-white rounded-md p-1 shadow-xl text-sm font-medium z-50 mb-2"
                  sideOffset={8}
                >
                  <DropdownMenu.Label className="px-2 py-1.5 text-xs text-neutral-400 font-semibold uppercase tracking-wider">Playback Speed</DropdownMenu.Label>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <DropdownMenu.Item
                      key={rate}
                      className="px-2 py-1.5 flex items-center cursor-pointer hover:bg-white/10 rounded-sm focus:outline-none"
                      onClick={() => changePlaybackRate(rate)}
                    >
                      <span className="flex-1">{rate}x</span>
                      {playbackRate === rate && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Fullscreen Toggle */}
            <button 
              onClick={toggleFullscreen} 
              className="hover:text-blue-400 transition-colors focus:outline-none p-1"
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
