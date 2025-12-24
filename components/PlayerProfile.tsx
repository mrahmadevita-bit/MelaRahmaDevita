import React, { useState, useRef, useEffect } from 'react';
import { PlayerProfile as PlayerProfileType } from '../types';
import { AVATAR_OPTIONS } from '../constants';
import { Edit2, Check } from 'lucide-react';

interface Props {
  profile: PlayerProfileType;
  onUpdateName: (name: string) => void;
  onAvatarClick: () => void;
}

const PlayerProfile: React.FC<Props> = ({ profile, onUpdateName, onAvatarClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const avatarConfig = AVATAR_OPTIONS.find(a => a.id === profile.avatar) || AVATAR_OPTIONS[0];

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateName(tempName);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveName();
  };

  return (
    <div className="absolute top-6 left-6 z-40 flex items-center gap-5 animate-pop">
      {/* Avatar Frame: Gold Border, RPG Style */}
      <button 
        onClick={onAvatarClick}
        className="relative group cursor-pointer transition-transform hover:scale-105 active:scale-95"
      >
        <div className="relative z-10 w-28 h-28 rounded-full border-[6px] border-yellow-400 bg-gradient-to-b from-slate-100 to-slate-300 shadow-[0_4px_0_rgba(180,83,9,1),0_10px_20px_rgba(0,0,0,0.3)] overflow-hidden flex items-center justify-center">
          {/* Inner Glow */}
          <div className="absolute inset-0 rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.1)] pointer-events-none" />
          <span className="text-7xl drop-shadow-md filter contrast-125">
            {avatarConfig.emoji}
          </span>
        </div>
      </button>

      {/* Name & XP Cluster */}
      <div className="flex flex-col items-start gap-1">
        
        {/* Name Tag */}
        <div className="relative">
           <div className="flex items-center gap-3">
            {isEditing ? (
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={handleKeyDown}
                  className="bg-black/20 backdrop-blur-md rounded-lg px-2 py-1 border-2 border-yellow-400 text-white font-fredoka font-bold text-2xl outline-none shadow-inner w-40"
                  maxLength={12}
                />
                <button onMouseDown={handleSaveName} className="ml-2 bg-green-500 text-white rounded-full p-2 shadow-md hover:bg-green-600">
                  <Check size={20} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Text Shadow / Stroke effect simulation using drop-shadows */}
                <h1 className="font-fredoka font-extrabold text-4xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-500 drop-shadow-[0_2px_0_rgba(146,64,14,1)] filter">
                  {profile.name}
                </h1>
                
                {/* Prominent Edit Pencil */}
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all shadow-sm group animate-pulse hover:animate-none"
                >
                  <Edit2 size={20} className="text-white drop-shadow-md" strokeWidth={2.5} />
                </button>
              </div>
            )}
           </div>
        </div>
        
        {/* XP Bar Container */}
        <div className="flex flex-col w-48 mt-1">
           <div className="flex justify-between items-end px-1 mb-0.5">
             <span className="text-xs font-black text-yellow-100 tracking-wider drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">LEVEL 1</span>
             <span className="text-xs font-bold text-yellow-200 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">0/100</span>
           </div>
           <div className="w-full h-5 bg-black/40 rounded-full border-2 border-slate-600/50 backdrop-blur-sm shadow-inner relative overflow-hidden">
             {/* Fill */}
             <div className="h-full w-[45%] bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] relative">
                {/* Gloss/Shine */}
                <div className="absolute top-0 left-0 w-full h-[40%] bg-white/40 rounded-t-full" />
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PlayerProfile;
