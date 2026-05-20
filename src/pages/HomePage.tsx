import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handlePlay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    let id = inputValue.trim();
    
    // Check if it's a full URL and attempt to extract ID
    if (id.includes('drive.google.com')) {
      const match = id.match(/[-\w]{25,}/);
      if (match) {
        id = match[0];
      }
    }

    navigate(`/${id}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="p-8 text-center border-b border-neutral-800/50">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-6">
             <PlayCircle className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2 font-sans">
            Stream GDrive Video
          </h1>
          <p className="text-neutral-400 text-sm">
            Enter a Google Drive Video ID or Link to play instantly via embedded player.
          </p>
        </div>

        <form onSubmit={handlePlay} className="p-8 pb-10">
          <div className="mb-6">
             <label htmlFor="driveId" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">
               Google Drive ID or Link
             </label>
             <input
               id="driveId"
               type="text"
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               placeholder="e.g. 1_1G8odwUgQYVpUwBDzsY..."
               className="w-full bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-mono text-sm transition-all shadow-inner"
               required
             />
          </div>
          <button 
            type="submit"
            className="w-full bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-[0.98]"
          >
            Play Video
          </button>
        </form>
      </div>
    </div>
  );
};
