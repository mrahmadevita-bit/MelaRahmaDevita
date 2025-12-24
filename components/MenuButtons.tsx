import React from 'react';
import { Clock, Scale, Lock, Play } from 'lucide-react';

interface Props {
  isNight: boolean;
  onTimeAdventureClick: () => void;
  onWeightAdventureClick: () => void;
}

const MenuButtons: React.FC<Props> = ({ isNight, onTimeAdventureClick, onWeightAdventureClick }) => {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-[5%] sm:right-[10%] z-30 flex flex-col gap-8 items-center pointer-events-auto">
      
      {/* Time Adventure Button */}
      <div className="relative group perspective-1000">
        <button 
          onClick={onTimeAdventureClick}
          className="relative w-80 sm:w-96 h-32 sm:h-36 bg-gradient-to-b from-amber-100 to-amber-200 rounded-[2rem] border-[6px] border-amber-300 shadow-[0_10px_0_#d97706,0_20px_25px_rgba(0,0,0,0.3)] flex items-center p-5 gap-6 overflow-hidden transition-transform transform group-hover:-translate-y-1 active:translate-y-2 active:shadow-none cursor-pointer"
        >
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 to-transparent" />
          <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center border-b-[6px] border-blue-800 shadow-inner group-hover:scale-110 transition-transform duration-300">
             <Clock size={48} className="text-white drop-shadow-md" />
             <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-2xl" />
          </div>
          <div className="text-left relative z-10 flex-1">
            <h3 className="font-fredoka font-extrabold text-3xl text-amber-900 drop-shadow-sm leading-none mb-2">
              Petualangan<br/>Waktu
            </h3>
            <div className="flex items-center gap-2 bg-green-500/20 py-1 px-3 rounded-full w-fit border border-green-500/30">
               <Play size={14} className="text-green-700 fill-green-700" />
               <span className="text-sm font-baloo font-bold text-green-800 uppercase tracking-wide">Mulai!</span>
            </div>
          </div>
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/30 rotate-45 blur-xl pointer-events-none" />
        </button>
      </div>

      {/* Weight Adventure Button - UNLOCKED */}
      <div className="relative group perspective-1000">
        <button 
          onClick={onWeightAdventureClick}
          className="relative w-80 sm:w-96 h-32 sm:h-36 bg-gradient-to-b from-stone-100 to-stone-300 rounded-[2rem] border-[6px] border-stone-400 shadow-[0_10px_0_#78716c,0_20px_25px_rgba(0,0,0,0.3)] flex items-center p-5 gap-6 overflow-hidden transition-transform transform group-hover:-translate-y-1 active:translate-y-2 active:shadow-none"
        >
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-900/20 to-transparent" />
          <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-3xl flex items-center justify-center border-b-[6px] border-red-800 shadow-inner group-hover:scale-110 transition-transform duration-300">
             <Scale size={48} className="text-white drop-shadow-md" />
             <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-2xl" />
          </div>

          <div className="text-left relative z-10 flex-1">
            <h3 className="font-fredoka font-extrabold text-3xl text-stone-800 drop-shadow-sm leading-none mb-2">
              Petualangan<br/>Berat
            </h3>
            <div className="flex items-center gap-2 bg-green-500/20 py-1 px-3 rounded-full w-fit border border-green-500/30">
               <Play size={14} className="text-green-700 fill-green-700" />
               <span className="text-sm font-baloo font-bold text-green-800 uppercase tracking-wide">Mulai!</span>
            </div>
          </div>
          
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/30 rotate-45 blur-xl pointer-events-none" />
        </button>
      </div>

    </div>
  );
};

export default MenuButtons;
