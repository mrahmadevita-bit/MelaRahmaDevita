import React from 'react';
import { TimeOfDay } from '../types';
import { Cloud, Moon, Sun, Trees } from 'lucide-react';

interface BackgroundProps {
  timeOfDay: TimeOfDay;
  theme?: 'default' | 'garden';
}

const Background: React.FC<BackgroundProps> = ({ timeOfDay, theme = 'default' }) => {
  const getGradient = () => {
    switch (timeOfDay) {
      case 'morning':
        // Bright Blue Sky
        return 'from-sky-300 via-sky-200 to-emerald-100';
      case 'noon':
        // Intense Blue Sky
        return 'from-blue-500 via-sky-300 to-emerald-200';
      case 'afternoon':
        // Sunset / Twilight
        return 'from-purple-800 via-rose-500 to-amber-500';
      case 'night':
        // Bright Night (Not pitch black, uses indigos and dark blues)
        return 'from-indigo-900 via-purple-900 to-slate-800';
      default:
        return 'from-sky-300 to-blue-200';
    }
  };

  const getGrassColor = () => {
    switch (timeOfDay) {
      case 'morning': return 'from-green-400 via-green-500 to-green-700';
      case 'noon': return 'from-green-500 via-green-600 to-green-800';
      case 'afternoon': return 'from-amber-700 via-green-700 to-green-900';
      case 'night': return 'from-indigo-900 via-slate-700 to-slate-900';
      default: return 'from-green-500 to-green-700';
    }
  };

  const isNight = timeOfDay === 'night';
  const isNoon = timeOfDay === 'noon';
  const isSunset = timeOfDay === 'afternoon';
  
  // Sun Position Logic
  let sunPosition = '';
  if (timeOfDay === 'morning') {
    sunPosition = 'top-10 left-[10%]'; // Morning: Rising left
  } else if (timeOfDay === 'noon') {
    sunPosition = 'top-5 left-1/2 -translate-x-1/2 scale-125'; // Noon: Overhead center
  } else if (timeOfDay === 'afternoon') {
    sunPosition = 'top-[60%] left-[80%] scale-110'; // Afternoon: Setting right
  } else {
    sunPosition = 'translate-y-[150vh]'; // Night: Hidden
  }
  
  return (
    <div className={`fixed inset-0 w-full h-full bg-gradient-to-b ${getGradient()} -z-50 transition-colors duration-1000 ease-in-out`}>
      
      {/* Sun */}
      <div className={`absolute transition-all duration-1000 ease-in-out ${sunPosition}`}>
        <Sun 
          className={`w-32 h-32 ${isSunset ? 'text-orange-400 fill-orange-500' : 'text-yellow-300 fill-yellow-400'} drop-shadow-[0_0_60px_rgba(253,224,71,0.9)]`} 
        />
        {!isSunset && !isNight && (
          <div className="absolute inset-0 bg-white/30 blur-3xl rounded-full scale-150 animate-pulse" />
        )}
      </div>

      {/* Moon */}
      <div className={`absolute top-10 right-[15%] transition-transform duration-1000 ${!isNight ? '-translate-y-[150vh]' : 'translate-y-0 animate-float'}`}>
        <Moon className="w-24 h-24 text-blue-100 fill-blue-50 drop-shadow-[0_0_40px_rgba(255,255,255,0.6)]" />
      </div>

      {/* Stars - Only visible at night, brighter than before */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isNight ? 'opacity-100' : 'opacity-0'}`}>
           {[...Array(40)].map((_, i) => (
             <div 
               key={i}
               className="absolute bg-white rounded-full animate-pulse shadow-[0_0_8px_white]"
               style={{
                 top: `${Math.random() * 60}%`,
                 left: `${Math.random() * 100}%`,
                 width: `${Math.random() * 4 + 2}px`,
                 height: `${Math.random() * 4 + 2}px`,
                 animationDelay: `${Math.random() * 3}s`
               }}
             />
           ))}
      </div>

      {/* Clouds - Dynamic amount based on time */}
      <div className={`absolute top-0 left-0 w-full h-3/4 pointer-events-none transition-all duration-1000 ${isNight ? 'opacity-10' : 'opacity-90'}`}>
        
        {/* Morning Clouds */}
        <Cloud className="absolute top-16 -left-20 w-64 h-40 text-white/90 fill-white/80 animate-cloud-slow drop-shadow-xl" />
        <Cloud className="absolute top-32 w-48 h-32 text-white/70 fill-white/60 animate-cloud-fast drop-shadow-lg" style={{ animationDelay: '-10s' }} />
        
        {/* Extra Noon Clouds */}
        <div className={`transition-opacity duration-1000 ${isNoon ? 'opacity-100' : 'opacity-0'}`}>
           <Cloud className="absolute top-10 right-[40%] w-72 h-48 text-white/80 fill-white/75 animate-cloud-slow drop-shadow-2xl" style={{ animationDelay: '-5s' }} />
           <Cloud className="absolute top-48 left-[20%] w-56 h-36 text-white/60 fill-white/50 animate-cloud-fast drop-shadow-md" style={{ animationDelay: '-15s' }} />
        </div>

        {/* Afternoon/Evening Cloud */}
        <Cloud className="absolute top-10 right-20 w-80 h-48 text-white/80 fill-white/70 animate-cloud-slow drop-shadow-2xl" style={{ animationDelay: '-25s' }} />
        
        {isSunset && (
           <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 to-purple-500/10 mix-blend-overlay" />
        )}
      </div>

      {/* GARDEN THEME ELEMENTS: TREES */}
      {theme === 'garden' && (
        <div className="absolute bottom-[20%] w-full flex justify-between px-10 pointer-events-none opacity-80 z-0">
           {/* Left Tree */}
           <div className="relative w-40 h-64 transform -translate-x-10">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-32 bg-amber-900 rounded-lg" />
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-green-600 rounded-full shadow-lg flex items-center justify-center">
                 <div className="w-40 h-40 bg-green-500 rounded-full" />
                 {/* Fruits (Apples) */}
                 <div className="absolute top-10 left-10 w-4 h-4 bg-red-500 rounded-full" />
                 <div className="absolute top-20 right-10 w-4 h-4 bg-red-500 rounded-full" />
                 <div className="absolute bottom-10 left-20 w-4 h-4 bg-red-500 rounded-full" />
              </div>
           </div>

           {/* Right Tree */}
           <div className="relative w-48 h-72 transform translate-x-10 scale-x-[-1]">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-40 bg-amber-900 rounded-lg" />
              <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-56 h-56 bg-green-600 rounded-full shadow-lg flex items-center justify-center">
                 <div className="w-48 h-48 bg-green-500 rounded-full" />
                  {/* Fruits */}
                 <div className="absolute top-12 right-12 w-4 h-4 bg-red-500 rounded-full" />
                 <div className="absolute bottom-14 left-14 w-4 h-4 bg-red-500 rounded-full" />
              </div>
           </div>
        </div>
      )}

      {/* Textured Terrain / Grass */}
      <div className={`absolute bottom-0 w-full h-[25%] bg-gradient-to-b ${getGrassColor()} rounded-t-[40%_20%] scale-110 shadow-[0_-10px_60px_rgba(0,0,0,0.3)] z-0 transition-colors duration-1000`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-200 to-transparent" />
        <div className="flex justify-around items-end w-full h-full pb-6 px-4">
           {[...Array(15)].map((_, i) => (
             <div 
                key={i} 
                className={`w-3 bg-gradient-to-t ${isNight ? 'from-black to-indigo-900' : isSunset ? 'from-amber-900 to-amber-600' : 'from-green-800 to-green-400'} rounded-t-full opacity-60 transform origin-bottom ${i % 2 === 0 ? 'rotate-6 h-12' : '-rotate-6 h-8'}`} 
             />
           ))}
        </div>
      </div>
    </div>
  );
};

export default Background;