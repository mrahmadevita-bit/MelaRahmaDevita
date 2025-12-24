import React, { useState, useEffect } from 'react';
import { Timer, GlassWater, Apple } from 'lucide-react';
import { AdventureMode, TimeOfDay } from '../types';

interface Props {
  playerName: string;
  lessonStep?: number; // 0=Intro, 1=Rabbit(Stopwatch), 2=5Min(Fingers), 3=NonStandard(Water), 4=Conversion(Excited), 5=Schedule(Notebook)
  adventureMode?: AdventureMode;
  adventureType?: 'time' | 'weight';
  timeOfDay?: TimeOfDay;
}

const GuideCharacter: React.FC<Props> = ({ playerName, lessonStep = -1, adventureMode, adventureType = 'time', timeOfDay }) => {
  const [speech, setSpeech] = useState<string | null>(null);

  const isSim = adventureMode === 'simulation';
  const isQuiz = adventureMode === 'quiz';
  const isWeight = adventureType === 'weight';

  // Initial greeting or Lesson specific speech
  useEffect(() => {
    if (isWeight && lessonStep >= 0) {
         if (lessonStep === 0) {
            setSpeech("Wah, Semangka ini berat sekali!");
         } else if (lessonStep === 1) {
            setSpeech("Timbangan miring ke benda yang berat!");
         }
         const timer = setTimeout(() => setSpeech(null), 4000);
         return () => clearTimeout(timer);
    }

    if (isSim) {
        setSpeech(`Geser tombol di bawah untuk memutar jam!`);
        const timer = setTimeout(() => setSpeech(null), 4000);
        return () => clearTimeout(timer);
    }

    if (isQuiz) {
        setSpeech(`Siap untuk kuis? Ayo tunjukkan kemampuanmu!`);
        const timer = setTimeout(() => setSpeech(null), 4000);
        return () => clearTimeout(timer);
    }
    
    // Lobby Greeting
    if (lessonStep === -1) {
        let greeting = "Halo";
        if (timeOfDay === 'morning') greeting = "Selamat Pagi";
        else if (timeOfDay === 'noon') greeting = "Selamat Siang";
        else if (timeOfDay === 'afternoon') greeting = "Selamat Sore";
        else if (timeOfDay === 'night') greeting = "Selamat Malam";

        setSpeech(`${greeting}, ${playerName}! Ayo bertualang!`);
        const timer = setTimeout(() => setSpeech(null), 4000);
        return () => clearTimeout(timer);
    } else if (adventureType === 'time') {
        // Time Lesson hints
        const hints = [
            "Ayo belajar membaca jam!", // 0
            "Kelinci itu cepat, Kura-kura lambat!", // 1
            "Satu lompatan = 5 Menit!", // 2
            "Haus? Minum dulu yuk!", // 3
            "Wah, banyak sekali angkanya!", // 4
            "Ayo atur waktumu!" // 5
        ];
        if (hints[lessonStep]) {
            setSpeech(hints[lessonStep]);
            const timer = setTimeout(() => setSpeech(null), 3000);
            return () => clearTimeout(timer);
        }
    }
  }, [playerName, lessonStep, isSim, isQuiz, isWeight, adventureType, timeOfDay]);

  const handleInteract = () => {
    // Context-aware guidance
    if (lessonStep === -1) {
       // Lobby
       const msgs = [
          "Ayo pilih petualangan!",
          "Mau belajar Waktu atau Berat?",
          "Aku siap membantu!"
       ];
       setSpeech(msgs[Math.floor(Math.random() * msgs.length)]);
    } else {
       // In Adventure
       if (adventureMode === 'learning') {
          setSpeech("Kamu harus belajar dulu sebelum mencoba Simulasi.");
       } else if (adventureMode === 'simulation') {
          setSpeech("Setelah lancar Simulasi, baru kamu bisa lanjut ke Kuis!");
       } else if (adventureMode === 'quiz') {
          setSpeech("Ayo kerjakan Kuis! Tunjukkan kamu pasti bisa!");
       }
    }

    // Auto clear
    setTimeout(() => {
        setSpeech(null);
    }, 4000);
  };

  return (
    <div className={`absolute bottom-10 z-20 pointer-events-auto transition-transform duration-500 ease-in-out`}>
      {/* Speech Bubble */}
      {speech && (
        <div className={`absolute w-48 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)] border-2 border-amber-900 animate-pop z-50 
            ${isSim || isQuiz 
                ? 'top-20 right-[100%] mr-4 rounded-2xl rounded-tr-none' 
                : 'top-20 left-[100%] ml-4 rounded-2xl rounded-tl-none'
            }
        `}>
          <p className="font-fredoka text-amber-900 text-sm leading-tight text-center font-bold">
            {speech}
          </p>
        </div>
      )}

      {/* Character Container - Scaling wrapper */}
      <div 
        onClick={handleInteract}
        className={`relative w-48 h-80 sm:w-56 sm:h-96 cursor-pointer group origin-bottom hover:scale-[1.02] transition-transform ${isSim || isQuiz ? '-scale-x-100' : ''}`}
      >
         {/* CSS Art: Girl Adventurer */}
         <div className="w-full h-full relative flex justify-center items-end">
            
            {/* LEGS */}
            <div className="absolute bottom-0 w-24 h-32 flex justify-between px-2 z-10">
                <div className="w-8 h-full bg-orange-100 rounded-b-xl relative">
                    <div className="absolute bottom-0 w-10 -left-1 h-12 bg-amber-900 rounded-lg rounded-t-sm border-b-4 border-amber-950" />
                    <div className="absolute bottom-12 w-full h-6 bg-white border-t-2 border-red-400" />
                </div>
                <div className="w-8 h-full bg-orange-100 rounded-b-xl relative transform -translate-x-1">
                    <div className="absolute bottom-0 w-10 -left-1 h-12 bg-amber-900 rounded-lg rounded-t-sm border-b-4 border-amber-950" />
                     <div className="absolute bottom-12 w-full h-6 bg-white border-t-2 border-red-400" />
                </div>
            </div>

            {/* TORSO */}
            {/* Body Width 6rem (w-24) */}
            <div className="absolute bottom-28 w-24 h-32 bg-stone-100 rounded-xl z-20 flex flex-col items-center shadow-sm">
                <div className="w-full h-full bg-stone-200 rounded-xl relative overflow-hidden border-l-4 border-r-4 border-stone-300">
                   <div className="absolute top-0 inset-x-4 bottom-0 bg-white" />
                   <div className="absolute top-8 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-800 rounded-full" />
                   <div className="absolute top-16 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-800 rounded-full" />
                </div>
                <div className="absolute -bottom-4 w-28 h-12 bg-stone-400 rounded-xl shadow-inner z-20" />
            </div>

            {/* SCARF */}
            <div className="absolute bottom-[13.5rem] w-28 h-12 bg-orange-500 rounded-full z-30 shadow-md flex items-center justify-center">
                 <div className="w-32 h-6 bg-orange-600 rounded-full mt-2 opacity-20" />
            </div>

            {/* FLOATING PROPS (Replaces Arms) */}
            
            {/* Left Side (Quiz Clipboard) */}
            {isQuiz && (
                <div className="absolute bottom-40 -left-6 z-30 animate-float">
                    <div className="w-12 h-16 bg-amber-800 rounded-sm border-2 border-amber-950 flex flex-col items-center p-1 shadow-sm transform -rotate-12">
                       <div className="w-full h-2 bg-stone-400 mb-1" />
                       <div className="w-full h-full bg-white opacity-80" />
                    </div>
                </div>
            )}
             
            {/* Right Side Props */}
            <div className="absolute bottom-40 -right-6 z-30">
                 {/* Weight: Apple */}
                 {isWeight && (
                    <div className="animate-bounce">
                        <div className="relative w-10 h-10 bg-red-500 rounded-full border border-red-700 shadow-sm">
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-stone-700" />
                           <div className="absolute top-0 right-2 w-3 h-2 bg-green-500 rounded-full rounded-bl-none" />
                        </div>
                    </div>
                 )}

                 {/* Step 1: Stopwatch */}
                 {(lessonStep === 1 && !isWeight) && (
                     <div className="bg-slate-200 rounded-full p-2 border-2 border-slate-400 shadow-sm animate-pulse transform rotate-12">
                         <Timer size={28} className="text-slate-700" />
                     </div>
                 )}

                 {/* Step 2: 5 Fingers (Text Bubble) */}
                 {!isSim && !isQuiz && !isWeight && lessonStep === 2 && (
                     <div className="bg-yellow-300 rounded-full w-12 h-12 flex items-center justify-center border-2 border-yellow-500 shadow-md animate-bounce">
                         <span className="font-black text-yellow-900 text-xl">5!</span>
                     </div>
                 )}

                 {/* Step 3: Water Glass */}
                 {!isSim && !isQuiz && !isWeight && lessonStep === 3 && (
                     <div className="animate-wiggle transform rotate-12">
                         <GlassWater size={36} className="text-blue-400 fill-blue-200/50 drop-shadow-sm" />
                     </div>
                 )}

                 {/* Step 4: Excited Pointing (Star) */}
                 {!isSim && !isQuiz && !isWeight && lessonStep === 4 && (
                     <div className="animate-ping">
                         <div className="text-5xl">✨</div>
                     </div>
                 )}

                 {/* Step 5: Red Notebook */}
                 {!isSim && !isQuiz && !isWeight && lessonStep === 5 && (
                     <div className="w-12 h-16 bg-red-500 rounded-sm border-2 border-red-700 transform rotate-12 shadow-sm flex flex-col items-center pt-2 animate-float">
                        <div className="w-8 h-1 bg-white opacity-50 mb-1" />
                        <div className="w-8 h-1 bg-white opacity-50 mb-1" />
                        <div className="w-8 h-1 bg-white opacity-50" />
                     </div>
                 )}
            </div>

            {/* HEAD */}
            <div className="absolute bottom-56 w-28 h-32 bg-orange-100 rounded-[2.5rem] z-30 shadow-sm flex flex-col items-center">
                <div className="relative w-full h-full">
                     <div className="absolute top-14 left-6 w-3 h-4 bg-slate-900 rounded-full" />
                     <div className="absolute top-14 right-6 w-3 h-4 bg-slate-900 rounded-full" />
                     
                     {/* Glasses for Quiz Mode */}
                     {isQuiz && (
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-20 h-8 flex justify-center gap-1">
                           <div className="w-8 h-8 rounded-full border-4 border-slate-800 bg-white/20" />
                           <div className="w-2 h-1 bg-slate-800 mt-4" />
                           <div className="w-8 h-8 rounded-full border-4 border-slate-800 bg-white/20" />
                        </div>
                     )}

                     {!isQuiz && (
                      <>
                        <div className="absolute top-16 left-3 w-5 h-2 bg-red-300 rounded-full blur-sm opacity-60" />
                        <div className="absolute top-16 right-3 w-5 h-2 bg-red-300 rounded-full blur-sm opacity-60" />
                      </>
                     )}
                     
                     <div className="absolute top-20 left-1/2 -translate-x-1/2 w-6 h-3 border-b-4 border-amber-900 rounded-full" />
                     <div className="absolute top-0 w-full h-12 bg-amber-900 rounded-t-[2.5rem] rounded-bl-3xl" />
                     <div className="absolute top-4 -right-1 w-8 h-12 bg-amber-900 rounded-full" />
                </div>
            </div>

            {/* HAT */}
            <div className="absolute bottom-[20rem] w-40 h-16 z-40">
                 <div className="absolute bottom-0 w-full h-6 bg-amber-800 rounded-full shadow-lg" />
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-14 bg-amber-700 rounded-t-2xl rounded-b-lg border-b-8 border-amber-900" />
            </div>

            {/* BACKPACK STRAPS */}
            <div className="absolute bottom-44 w-20 h-24 z-25">
               <div className="absolute left-2 w-2 h-24 bg-amber-900 opacity-80" />
               <div className="absolute right-2 w-2 h-24 bg-amber-900 opacity-80" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default GuideCharacter;