import React, { useState, useEffect } from 'react';
import { BookOpen, Gamepad2, GraduationCap, Lock, ArrowRight, ArrowLeft, Home, GlassWater, Eye, Sun, Moon, Calendar, Globe, PartyPopper, LayoutGrid, Bed, School, Backpack, Palmtree, MoonStar, Unlock, CheckCircle, ChevronRight, RotateCw, MoveHorizontal, Coins, Star } from 'lucide-react';
import { AdventureMode, TimeOfDay } from '../types';

interface Props {
  onBack: () => void;
  onSlideChange: (step: number) => void;
  mode: AdventureMode;
  onModeChange: (mode: AdventureMode) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
}

// Simulation Questions
const SIMULATION_QUESTIONS = [
  {
    id: 1,
    text: "Misi: Atur jam menjadi pukul 07.30!",
    target: { h: 7, m: 30 }
  },
  {
    id: 2,
    text: "Misi: Atur jam menjadi pukul 10.15!",
    target: { h: 10, m: 15 }
  },
  {
    id: 3,
    text: "Misi: Atur jam menjadi pukul 03.45!",
    target: { h: 3, m: 45 }
  }
];

// Quiz Questions
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Jarum pendek menunjuk angka 3. Jarum panjang menunjuk angka 12. Pukul berapakah itu?",
    time: { h: 3, m: 0 },
    options: [
      { text: "03.00", isCorrect: true, color: "bg-blue-500 border-blue-700 hover:bg-blue-400" },
      { text: "12.30", isCorrect: false, color: "bg-orange-500 border-orange-700 hover:bg-orange-400" },
      { text: "02.00", isCorrect: false, color: "bg-red-500 border-red-700 hover:bg-red-400" }
    ]
  },
  {
    id: 2,
    question: "Jika jarum panjang menunjuk angka 6, berarti sudah lewat berapa menit?",
    time: { h: 12, m: 30 },
    options: [
      { text: "15 Menit", isCorrect: false, color: "bg-purple-500 border-purple-700 hover:bg-purple-400" },
      { text: "30 Menit", isCorrect: true, color: "bg-green-500 border-green-700 hover:bg-green-400" },
      { text: "45 Menit", isCorrect: false, color: "bg-pink-500 border-pink-700 hover:bg-pink-400" }
    ]
  }
];

const TimeAdventure: React.FC<Props> = ({ onBack, onSlideChange, mode, onModeChange, setTimeOfDay }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  
  // Simulation State
  const [simQuestionIndex, setSimQuestionIndex] = useState(0);
  const [userTime, setUserTime] = useState({ h: 10, m: 10 });
  const [isSimCorrect, setIsSimCorrect] = useState<boolean | null>(null);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Sync slide index with parent for character animations
  useEffect(() => {
    onSlideChange(slideIndex);
  }, [slideIndex, onSlideChange]);

  // Reset states when mode changes
  useEffect(() => {
    setUserTime({ h: 10, m: 10 });
    setIsSimCorrect(null);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
  }, [mode]);

  // --- LOGIC: Dynamic Background Change based on Simulation Time ---
  useEffect(() => {
    if (mode === 'simulation') {
        const h = userTime.h;
        // Mapping Logic for 12-Hour Clock Slider (1-12) to Time of Day
        // Assumptions for a typical "Day Cycle" in a kids game:
        // 5, 6, 7, 8, 9 -> Morning (Pagi)
        // 10, 11, 12, 1 -> Noon (Siang)
        // 2, 3, 4, 5 -> Afternoon (Sore/Senja)
        // Note: Night is not explicitly covered by the 1-12 slider in this school-day context,
        // but can be added if needed. For now, this covers the requested "04.30 = afternoon".

        if (h >= 5 && h <= 9) {
            setTimeOfDay('morning');
        } else if (h === 10 || h === 11 || h === 12 || h === 1) {
            setTimeOfDay('noon');
        } else if (h >= 2 && h <= 4) {
            setTimeOfDay('afternoon');
        }
    }
  }, [userTime.h, mode, setTimeOfDay]);


  const handleNext = () => {
    if (slideIndex < 5) setSlideIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (slideIndex > 0) setSlideIndex(prev => prev - 1);
  };

  const handleSimCheckAnswer = () => {
    const currentSim = SIMULATION_QUESTIONS[simQuestionIndex];
    const isHourCorrect = userTime.h === currentSim.target.h;
    const isMinuteCorrect = userTime.m === currentSim.target.m;
    
    if (isHourCorrect && isMinuteCorrect) {
      setIsSimCorrect(true);
    } else {
      setIsSimCorrect(false);
      setTimeout(() => setIsSimCorrect(null), 2000);
    }
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setQuizScore(prev => prev + 10);
    }
    
    // Slight delay before next question
    setTimeout(() => {
      if (quizIndex < QUIZ_QUESTIONS.length - 1) {
        setQuizIndex(prev => prev + 1);
      } else {
        setQuizFinished(true);
      }
    }, 500);
  };

  // --- RENDERERS ---

  const renderLearningVisuals = () => {
    switch (slideIndex) {
      case 0: // Intro
        return (
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-white rounded-full border-[10px] border-slate-200 shadow-[inset_0_10px_20px_rgba(0,0,0,0.1),0_15px_30px_rgba(0,0,0,0.2)] flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
             {[...Array(12)].map((_, i) => (
               <div key={i} className="absolute w-full h-full text-center pt-2 font-fredoka font-bold text-3xl text-slate-600" style={{ transform: `rotate(${(i + 1) * 30}deg)` }}>
                 <span className="inline-block" style={{ transform: `rotate(-${(i + 1) * 30}deg)` }}>{i + 1}</span>
               </div>
             ))}
             <div className="absolute w-6 h-6 bg-slate-800 rounded-full z-20 border-2 border-slate-500 shadow-sm" />
             <div className="absolute bottom-1/2 left-1/2 w-3 h-20 bg-red-500 rounded-full origin-bottom z-10 shadow-md border border-red-700 transition-transform duration-700" style={{ transform: 'translateX(-50%) rotate(270deg)' }} />
             <div className="absolute bottom-1/2 left-1/2 w-2 h-28 bg-blue-500 rounded-full origin-bottom z-10 shadow-md border border-blue-700 transition-transform duration-700" style={{ transform: 'translateX(-50%) rotate(0deg)' }} />
             <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-white/40 to-transparent rounded-t-full pointer-events-none" />
          </div>
        );
      case 1: // Speed Logic
        return (
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-white rounded-full border-[10px] border-slate-200 shadow-[inset_0_10px_20px_rgba(0,0,0,0.1),0_15px_30px_rgba(0,0,0,0.2)] flex items-center justify-center">
             {[...Array(12)].map((_, i) => (
               <div key={i} className="absolute w-full h-full text-center pt-2 font-fredoka font-bold text-3xl text-slate-600" style={{ transform: `rotate(${(i + 1) * 30}deg)` }}>
                 <span className="inline-block" style={{ transform: `rotate(-${(i + 1) * 30}deg)` }}>{i + 1}</span>
               </div>
             ))}
             <div className="absolute w-6 h-6 bg-slate-800 rounded-full z-20 border-2 border-slate-500 shadow-sm" />
             <div className="absolute bottom-1/2 left-1/2 w-3 h-20 bg-red-500 rounded-full origin-bottom z-10 shadow-md border border-red-700" style={{ transform: 'translateX(-50%) rotate(270deg)' }}>
                <div className="absolute -top-8 -left-3 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🐢</div>
             </div>
             <div className="absolute bottom-1/2 left-1/2 w-2 h-28 bg-blue-500 rounded-full origin-bottom z-10 shadow-md border border-blue-700" style={{ transform: 'translateX(-50%) rotate(0deg)' }}>
                <div className="absolute -top-10 -left-4 text-4xl animate-bounce" style={{ animationDuration: '1s' }}>🐰</div>
             </div>
             <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-white/40 to-transparent rounded-t-full pointer-events-none" />
          </div>
        );
      case 2: // 5-Minute
        return (
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-white rounded-full border-[10px] border-slate-200 shadow-[inset_0_10px_20px_rgba(0,0,0,0.1),0_15px_30px_rgba(0,0,0,0.2)] flex items-center justify-center">
             {[...Array(12)].map((_, i) => (
               <div key={i} className={`absolute w-full h-full text-center pt-2 font-fredoka font-bold text-3xl ${i === 0 || i === 11 ? 'text-blue-600 scale-110' : 'text-slate-400'}`} style={{ transform: `rotate(${(i + 1) * 30}deg)` }}>
                 <span className="inline-block" style={{ transform: `rotate(-${(i + 1) * 30}deg)` }}>{i + 1}</span>
               </div>
             ))}
             <div className="absolute w-6 h-6 bg-slate-800 rounded-full z-20 border-2 border-slate-500 shadow-sm" />
             <div className="absolute bottom-1/2 left-1/2 w-3 h-16 bg-slate-300 rounded-full origin-bottom z-0" style={{ transform: 'translateX(-50%) rotate(130deg)' }} />
             <div className="absolute bottom-1/2 left-1/2 w-2 h-24 bg-blue-300/50 rounded-full origin-bottom z-0" style={{ transform: 'translateX(-50%) rotate(0deg)' }} />
             <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-visible">
                <path d="M 160 40 Q 200 45 220 100" fill="none" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" strokeDasharray="10,5" className="animate-pulse" />
                <polygon points="220,100 210,85 235,90" fill="#FBBF24" />
             </svg>
             <div className="absolute top-20 right-10 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-lg transform rotate-12 shadow-md animate-pop">
                5 Menit!
             </div>
          </div>
        );
      case 3: // Non-Standard
        return (
          <div className="relative w-full h-80 flex items-center justify-center gap-4 sm:gap-8">
             <div className="w-40 h-56 bg-blue-50 rounded-2xl border-4 border-blue-200 flex flex-col items-center justify-center gap-4 shadow-lg transform hover:scale-105 transition-transform">
                <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center">
                   <GlassWater size={48} className="text-blue-600" />
                </div>
                <span className="font-fredoka font-bold text-blue-800 text-xl">1 Teguk</span>
             </div>
             <div className="text-5xl font-black text-[#8b5a2b]">=</div>
             <div className="w-40 h-56 bg-purple-50 rounded-2xl border-4 border-purple-200 flex flex-col items-center justify-center gap-4 shadow-lg transform hover:scale-105 transition-transform">
                 <div className="w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center">
                   <Eye size={48} className="text-purple-600 animate-pulse" />
                </div>
                <span className="font-fredoka font-bold text-purple-800 text-xl">3 Kedipan</span>
             </div>
          </div>
        );
      case 4: // Conversion
        return (
          <div className="w-full h-full flex flex-col justify-center gap-3 px-2 sm:px-4">
             <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 flex items-center gap-4 border-l-8 border-orange-400 shadow-sm transform hover:scale-105 transition-transform hover:bg-white/90">
               <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <div className="relative">
                    <Sun className="text-orange-500 w-6 h-6 fill-orange-500 absolute -top-2 -left-2" />
                    <Moon className="text-blue-600 w-5 h-5 fill-blue-600 absolute top-2 left-2" />
                  </div>
               </div>
               <span className="font-fredoka text-lg sm:text-xl text-stone-700 font-bold flex-1">
                 1 Hari = <span className="text-2xl sm:text-3xl text-orange-600">24</span> Jam
               </span>
             </div>
             <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 flex items-center gap-4 border-l-8 border-blue-400 shadow-sm transform hover:scale-105 transition-transform hover:bg-white/90">
               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <LayoutGrid className="text-blue-500 w-7 h-7" />
               </div>
               <span className="font-fredoka text-lg sm:text-xl text-stone-700 font-bold flex-1">
                 1 Minggu = <span className="text-2xl sm:text-3xl text-blue-600">7</span> Hari
               </span>
             </div>
             <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 flex items-center gap-4 border-l-8 border-green-400 shadow-sm transform hover:scale-105 transition-transform hover:bg-white/90">
               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Calendar className="text-green-600 w-7 h-7" />
               </div>
               <span className="font-fredoka text-lg sm:text-xl text-stone-700 font-bold flex-1">
                 1 Bulan = <span className="text-2xl sm:text-3xl text-green-600">30</span> Hari
               </span>
             </div>
             <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 flex items-center gap-4 border-l-8 border-purple-400 shadow-sm transform hover:scale-105 transition-transform hover:bg-white/90">
               <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                  <Globe className="text-purple-600 w-7 h-7" />
               </div>
               <span className="font-fredoka text-lg sm:text-xl text-stone-700 font-bold flex-1">
                 1 Tahun = <span className="text-2xl sm:text-3xl text-purple-600">12</span> Bulan
               </span>
             </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 flex items-center gap-4 border-l-8 border-red-400 shadow-sm transform hover:scale-105 transition-transform hover:bg-white/90">
               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <PartyPopper className="text-red-500 w-7 h-7" />
               </div>
               <span className="font-fredoka text-lg sm:text-xl text-stone-700 font-bold flex-1">
                 1 Tahun = <span className="text-2xl sm:text-3xl text-red-600">365</span> Hari
               </span>
             </div>
          </div>
        );
      case 5: // Schedule
        return (
          <div className="w-full h-full flex flex-col relative">
             <div className="flex-1 relative flex justify-center py-2">
                <div className="absolute top-2 bottom-2 left-1/2 w-2 bg-stone-300 rounded-full -translate-x-1/2" />
                <div className="flex flex-col justify-between w-full max-w-lg z-10 h-full">
                   <div className="flex items-center justify-end w-[50%] self-start pr-6 relative group">
                      <div className="absolute right-[-2.25rem] w-4 h-4 bg-orange-400 rounded-full border-2 border-white shadow-sm z-20" />
                      <div className="bg-white/80 p-2 rounded-xl shadow-sm border border-orange-200 flex items-center gap-3 backdrop-blur-sm hover:scale-110 transition-transform origin-right">
                         <span className="font-fredoka font-bold text-orange-600 text-lg">06:00</span>
                         <Sun className="text-orange-500 w-6 h-6" />
                         <span className="font-baloo font-bold text-stone-700">Bangun</span>
                      </div>
                   </div>
                   <div className="flex items-center justify-start w-[50%] self-end pl-6 relative group">
                      <div className="absolute left-[-2.25rem] w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm z-20" />
                      <div className="bg-white/80 p-2 rounded-xl shadow-sm border border-blue-200 flex items-center gap-3 backdrop-blur-sm hover:scale-110 transition-transform origin-left">
                         <School className="text-blue-500 w-6 h-6" />
                         <span className="font-baloo font-bold text-stone-700">Sekolah</span>
                         <span className="font-fredoka font-bold text-blue-600 text-lg">07:00</span>
                      </div>
                   </div>
                   <div className="flex items-center justify-end w-[50%] self-start pr-6 relative group">
                      <div className="absolute right-[-2.25rem] w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm z-20" />
                      <div className="bg-white/80 p-2 rounded-xl shadow-sm border border-green-200 flex items-center gap-3 backdrop-blur-sm hover:scale-110 transition-transform origin-right">
                         <span className="font-fredoka font-bold text-green-600 text-lg">12:00</span>
                         <Home className="text-green-500 w-6 h-6" />
                         <span className="font-baloo font-bold text-stone-700">Pulang</span>
                      </div>
                   </div>
                   <div className="flex items-center justify-start w-[50%] self-end pl-6 relative group">
                      <div className="absolute left-[-2.25rem] w-4 h-4 bg-indigo-400 rounded-full border-2 border-white shadow-sm z-20" />
                      <div className="bg-white/80 p-2 rounded-xl shadow-sm border border-indigo-200 flex items-center gap-3 backdrop-blur-sm hover:scale-110 transition-transform origin-left">
                         <Bed className="text-indigo-500 w-6 h-6" />
                         <span className="font-baloo font-bold text-stone-700">Tidur Siang</span>
                         <span className="font-fredoka font-bold text-indigo-600 text-lg">14:00</span>
                      </div>
                   </div>
                   <div className="flex items-center justify-end w-[50%] self-start pr-6 relative group">
                      <div className="absolute right-[-2.25rem] w-4 h-4 bg-slate-700 rounded-full border-2 border-white shadow-sm z-20" />
                      <div className="bg-white/80 p-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 backdrop-blur-sm hover:scale-110 transition-transform origin-right">
                         <span className="font-fredoka font-bold text-slate-700 text-lg">21:00</span>
                         <MoonStar className="text-slate-600 w-6 h-6" />
                         <span className="font-baloo font-bold text-stone-700">Tidur Malam</span>
                      </div>
                   </div>
                </div>
             </div>
             <div className="mt-2 w-full h-20 bg-stone-100 rounded-xl border-4 border-stone-300 flex overflow-hidden shadow-inner">
                <div className="flex-[2] bg-blue-100 flex flex-col items-center justify-center border-r-4 border-stone-300 relative group">
                   <div className="absolute top-1 right-2 opacity-10">
                      <School size={48} />
                   </div>
                   <span className="font-fredoka font-bold text-blue-900 text-sm sm:text-base">Senin - Sabtu</span>
                   <div className="flex items-center gap-2 mt-1">
                      <Backpack className="text-blue-600 w-6 h-6 sm:w-8 sm:h-8 drop-shadow-sm" />
                      <span className="font-baloo font-extrabold text-blue-700 text-xl">Sekolah</span>
                   </div>
                </div>
                <div className="flex-1 bg-red-100 flex flex-col items-center justify-center relative group">
                   <div className="absolute top-1 right-2 opacity-10">
                      <Palmtree size={48} />
                   </div>
                   <span className="font-fredoka font-bold text-red-900 text-sm sm:text-base">Minggu</span>
                   <div className="flex items-center gap-2 mt-1">
                      <Palmtree className="text-red-600 w-6 h-6 sm:w-8 sm:h-8 drop-shadow-sm" />
                      <span className="font-baloo font-extrabold text-red-700 text-xl">Libur!</span>
                   </div>
                </div>
             </div>
          </div>
        );
      default: return null;
    }
  };

  const renderSimulationVisuals = () => {
    const currentSim = SIMULATION_QUESTIONS[simQuestionIndex];
    const hourRotation = (userTime.h % 12) * 30 + (userTime.m / 60) * 30;
    const minuteRotation = userTime.m * 6;

    return (
       <div className="w-full h-full flex flex-col gap-2 py-1 relative">
          <div className="flex justify-between items-center px-4">
             <div className="bg-orange-500 text-white px-4 py-1 rounded-full font-fredoka font-bold text-sm shadow-md border-2 border-orange-600">
               Soal {simQuestionIndex + 1} / {SIMULATION_QUESTIONS.length}
             </div>
          </div>
          <div className="flex-1 flex gap-4 items-center justify-center relative px-4">
             <div className="w-2/5 flex flex-col gap-4 self-center">
               <div className="bg-white/90 backdrop-blur-md border-4 border-yellow-400 rounded-3xl p-5 shadow-lg relative animate-pop text-left">
                  <div className="absolute -top-5 left-6 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full font-black text-sm border-2 border-white shadow-sm uppercase tracking-wider">
                    Misi {currentSim.id}
                  </div>
                  <p className="font-fredoka text-xl text-stone-700 leading-relaxed mt-2 font-bold">
                    {currentSim.text}
                  </p>
               </div>
             </div>
             <div className="w-3/5 flex flex-col items-center justify-center relative z-10">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-white rounded-full border-[12px] border-blue-500 shadow-[0_15px_30px_rgba(0,0,0,0.2)] flex items-center justify-center group hover:scale-105 transition-transform">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="absolute inset-2 text-center" style={{ transform: `rotate(${(i + 1) * 30}deg)` }}>
                        <span className="inline-block text-2xl font-fredoka font-bold text-slate-800" style={{ transform: `rotate(-${(i + 1) * 30}deg)` }}>{i + 1}</span>
                      </div>
                    ))}
                    <div className="absolute w-6 h-6 bg-slate-800 rounded-full z-20 border-2 border-white shadow-sm" />
                    <div className="absolute bottom-1/2 left-1/2 w-4 h-20 bg-red-500 rounded-full origin-bottom z-10 shadow-md border border-red-600 transition-transform duration-200 ease-out" style={{ transform: `translateX(-50%) rotate(${hourRotation}deg)` }}>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full opacity-50" />
                    </div>
                    <div className="absolute bottom-1/2 left-1/2 w-2.5 h-28 bg-blue-500 rounded-full origin-bottom z-10 shadow-md border border-blue-600 transition-transform duration-200 ease-out" style={{ transform: `translateX(-50%) rotate(${minuteRotation}deg)` }}>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full opacity-50" />
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-gradient-to-b from-white/40 to-transparent rounded-t-full pointer-events-none" />
                </div>
             </div>
          </div>
          <div className="w-full flex flex-col items-center gap-3 px-8 mt-2 bg-white/50 py-3 rounded-2xl border-2 border-stone-200">
             <div className="w-full max-w-lg flex items-center gap-4">
                 <div className="bg-red-100 p-2 rounded-full border-2 border-red-300">
                    <span className="text-2xl">🐢</span> 
                 </div>
                 <div className="flex-1 flex flex-col">
                    <div className="flex justify-between px-1">
                      <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Putar Jam</span>
                      <span className="text-xs font-bold text-red-600">{userTime.h}</span>
                    </div>
                    <input type="range" min="1" max="12" step="1" value={userTime.h} onChange={(e) => setUserTime(prev => ({ ...prev, h: parseInt(e.target.value) }))} className="w-full h-4 bg-red-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 transition-all" />
                 </div>
             </div>
             <div className="w-full max-w-lg flex items-center gap-4">
                 <div className="bg-blue-100 p-2 rounded-full border-2 border-blue-300">
                    <span className="text-2xl">🐰</span>
                 </div>
                 <div className="flex-1 flex flex-col">
                    <div className="flex justify-between px-1">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Putar Menit</span>
                      <span className="text-xs font-bold text-blue-600">{String(userTime.m).padStart(2, '0')}</span>
                    </div>
                    <input type="range" min="0" max="59" step="1" value={userTime.m} onChange={(e) => setUserTime(prev => ({ ...prev, m: parseInt(e.target.value) }))} className="w-full h-4 bg-blue-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 transition-all" />
                 </div>
             </div>
          </div>
          <div className="w-full flex justify-center items-center mt-2 relative">
             <button onClick={handleSimCheckAnswer} className={`flex items-center gap-3 px-10 py-3 rounded-full shadow-[0_6px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 transition-all border-4 border-white ring-4 ring-green-200 ${isSimCorrect === true ? 'bg-green-500 hover:bg-green-600 text-white scale-110' : isSimCorrect === false ? 'bg-red-500 hover:bg-red-600 text-white animate-shake' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
                <CheckCircle size={32} strokeWidth={3} />
                <span className="font-fredoka font-black text-2xl tracking-wide">{isSimCorrect === true ? "BENAR!" : isSimCorrect === false ? "COBA LAGI" : "CEK JAWABAN"}</span>
             </button>
             {isSimCorrect === true && (
               <button onClick={() => setSimQuestionIndex((prev) => (prev + 1) % SIMULATION_QUESTIONS.length)} className="absolute right-4 w-16 h-16 bg-white hover:bg-stone-100 text-stone-600 rounded-full shadow-lg border-4 border-stone-200 flex items-center justify-center animate-pop">
                 <ChevronRight size={32} strokeWidth={4} />
               </button>
             )}
          </div>
       </div>
    );
  };

  const renderQuizVisuals = () => {
    const currentQuiz = QUIZ_QUESTIONS[quizIndex];
    
    // Quiz Completed View
    if (quizFinished) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center animate-pop gap-6">
           <div className="relative">
             <Star size={120} className="text-yellow-400 fill-yellow-400 animate-[spin_10s_linear_infinite]" />
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="font-fredoka font-black text-4xl text-yellow-900">{quizScore}</span>
             </div>
           </div>
           <h2 className="font-fredoka font-extrabold text-4xl text-[#8b5a2b]">Kuis Selesai!</h2>
           <p className="font-baloo text-xl text-stone-600">Kamu hebat sekali!</p>
           <button 
             onClick={() => onModeChange('learning')} 
             className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-fredoka font-bold text-xl shadow-[0_6px_0_#15803d] active:shadow-none active:translate-y-1 transition-all"
           >
             Kembali Belajar
           </button>
        </div>
      );
    }

    return (
       <div className="w-full h-full flex flex-col gap-4 py-2 relative">
          {/* Top HUD */}
          <div className="flex justify-between items-center px-2">
             <div className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full font-fredoka font-bold text-lg shadow-md border-2 border-yellow-500">
               <Coins size={20} className="fill-yellow-100" />
               <span>Skor: {quizScore}</span>
             </div>
             <div className="bg-purple-500 text-white px-4 py-1.5 rounded-full font-fredoka font-bold text-lg shadow-md border-2 border-purple-600">
               Soal {quizIndex + 1} / {QUIZ_QUESTIONS.length}
             </div>
          </div>

          {/* Main Card */}
          <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-3xl border-4 border-white/50 shadow-inner flex flex-col items-center justify-center p-6 gap-6 relative">
             
             {/* Question */}
             <div className="bg-white/90 p-6 rounded-2xl shadow-lg border-b-8 border-purple-100 w-full text-center">
                <p className="font-fredoka font-bold text-2xl text-stone-700 leading-snug">
                  {currentQuiz.question}
                </p>
             </div>

             {/* Static Visual Clock */}
             <div className="relative w-48 h-48 bg-white rounded-full border-[8px] border-slate-700 shadow-xl flex items-center justify-center">
                 {[...Array(12)].map((_, i) => (
                   <div key={i} className="absolute inset-1 text-center" style={{ transform: `rotate(${(i + 1) * 30}deg)` }}>
                     <span className="inline-block text-lg font-fredoka font-bold text-slate-500" style={{ transform: `rotate(-${(i + 1) * 30}deg)` }}>{i + 1}</span>
                   </div>
                 ))}
                 <div className="absolute w-4 h-4 bg-slate-800 rounded-full z-20" />
                 {/* Hour Hand */}
                 <div className="absolute bottom-1/2 left-1/2 w-3 h-14 bg-slate-800 rounded-full origin-bottom z-10" style={{ transform: `translateX(-50%) rotate(${currentQuiz.time.h * 30}deg)` }} />
                 {/* Minute Hand */}
                 <div className="absolute bottom-1/2 left-1/2 w-1.5 h-20 bg-slate-800 rounded-full origin-bottom z-10" style={{ transform: `translateX(-50%) rotate(${currentQuiz.time.m * 6}deg)` }} />
             </div>

             {/* Answer Buttons */}
             <div className="flex gap-4 w-full justify-center">
                {currentQuiz.options.map((opt, idx) => (
                   <button 
                     key={idx}
                     onClick={() => handleQuizAnswer(opt.isCorrect)}
                     className={`flex-1 max-w-[180px] py-4 rounded-xl text-white font-fredoka font-bold text-2xl shadow-[0_6px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 transition-all border-b-4 ${opt.color}`}
                   >
                     {opt.text}
                   </button>
                ))}
             </div>

          </div>
       </div>
    );
  };

  const getContentText = () => {
    if (mode === 'simulation' || mode === 'quiz') return null;

    switch (slideIndex) {
      case 0: return (<><h1 className="text-4xl sm:text-5xl font-fredoka font-extrabold text-[#8b5a2b] tracking-wider drop-shadow-sm mt-2">Mengenal Jam</h1><div className="bg-white/80 backdrop-blur-sm border-2 border-[#8b5a2b]/30 p-4 rounded-2xl shadow-sm text-center max-w-lg mt-4"><p className="font-fredoka text-[#5d4037] text-lg sm:text-xl leading-relaxed"><span className="font-bold text-red-600">Jarum Pendek</span> menunjuk Jam.<br/><span className="font-bold text-blue-600">Jarum Panjang</span> menunjuk Menit.</p></div></>);
      case 1: return (<><h1 className="text-3xl sm:text-4xl font-fredoka font-extrabold text-[#8b5a2b] tracking-wider drop-shadow-sm mt-2">Siapa Lebih Cepat?</h1><div className="bg-white/80 backdrop-blur-sm border-2 border-[#8b5a2b]/30 p-4 rounded-2xl shadow-sm text-center max-w-lg mt-4"><p className="font-fredoka text-[#5d4037] text-lg sm:text-xl leading-relaxed"><span className="font-bold text-blue-600">Jarum Panjang</span> = Kelinci (Cepat) 🐰<br/><span className="font-bold text-red-600">Jarum Pendek</span> = Kura-kura (Lambat) 🐢</p></div></>);
      case 2: return (<><h1 className="text-3xl sm:text-4xl font-fredoka font-extrabold text-[#8b5a2b] tracking-wider drop-shadow-sm mt-2">Menghitung Menit</h1><div className="bg-white/80 backdrop-blur-sm border-2 border-[#8b5a2b]/30 p-4 rounded-2xl shadow-sm text-center max-w-lg mt-4"><p className="font-fredoka text-[#5d4037] text-lg sm:text-xl leading-relaxed">1 Lompatan Angka = <span className="font-black text-yellow-600 text-2xl">5 Menit</span><br/><span className="text-sm opacity-80">1 Putaran Penuh = 60 Menit (1 Jam)</span></p></div></>);
      case 3: return (<><h1 className="text-3xl sm:text-4xl font-fredoka font-extrabold text-[#8b5a2b] tracking-wider drop-shadow-sm mt-2">Waktu Tidak Baku</h1><div className="bg-white/80 backdrop-blur-sm border-2 border-[#8b5a2b]/30 p-4 rounded-2xl shadow-sm text-center max-w-lg mt-4"><p className="font-fredoka text-[#5d4037] text-lg sm:text-xl leading-relaxed">Kita juga bisa mengukur waktu dengan kegiatan sehari-hari!<br/><span className="font-bold italic">Contoh: Minum & Kedip</span></p></div></>);
      case 4: return (<h1 className="text-3xl sm:text-4xl font-fredoka font-extrabold text-[#8b5a2b] tracking-wider drop-shadow-sm mt-2 mb-2">Satuan Waktu</h1>);
      case 5: return (<h1 className="text-3xl sm:text-4xl font-fredoka font-extrabold text-[#8b5a2b] tracking-wider drop-shadow-sm mt-2 mb-1">Jadwal Kegiatanku</h1>);
      default: return null;
    }
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 sm:p-8 animate-pop">
      
      <div className="flex w-full h-full max-w-6xl gap-6 sm:gap-10">
        
        {/* LEFT SIDEBAR: Navigation */}
        <div className="flex flex-col gap-4 w-1/4 min-w-[200px] mt-20 sm:mt-0 justify-center">
           
           {/* Button: Belajar Dulu */}
           <div className="relative group perspective-1000">
              <button 
                onClick={() => onModeChange('learning')}
                className={`w-full h-24 rounded-2xl border-4 flex items-center p-4 gap-4 transition-all duration-300 relative z-10 
                  ${mode === 'learning' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-700 shadow-[0_6px_0_#1e3a8a,0_10px_10px_rgba(0,0,0,0.3)] transform scale-105' 
                    : 'bg-stone-200 border-stone-400 shadow-[0_4px_0_#a8a29e] hover:bg-stone-300 scale-95 opacity-80'
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${mode === 'learning' ? 'bg-white/20 border-white/30' : 'bg-stone-300 border-stone-400'}`}>
                   <BookOpen size={28} className={mode === 'learning' ? 'text-white fill-white/20' : 'text-stone-500'} />
                </div>
                <div className="text-left">
                  <span className={`block font-fredoka font-bold text-xl drop-shadow-md ${mode === 'learning' ? 'text-white' : 'text-stone-600'}`}>Belajar Dulu</span>
                  <span className={`text-xs font-baloo ${mode === 'learning' ? 'text-blue-100' : 'text-stone-500'}`}>Materi Dasar</span>
                </div>
                {mode === 'learning' && <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 rotate-45 border-r-4 border-t-4 border-blue-700" />}
              </button>
           </div>

           {/* Button: Simulasi */}
           <div className="relative group perspective-1000">
              <button 
                 onClick={() => onModeChange('simulation')}
                 className={`w-full h-24 rounded-2xl border-4 flex items-center p-4 gap-4 transition-all duration-300 relative z-10
                  ${mode === 'simulation'
                     ? 'bg-gradient-to-r from-amber-400 to-yellow-500 border-yellow-700 shadow-[0_6px_0_#b45309,0_10px_10px_rgba(0,0,0,0.3)] transform scale-105'
                     : 'bg-stone-200 border-stone-400 shadow-[0_4px_0_#a8a29e] hover:bg-amber-100 hover:border-amber-300 opacity-80'
                  }
                 `}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${mode === 'simulation' ? 'bg-white/20 border-white/30' : 'bg-stone-300 border-stone-400'}`}>
                   <Gamepad2 size={28} className={mode === 'simulation' ? 'text-yellow-900 fill-white/20' : 'text-stone-500'} />
                </div>
                <div className="text-left flex-1">
                  <span className={`block font-fredoka font-bold text-xl drop-shadow-md ${mode === 'simulation' ? 'text-yellow-900' : 'text-stone-600'}`}>Simulasi</span>
                  <span className={`text-xs font-baloo ${mode === 'simulation' ? 'text-yellow-800' : 'text-stone-500'}`}>Latihan Seru</span>
                </div>
                {mode === 'simulation' ? (
                   <div className="bg-yellow-600/20 p-1 rounded-full"><Unlock size={20} className="text-yellow-900" /></div>
                ) : (
                   <div className="bg-stone-300 p-1 rounded-full"><Unlock size={20} className="text-stone-400" /></div>
                )}
                 {mode === 'simulation' && <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-500 rotate-45 border-r-4 border-t-4 border-yellow-700" />}
              </button>
           </div>

           {/* Button: Kuis (UNLOCKED & ACTIVE) */}
           <div className="relative group perspective-1000">
              <button 
                onClick={() => onModeChange('quiz')}
                className={`w-full h-24 rounded-2xl border-4 flex items-center p-4 gap-4 transition-all duration-300 relative z-10
                  ${mode === 'quiz'
                     ? 'bg-gradient-to-r from-purple-500 to-fuchsia-600 border-purple-700 shadow-[0_6px_0_#7e22ce,0_10px_10px_rgba(0,0,0,0.3)] transform scale-105'
                     : 'bg-stone-200 border-stone-400 shadow-[0_4px_0_#a8a29e] hover:bg-purple-100 hover:border-purple-300 opacity-80'
                  }
                `}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${mode === 'quiz' ? 'bg-white/20 border-white/30' : 'bg-stone-300 border-stone-400'}`}>
                   <GraduationCap size={28} className={mode === 'quiz' ? 'text-white fill-white/20' : 'text-stone-500'} />
                </div>
                <div className="text-left flex-1">
                  <span className={`block font-fredoka font-bold text-xl drop-shadow-md ${mode === 'quiz' ? 'text-white' : 'text-stone-600'}`}>Kuis</span>
                  <span className={`text-xs font-baloo ${mode === 'quiz' ? 'text-purple-100' : 'text-stone-500'}`}>Uji Skill!</span>
                </div>
                {mode === 'quiz' ? (
                   <div className="bg-purple-700/30 p-1 rounded-full animate-pulse"><Star size={20} className="text-yellow-300 fill-yellow-300" /></div>
                ) : (
                   <div className="bg-stone-300 p-1 rounded-full"><Lock size={20} className="text-stone-400" /></div>
                )}
                {mode === 'quiz' && <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-fuchsia-600 rotate-45 border-r-4 border-t-4 border-purple-700" />}
              </button>
           </div>
           
           {/* Back/Home Button */}
           <button 
             onClick={onBack}
             className="mt-auto w-16 h-16 bg-red-500 rounded-full border-4 border-red-700 shadow-lg flex items-center justify-center hover:scale-110 transition-transform self-start"
           >
             <Home size={30} className="text-white" />
           </button>
        </div>


        {/* RIGHT SIDE: Content Board (Parchment/Wood) */}
        <div className="flex-1 relative perspective-1000 flex items-center">
          <div className="relative w-full aspect-[4/3] bg-[#fdf6e3] rounded-[3rem] border-[12px] border-[#8b5a2b] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_100px_rgba(139,90,43,0.2)] p-8 flex flex-col items-center justify-between transition-all overflow-hidden">
            
            {/* Wood Texture Detail */}
            <div className="absolute inset-0 rounded-[2.2rem] opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none" />
            
            {/* Nails in corners */}
            <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-[#5d4037] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),1px_1px_2px_rgba(0,0,0,0.5)]" />
            <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-[#5d4037] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),1px_1px_2px_rgba(0,0,0,0.5)]" />
            <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-[#5d4037] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),1px_1px_2px_rgba(0,0,0,0.5)]" />
            <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-[#5d4037] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),1px_1px_2px_rgba(0,0,0,0.5)]" />

            {/* CONTENT RENDERER SWITCHER */}
            {mode === 'learning' ? (
              <>
                 {/* HEADER */}
                 {getContentText()}

                 {/* VISUAL COMPONENT */}
                 <div className="flex-1 flex items-center justify-center w-full my-2">
                    {renderLearningVisuals()}
                 </div>

                 {/* FOOTER NAVIGATION */}
                 <div className="w-full flex justify-between items-center mt-4">
                  {/* Prev Button */}
                  <button 
                    onClick={handlePrev}
                    disabled={slideIndex === 0}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full font-fredoka font-bold text-xl transition-all ${slideIndex === 0 ? 'opacity-0 pointer-events-none' : 'bg-stone-300 text-stone-600 hover:bg-stone-400'}`}
                  >
                    <ArrowLeft size={24} strokeWidth={3} />
                    Kembali
                  </button>

                  {/* Progress Dots */}
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`w-3 h-3 rounded-full transition-all ${i === slideIndex ? 'bg-[#8b5a2b] scale-125' : 'bg-[#8b5a2b]/30'}`} />
                    ))}
                  </div>

                  {/* Next Button */}
                  <button 
                     onClick={handleNext}
                     disabled={slideIndex === 5}
                     className={`group flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-[0_4px_0_#15803d] active:shadow-none active:translate-y-1 transition-all ${slideIndex === 5 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                  >
                    <span className="font-fredoka font-bold text-xl">Lanjut</span>
                    <div className="bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition-transform">
                      <ArrowRight size={24} strokeWidth={3} />
                    </div>
                  </button>
                 </div>
              </>
            ) : mode === 'simulation' ? (
              // SIMULATION MODE
              renderSimulationVisuals()
            ) : (
              // QUIZ MODE
              renderQuizVisuals()
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default TimeAdventure;