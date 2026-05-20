import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface CustomPlayerProps {
  id: string;
}

export const CustomPlayer: React.FC<CustomPlayerProps> = ({ id }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full bg-black overflow-hidden pt-[56.25%]">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 pointer-events-none bg-neutral-900 border border-neutral-800">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
          <p className="text-sm tracking-widest text-neutral-400 animate-pulse">LOADING PLAYER...</p>
        </div>
      )}
      <iframe
        src={`https://drive.google.com/file/d/${id}/preview`}
        className="absolute top-0 left-0 w-full h-full border-0 z-20"
        allow="autoplay; fullscreen"
        onLoad={() => setIsLoading(false)}
      ></iframe>
    </div>
  );
};

