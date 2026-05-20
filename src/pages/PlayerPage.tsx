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
    <div className="min-h-screen bg-neutral-950 flex flex-col bg-dotted-grid relative">
      <div className="absolute inset-0 bg-neutral-950/80 z-0 pointer-events-none" />
      
      {/* Header */}
      <header className="p-4 relative z-10 flex items-center space-x-6 border-b border-neutral-800">
        <Link 
          to="/" 
          className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors text-white focus:outline-none"
          title="Back to Home"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">GDrive Streamer</h1>
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mt-1">
            ID: {videoId}
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 relative z-10">
        <div className="w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl shadow-blue-500/5 ring-1 ring-neutral-800/50 bg-black">
          <CustomPlayer id={videoId} />
        </div>
        
        <div className="mt-8 max-w-4xl text-center">
           <p className="text-sm text-neutral-500">
              Note: This player uses direct stream links. Google Drive videos must be public. 
              Videos over 100MB may fail to load if Google enforces a virus scan warning.
           </p>
        </div>
      </main>
    </div>
  );
};
