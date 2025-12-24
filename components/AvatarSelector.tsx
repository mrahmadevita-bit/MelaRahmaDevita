import React from 'react';
import { AvatarType } from '../types';
import { AVATAR_OPTIONS } from '../constants';
import { X } from 'lucide-react';

interface AvatarSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatar: AvatarType) => void;
  currentAvatar: AvatarType;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ isOpen, onClose, onSelect, currentAvatar }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-pop">
      <div className="bg-white rounded-3xl p-6 w-[90%] max-w-md shadow-2xl border-4 border-yellow-400 relative">
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors border-2 border-white"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <h2 className="text-2xl font-fredoka font-bold text-center text-slate-700 mb-6">
          Pilih Temanmu!
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {AVATAR_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSelect(option.id);
                onClose();
              }}
              className={`
                group relative p-4 rounded-2xl border-b-4 transition-all duration-200 active:border-b-0 active:translate-y-1 flex flex-col items-center gap-2
                ${currentAvatar === option.id 
                  ? 'bg-yellow-100 border-yellow-400 ring-4 ring-yellow-200' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }
              `}
            >
              <div className={`text-5xl p-4 rounded-full ${option.colors} shadow-inner`}>
                {option.emoji}
              </div>
              <span className="font-baloo font-bold text-lg text-slate-700">
                {option.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
