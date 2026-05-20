import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CustomPlayer } from '../components/player/CustomPlayer';
import { ArrowLeft } from 'lucide-react';

export const PlayerPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();

  if (!videoId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <p>No Video ID provided.</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-neutral-950 flex flex-col bg-dotted-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-neutral-950/80 z-0 pointer-events-none" />
      
      {/* Header */}
      <header className="px-4 py-3 relative z-10 flex items-center space-x-4 border-b border-neutral-800 shrink-0 bg-neutral-950">
        <Link 
          to="/" 
          className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors text-white focus:outline-none"
          title="Back to Home"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-white tracking-tight truncate">GDrive Streamer</h1>
          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5 truncate">
            ID: {videoId}
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10 flex flex-col p-2 md:p-4 lg:p-6">
        <div className="flex-1 w-full bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-neutral-800 flex flex-col">
          <CustomPlayer id={videoId} />
        </div>
      </main>
    </div>
  );
};
