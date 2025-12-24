import React, { useState, useEffect } from 'react';
import { BookOpen, Gamepad2, GraduationCap, Lock, ArrowRight, ArrowLeft, Home, Clock, Unlock, MoveDown, MoveUp, RefreshCcw, Check, X, Star, Coins, Scale } from 'lucide-react';
import { AdventureMode } from '../types';

interface Props {
  onBack: () => void;
  onSlideChange: (step: number) => void;
  mode: AdventureMode;
  onModeChange: (mode: AdventureMode) => void;
}

// --- DATA FOR SIMULATIONS ---

// Game 1: Sorting (Kitchen Scale vs Market Scale)
const SORTING_ITEMS = [
  { id: 'pepper', name: 'Bubuk Lada', type: 'light', emoji: '🧂', color: 'bg-stone-200' },
  { id: 'watermelon', name: 'Semangka', type: 'heavy', emoji: '🍉', color: 'bg-green-200' },
  { id: 'sugar', name: 'Gula Pasir', type: 'light', emoji: '🍬', color: 'bg-white' },
  { id: 'rice', name: 'Karung Beras', type: 'heavy', emoji: '🌾', color: 'bg-amber-100' },
  { id: 'cloves', name: 'Cengkeh', type: 'light', emoji: '🍂', color: 'bg-orange-100' },
  { id: 'banana', name: 'Pisang', type: 'heavy', emoji: '🍌', color: 'bg-yellow-100' },
];

// Game 2: Comparison (Weights)
const WEIGHT_ITEMS = [
  { id: 'marble', name: 'Kelereng', weight: 10, emoji: '🔮', size: 'w-8 h-8' },
  { id: 'apple', name: 'Apel', weight: 150, emoji: '🍎', size: 'w-12 h-12' },
  { id: 'mango', name: 'Mangga', weight: 300, emoji: '🥭', size: 'w-14 h-14' },
  { id: 'melon', name: 'Melon', weight: 1500, emoji: '🍈', size: 'w-20 h-20' },
  { id: 'watermelon', name: 'Semangka', weight: 3000, emoji: '🍉', size: 'w-24 h-24' },
];

// --- DATA FOR QUIZ ---
const WEIGHT_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Jika timbangan bergerak TURUN ke satu sisi, artinya benda di sisi itu...",
    options: [
      { text: "Lebih Ringan", isCorrect: false, color: "bg-blue-500 border-blue-700 hover:bg-blue-400" },
      { text: "Lebih Berat", isCorrect: true, color: "bg-red-500 border-red-700 hover:bg-red-400" },
      { text: "Sama Berat", isCorrect: false, color: "bg-stone-500 border-stone-700 hover:bg-stone-400" }
    ]
  },
  {
    id: 2,
    question: "Satuan apa yang digunakan untuk menimbang benda RINGAN seperti bumbu dapur?",
    options: [
      { text: "Kilogram (Kg)", isCorrect: false, color: "bg-orange-500 border-orange-700 hover:bg-orange-400" },
      { text: "Meter (m)", isCorrect: false, color: "bg-purple-500 border-purple-700 hover:bg-purple-400" },
      { text: "Gram (g)", isCorrect: true, color: "bg-green-500 border-green-700 hover:bg-green-400" }
    ]
  }
];

const WeightAdventure: React.FC<Props> = ({ onBack, onSlideChange, mode, onModeChange }) => {
  // Learning State
  const [slideIndex, setSlideIndex] = useState(0);

  // Simulation State
  const [simStage, setSimStage] = useState<'sorting' | 'comparison'>('sorting');
  
  // -- Sorting Game State --
  const [sortIndex, setSortIndex] = useState(0);
  const [sortFeedback, setSortFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [completedSort, setCompletedSort] = useState(false);

  // -- Comparison Game State --
  const [leftPan, setLeftPan] = useState<typeof WEIGHT_ITEMS[0] | null>(null);
  const [rightPan, setRightPan] = useState<typeof WEIGHT_ITEMS[0] | null>(null);
  const [scaleTilt, setScaleTilt] = useState(0); // Degrees: negative = left down, positive = right down

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Reset states when mode changes
  useEffect(() => {
    if (mode === 'learning') {
      setSlideIndex(0);
      onSlideChange(0);
    } else if (mode === 'simulation') {
      setSimStage('sorting');
      setSortIndex(0);
      setCompletedSort(false);
      setLeftPan(null);
      setRightPan(null);
    } else if (mode === 'quiz') {
      setQuizIndex(0);
      setQuizScore(0);
      setQuizFinished(false);
    }
  }, [mode]);

  // Handle Tilt Calculation for Comparison Game
  useEffect(() => {
    const leftW = leftPan ? leftPan.weight : 0;
    const rightW = rightPan ? rightPan.weight : 0;

    if (leftW === 0 && rightW === 0) {
      setScaleTilt(0);
    } else if (leftW > rightW) {
      setScaleTilt(-15); // Left heavier -> rotates counter-clockwise visually (but we want left side DOWN, which means entire plank rotates negative? Let's check css logic. Usually negative rotate moves left side down if origin is center)
    } else if (rightW > leftW) {
      setScaleTilt(15); // Right heavier
    } else {
      setScaleTilt(0); // Equal
    }
  }, [leftPan, rightPan]);


  const handleNext = () => {
    if (slideIndex < 4) {
        setSlideIndex(prev => prev + 1);
        onSlideChange(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
        setSlideIndex(prev => prev - 1);
        onSlideChange(prev => prev - 1);
    }
  };

  // --- Sorting Game Logic ---
  const handleSortChoice = (choice: 'light' | 'heavy') => {
    if (sortFeedback !== null) return; // Prevent double click

    const currentItem = SORTING_ITEMS[sortIndex];
    if (currentItem.type === choice) {
      setSortFeedback('correct');
      setTimeout(() => {
        setSortFeedback(null);
        if (sortIndex < SORTING_ITEMS.length - 1) {
          setSortIndex(prev => prev + 1);
        } else {
          setCompletedSort(true);
        }
      }, 1500);
    } else {
      setSortFeedback('wrong');
      setTimeout(() => setSortFeedback(null), 1000);
    }
  };

  // --- Quiz Logic ---
  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setQuizScore(prev => prev + 10);
    }
    
    // Slight delay before next question
    setTimeout(() => {
      if (quizIndex < WEIGHT_QUIZ_QUESTIONS.length - 1) {
        setQuizIndex(prev => prev + 1);
      } else {
        setQuizFinished(true);
      }
    }, 500);
  };

  // --- RENDERERS ---

  const renderHumanScaleVisual = () => {
      return (
        <div className="w-full h-full flex flex-col items-center pt-8 relative">
            {/* Title & Explanation */}
            <div className="w-full text-center z-10 flex flex-col items-center gap-4">
                <h1 className="font-fredoka font-extrabold text-5xl text-[#8b5a2b] tracking-wider drop-shadow-sm">
                  Apa itu Berat?
                </h1>
                <div className="bg-white/60 backdrop-blur-sm px-8 py-3 rounded-2xl border-4 border-[#8b5a2b]/20 shadow-sm">
                    <p className="font-baloo font-bold text-stone-700 text-2xl">
                      Berat adalah gaya tarik bumi pada benda.
                    </p>
                </div>
            </div>

            {/* MAIN COMPARISON AREA */}
            <div className="flex-1 w-full flex justify-center items-center gap-2 sm:gap-16 mt-4 relative">
                
                {/* LEFT SIDE: HEAVY (Watermelon) */}
                <div className="flex flex-col items-center gap-4 relative group w-1/3">
                     {/* Floating Arm Container - Enters from Left */}
                     <div className="relative w-48 h-40 flex items-center">
                        {/* The Arm (Coming from left side) */}
                        <div className="absolute -left-20 top-10 w-48 h-14 bg-orange-100 border-y-4 border-r-4 border-amber-900/10 rounded-r-full transform rotate-12 shadow-sm z-0" />
                        
                        {/* The Hand */}
                        <div className="absolute left-16 top-14 w-16 h-16 bg-orange-100 rounded-full border-4 border-orange-200 z-10 flex items-center justify-center shadow-md">
                            {/* Watermelon Prop */}
                            <div className="absolute top-8 left-0 w-32 h-24 bg-green-600 rounded-full border-4 border-green-800 overflow-hidden shadow-xl transform -rotate-12 origin-top">
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,#14532d_12px,#14532d_18px)] opacity-40" />
                            </div>
                        </div>
                     </div>

                     {/* Indicator */}
                     <div className="bg-white/90 p-3 sm:p-4 rounded-xl border-b-4 border-red-500 shadow-lg flex flex-col items-center gap-1 animate-bounce mt-16 sm:mt-10">
                        <MoveDown size={40} className="text-red-600" strokeWidth={4} />
                        <span className="font-fredoka font-black text-red-600 text-lg sm:text-xl uppercase">Berat = Turun</span>
                     </div>
                </div>

                {/* DIVIDER VS */}
                <div className="w-1 h-48 bg-stone-300/50 rounded-full" />

                {/* RIGHT SIDE: LIGHT (Bottle) */}
                <div className="flex flex-col items-center gap-4 relative group w-1/3">
                     {/* Floating Arm Container - Enters from Right */}
                     <div className="relative w-48 h-40 flex items-center justify-end">
                        {/* The Arm (Coming from right side) */}
                        <div className="absolute -right-20 bottom-10 w-48 h-14 bg-orange-100 border-y-4 border-l-4 border-amber-900/10 rounded-l-full transform -rotate-12 shadow-sm z-0" />
                        
                        {/* The Hand */}
                        <div className="absolute right-16 bottom-14 w-16 h-16 bg-orange-100 rounded-full border-4 border-orange-200 z-10 flex items-center justify-center shadow-md">
                            {/* Water Bottle Prop */}
                             <div className="absolute bottom-6 w-12 h-24 bg-blue-400/50 rounded-xl border-4 border-blue-400 flex flex-col items-center transform rotate-12 shadow-md backdrop-blur-sm">
                                <div className="w-full h-4 bg-blue-600 rounded-t-lg opacity-50" />
                                <div className="w-8 h-full bg-blue-300/30 mx-auto" />
                                <div className="absolute bottom-1 w-full h-3 bg-blue-600 opacity-50" />
                            </div>
                        </div>
                     </div>

                     {/* Indicator */}
                     <div className="bg-white/90 p-3 sm:p-4 rounded-xl border-b-4 border-green-500 shadow-lg flex flex-col items-center gap-1 animate-float mt-[-20px] text-center">
                        <MoveUp size={40} className="text-green-600" strokeWidth={4} />
                        <span className="font-fredoka font-black text-green-600 text-lg sm:text-xl uppercase">Ringan = Naik</span>
                        <span className="font-baloo font-bold text-green-700 text-xs sm:text-sm leading-none">(Mudah Diangkat)</span>
                     </div>
                </div>

            </div>
        </div>
      );
  };

  const renderBalanceScaleVisual = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center w-full my-2 relative z-10">
            {/* Title */}
             <div className="w-full text-center z-10 flex flex-col items-center gap-4 mb-4">
                <h1 className="font-fredoka font-extrabold text-5xl text-[#8b5a2b] tracking-wider drop-shadow-sm">
                  Berat dan Ringan
                </h1>
            </div>

            {/* Subtitle/Instruction */}
            <div className="bg-white/60 backdrop-blur-sm px-6 py-2 rounded-xl border-2 border-[#8b5a2b]/20 shadow-sm mb-8 text-center max-w-lg">
                <p className="font-baloo font-bold text-stone-700 text-xl">
                   Timbangan turun ke sisi benda yang <span className="text-red-600 font-black">LEBIH BERAT</span>.
                </p>
            </div>

            {/* SEESAW CONTAINER */}
            <div className="relative w-full max-w-lg h-64 flex flex-col justify-end items-center">
                 {/* The Seesaw Plank (Rotated) */}
                 <div className="absolute bottom-16 w-[110%] h-4 bg-amber-700 rounded-full border-b-4 border-amber-900 shadow-xl transform -rotate-12 origin-center transition-transform duration-1000 z-10">
                     {/* LEFT SIDE (Down/Heavy) */}
                     <div className="absolute -top-16 left-4 flex flex-col items-center transform rotate-12 origin-bottom">
                         <div className="relative w-24 h-20 bg-green-500 rounded-[2rem] border-b-4 border-green-800 shadow-lg overflow-hidden z-20">
                              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,#14532d_12px,#14532d_18px)] opacity-30" />
                              <div className="absolute top-2 left-2 w-4 h-2 bg-white/20 rounded-full" />
                         </div>
                         <div className="w-12 h-2 bg-amber-900 mt-[-2px] rounded-full" />
                         <div className="absolute -top-16 -left-10 bg-white/90 px-3 py-2 rounded-xl border-2 border-red-500 shadow-md animate-bounce">
                             <span className="font-fredoka font-black text-red-600 text-lg whitespace-nowrap">LEBIH BERAT</span>
                         </div>
                     </div>
                     {/* RIGHT SIDE (Up/Light) */}
                     <div className="absolute -top-12 right-4 flex flex-col items-center transform rotate-12 origin-bottom">
                         <div className="relative w-12 h-12 bg-red-500 rounded-full border-b-4 border-red-700 shadow-lg z-20 flex justify-center">
                              <div className="absolute -top-2 w-1 h-3 bg-amber-900" /> {/* Stem */}
                              <div className="absolute -top-2 right-2 w-4 h-2 bg-green-500 rounded-full rounded-bl-none transform -rotate-12" /> {/* Leaf */}
                              <div className="absolute top-2 left-2 w-3 h-2 bg-white/30 rounded-full" /> {/* Shine */}
                         </div>
                         <div className="w-12 h-2 bg-amber-900 mt-[-2px] rounded-full" />
                         <div className="absolute -top-16 -right-10 bg-white/90 px-3 py-2 rounded-xl border-2 border-green-500 shadow-md animate-float">
                             <span className="font-fredoka font-black text-green-600 text-lg whitespace-nowrap">LEBIH RINGAN</span>
                         </div>
                     </div>
                 </div>
                 {/* Fulcrum (Triangle Base) */}
                 <div className="relative z-20 flex flex-col items-center mt-[-1rem]">
                     <div className="w-4 h-4 bg-stone-400 rounded-full border-2 border-stone-600 shadow-sm z-30 absolute -top-2" />
                     <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[80px] border-b-[#5d4037] filter drop-shadow-lg" />
                     <div className="absolute -bottom-2 w-32 h-6 bg-green-600 rounded-full blur-sm opacity-50 z-0" />
                 </div>
            </div>
        </div>
    );
  };

  const renderAnimalSeesawVisual = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center w-full my-2 relative z-10">
            {/* Title / Signpost */}
            <div className="bg-amber-100 border-4 border-amber-300 px-6 py-4 rounded-xl shadow-lg mb-12 text-center max-w-lg relative transform -rotate-1">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-stone-400 rounded-full border-2 border-stone-500 shadow-sm" />
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-stone-400 rounded-full border-2 border-stone-500 shadow-sm" />
                <p className="font-fredoka font-black text-stone-700 text-2xl leading-tight">
                   <span className="text-orange-600">Kucing</span> LEBIH BERAT dari <span className="text-slate-500">Tikus</span>
                </p>
            </div>

            {/* SEESAW CONTAINER */}
            <div className="relative w-full max-w-lg h-64 flex flex-col justify-end items-center">
                 {/* Plank */}
                 <div className="absolute bottom-16 w-[110%] h-4 bg-blue-700 rounded-full border-b-4 border-blue-900 shadow-xl transform -rotate-12 origin-center transition-transform duration-1000 z-10">
                     {/* LEFT SIDE (Heavy/Down) - CAT */}
                     <div className="absolute -top-24 left-4 flex flex-col items-center transform rotate-12 origin-bottom">
                         <div className="relative w-24 h-24">
                             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-16 bg-orange-400 rounded-t-3xl rounded-b-2xl border-2 border-orange-600 shadow-sm" />
                             <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-14 bg-orange-300 rounded-2xl border-2 border-orange-500 shadow-sm z-10">
                                 <div className="absolute -top-3 left-0 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-orange-400" />
                                 <div className="absolute -top-3 right-0 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-orange-400" />
                                 <div className="absolute top-4 left-3 w-2 h-2 bg-black rounded-full" />
                                 <div className="absolute top-4 right-3 w-2 h-2 bg-black rounded-full" />
                                 <div className="absolute top-6 left-1/2 -translate-x-1/2 w-3 h-2 bg-pink-300 rounded-full" />
                                 <div className="absolute top-7 -left-2 w-6 h-0.5 bg-stone-800 rotate-12" />
                                 <div className="absolute top-7 -right-2 w-6 h-0.5 bg-stone-800 -rotate-12" />
                             </div>
                             <div className="absolute bottom-2 -left-4 w-8 h-8 border-4 border-orange-500 rounded-full border-t-transparent border-r-transparent transform rotate-45" />
                         </div>
                         <div className="w-12 h-2 bg-amber-900 mt-[-2px] rounded-full" />
                     </div>
                     {/* RIGHT SIDE (Light/Up) - MOUSE */}
                     <div className="absolute -top-16 right-4 flex flex-col items-center transform rotate-12 origin-bottom">
                        <div className="relative w-16 h-16">
                             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-10 bg-slate-400 rounded-t-full rounded-b-xl border-2 border-slate-600 shadow-sm" />
                             <div className="absolute top-0 left-0 w-6 h-6 bg-slate-500 rounded-full border border-slate-700" />
                             <div className="absolute top-0 right-0 w-6 h-6 bg-slate-500 rounded-full border border-slate-700" />
                             <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-8 bg-slate-300 rounded-full z-10 flex flex-col items-center pt-2">
                                 <div className="flex gap-2">
                                    <div className="w-1 h-1 bg-black rounded-full" />
                                    <div className="w-1 h-1 bg-black rounded-full" />
                                 </div>
                                 <div className="w-1 h-1 bg-pink-400 rounded-full mt-1" />
                             </div>
                             <div className="absolute bottom-0 -right-4 w-8 h-4 border-2 border-slate-500 rounded-full border-t-transparent border-l-transparent" />
                        </div>
                        <div className="w-12 h-2 bg-amber-900 mt-[-2px] rounded-full" />
                     </div>
                 </div>
                 {/* Fulcrum */}
                 <div className="relative z-20 flex flex-col items-center mt-[-1rem]">
                     <div className="w-4 h-4 bg-stone-400 rounded-full border-2 border-stone-600 shadow-sm z-30 absolute -top-2" />
                     <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[80px] border-b-[#5d4037] filter drop-shadow-lg" />
                     <div className="absolute -bottom-2 w-32 h-6 bg-green-600 rounded-full blur-sm opacity-50 z-0" />
                 </div>
            </div>
        </div>
    );
  }

  const renderStandardToolsVisual = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center w-full my-2 relative z-10">
             {/* Title */}
             <div className="w-full text-center z-10 mb-6 sm:mb-8">
                <h1 className="font-fredoka font-extrabold text-3xl sm:text-4xl text-[#8b5a2b] tracking-wider drop-shadow-sm">
                  Alat Ukur Baku
                </h1>
                <p className="font-baloo text-lg sm:text-xl text-stone-600 mt-2">
                    Gunakan timbangan yang tepat untuk benda yang diukur.
                </p>
            </div>

            <div className="flex items-end justify-center gap-4 sm:gap-12 w-full">
                {/* KITCHEN SCALE (Left) */}
                <div className="flex flex-col items-center gap-4 group">
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-end justify-center">
                        <div className="w-28 sm:w-32 h-20 sm:h-24 bg-red-500 rounded-xl shadow-lg relative z-10 flex items-center justify-center border-b-8 border-red-700">
                             <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full border-4 border-stone-200 shadow-inner relative">
                                 {[0, 90, 180, 270].map(deg => (
                                     <div key={deg} className="absolute top-1/2 left-1/2 w-full h-0.5 bg-stone-300 -translate-x-1/2 -translate-y-1/2" style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)`}} />
                                 ))}
                                 <div className="absolute top-1/2 left-1/2 w-1 h-6 sm:h-8 bg-red-600 origin-bottom -translate-x-1/2 -translate-y-full rotate-45 transition-transform group-hover:rotate-90" />
                                 <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-stone-800 rounded-full -translate-x-1/2 -translate-y-1/2" />
                             </div>
                        </div>
                        <div className="absolute bottom-20 sm:bottom-24 w-16 sm:w-20 h-4 bg-stone-300" />
                        <div className="absolute bottom-24 sm:bottom-28 w-32 sm:w-40 h-12 sm:h-16 bg-stone-100 border-2 border-stone-300 rounded-b-[2rem] sm:rounded-b-[3rem] rounded-t-lg shadow-sm flex items-end justify-center overflow-hidden">
                             <div className="w-12 sm:w-16 h-10 sm:h-14 bg-white border border-stone-200 rounded-sm relative transform -rotate-6 translate-y-2">
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] sm:text-[10px] font-bold text-stone-400">TEPUNG</span>
                             </div>
                             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-600 rounded-full absolute bottom-4 right-6 sm:right-8 transform rotate-12" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 90%, 0% 100%)' }} /> 
                             <div className="w-1.5 h-4 sm:w-2 sm:h-6 bg-red-600 rounded-full absolute bottom-2 right-5 sm:right-6 transform -rotate-45" />
                        </div>
                    </div>
                    <div className="bg-white/90 px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-b-4 border-red-500 text-center shadow-md w-full max-w-[150px] sm:max-w-none">
                        <span className="block font-fredoka font-black text-red-600 text-lg sm:text-xl leading-none sm:leading-normal">Timbangan Kue</span>
                        <span className="text-[10px] sm:text-xs font-bold text-stone-500 uppercase tracking-wide">Untuk Benda RINGAN (Gram)</span>
                    </div>
                </div>

                {/* MARKET SCALE (Right) */}
                <div className="flex flex-col items-center gap-4 group">
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-end justify-center">
                        <div className="w-32 sm:w-36 h-12 sm:h-16 bg-emerald-700 rounded-lg shadow-xl relative z-10 border-b-8 border-emerald-900 flex items-center justify-between px-4">
                             <div className="w-8 sm:w-10 h-2 bg-stone-400 rounded-full shadow-sm" />
                             <div className="w-12 sm:w-16 h-3 sm:h-4 bg-emerald-800 rounded-full" />
                        </div>
                        <div className="absolute bottom-12 sm:bottom-16 left-2 w-3 sm:w-4 h-12 sm:h-16 bg-stone-400 transform -rotate-12 origin-bottom z-0" />
                        <div className="absolute bottom-24 sm:bottom-28 left-[-5px] sm:left-[-10px] w-32 sm:w-40 h-8 sm:h-10 bg-zinc-300 rounded-b-full border-b-4 border-zinc-400 shadow-md flex justify-center items-end z-20 overflow-visible">
                            <div className="w-16 sm:w-20 h-20 sm:h-24 bg-[#d4a373] rounded-xl border-2 border-[#a98467] relative -mb-4 transform rotate-3 flex items-center justify-center shadow-inner">
                                <div className="w-full border-t border-dashed border-[#a98467] absolute top-4" />
                                <span className="font-black text-[#5d4037]/50 text-base sm:text-xl">BERAS</span>
                            </div>
                            <div className="absolute -right-2 bottom-4 w-10 sm:w-12 h-10 sm:h-12">
                                <div className="absolute w-1.5 sm:w-2 h-8 sm:h-10 bg-yellow-400 rounded-full border border-yellow-600 transform rotate-12 left-0" />
                                <div className="absolute w-1.5 sm:w-2 h-8 sm:h-10 bg-yellow-400 rounded-full border border-yellow-600 transform -rotate-12 left-2" />
                                <div className="absolute w-1.5 sm:w-2 h-8 sm:h-10 bg-yellow-400 rounded-full border border-yellow-600 transform rotate-45 left-4" />
                            </div>
                        </div>
                        <div className="absolute bottom-12 sm:bottom-16 right-4 sm:right-6 flex items-end">
                            <div className="w-5 sm:w-6 h-6 sm:h-8 bg-amber-600 rounded-t-md border-r-2 border-amber-800 shadow-sm z-20" />
                            <div className="w-6 sm:w-8 h-8 sm:h-10 bg-amber-600 rounded-t-md border-r-2 border-amber-800 shadow-sm -ml-2 z-10" />
                        </div>
                    </div>
                    <div className="bg-white/90 px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-b-4 border-emerald-500 text-center shadow-md w-full max-w-[150px] sm:max-w-none">
                        <span className="block font-fredoka font-black text-emerald-600 text-lg sm:text-xl leading-none sm:leading-normal">Timbangan Pasar</span>
                        <span className="text-[10px] sm:text-xs font-bold text-stone-500 uppercase tracking-wide">Untuk Benda BERAT (Kg)</span>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  const renderUnitConversionVisual = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center w-full my-2 relative z-10 gap-6">
             {/* Title */}
             <div className="w-full text-center">
                <h1 className="font-fredoka font-extrabold text-3xl sm:text-4xl text-[#8b5a2b] tracking-wider drop-shadow-sm">
                  Kilogram & Gram
                </h1>
            </div>

            {/* VISUAL: 1 Kg Weight vs 1000g Sack on a Balance */}
            <div className="relative w-full max-w-lg h-48 flex items-end justify-center mb-4">
                {/* The Balance Beam */}
                <div className="absolute bottom-12 w-3/4 h-3 bg-stone-600 rounded-full z-10" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-14 bg-stone-500 rounded-t-lg z-0" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-stone-700 rounded-full z-0" />
                
                {/* Left Pan (Kg) */}
                <div className="absolute bottom-12 left-[15%] flex flex-col items-center">
                    <div className="w-24 h-24 bg-transparent flex items-end justify-center relative top-2">
                         <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg border-2 border-slate-500 shadow-lg flex items-center justify-center relative z-20">
                             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 border-4 border-slate-600 rounded-t-full" />
                             <span className="font-fredoka font-black text-white text-xl">1 Kg</span>
                         </div>
                    </div>
                    <div className="w-24 h-4 bg-stone-400 rounded-b-full border-b-2 border-stone-500 relative z-10" />
                    <div className="w-0.5 h-12 bg-stone-400 absolute bottom-4 left-0 origin-bottom rotate-12" />
                    <div className="w-0.5 h-12 bg-stone-400 absolute bottom-4 right-0 origin-bottom -rotate-12" />
                </div>
                {/* Right Pan (1000g) */}
                <div className="absolute bottom-12 right-[15%] flex flex-col items-center">
                     <div className="w-24 h-24 bg-transparent flex items-end justify-center relative top-2">
                         <div className="w-20 h-20 bg-[#f5f5dc] rounded-2xl rounded-tr-none border-2 border-[#e6e6bd] shadow-lg flex items-center justify-center relative z-20 transform rotate-3">
                             <div className="absolute -top-2 right-0 w-6 h-6 bg-[#f5f5dc] rounded-full border-2 border-[#e6e6bd]" />
                             <span className="font-fredoka font-black text-amber-900 text-lg leading-tight text-center">1.000<br/><span className="text-sm">Gram</span></span>
                         </div>
                    </div>
                    <div className="w-24 h-4 bg-stone-400 rounded-b-full border-b-2 border-stone-500 relative z-10" />
                     <div className="w-0.5 h-12 bg-stone-400 absolute bottom-4 left-0 origin-bottom rotate-12" />
                    <div className="w-0.5 h-12 bg-stone-400 absolute bottom-4 right-0 origin-bottom -rotate-12" />
                </div>
                {/* Equality Sign */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white/80 px-4 py-1 rounded-full border-2 border-green-500 shadow-sm animate-pulse">
                    <span className="font-fredoka font-black text-green-600 text-xl">=</span>
                </div>
            </div>
            {/* INFO CARDS */}
            <div className="flex gap-4 w-full max-w-xl">
                <div className="flex-1 bg-blue-50 border-2 border-blue-200 p-3 rounded-xl flex flex-col items-center gap-2 shadow-sm">
                    <span className="font-fredoka font-bold text-blue-800 text-lg">1 Kilogram</span>
                    <div className="w-full h-1 bg-blue-200 rounded-full" />
                    <span className="font-baloo text-center text-blue-900 text-sm leading-tight">
                        Untuk benda <strong className="text-blue-700">BERAT</strong>.<br/>(Beras, Semangka)
                    </span>
                </div>
                <div className="flex-1 bg-orange-50 border-2 border-orange-200 p-3 rounded-xl flex flex-col items-center gap-2 shadow-sm">
                    <span className="font-fredoka font-bold text-orange-800 text-lg">1.000 Gram</span>
                    <div className="w-full h-1 bg-orange-200 rounded-full" />
                     <span className="font-baloo text-center text-orange-900 text-sm leading-tight">
                        Untuk benda <strong className="text-orange-700">RINGAN</strong>.<br/>(Emas, Bumbu)
                    </span>
                </div>
            </div>
             <div className="bg-yellow-100 border-l-4 border-yellow-500 px-4 py-2 rounded-r-xl max-w-lg">
                <p className="font-baloo text-stone-700 font-bold">
                    Kenapa 1 Kg lebih berat dari 1 Gram? <br/>
                    Karena <span className="text-red-600">1 Kg itu isinya ada 1.000 Gram!</span>
                </p>
            </div>
        </div>
    );
  }

  // --- SIMULATION RENDERERS ---

  const renderSimulationSorting = () => {
    if (completedSort) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-6 animate-pop">
           <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-lg animate-bounce">
              <Check size={64} className="text-white" strokeWidth={4} />
           </div>
           <h2 className="text-4xl font-fredoka font-extrabold text-[#8b5a2b] text-center">Hebat Sekali!</h2>
           <p className="text-xl font-baloo text-stone-600 text-center max-w-md">
             Kamu sudah bisa membedakan benda ringan dan benda berat!
           </p>
           <button 
             onClick={() => setSimStage('comparison')} 
             className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-fredoka font-bold text-xl shadow-[0_4px_0_#15803d] active:shadow-none active:translate-y-1 transition-all flex items-center gap-3"
           >
             Lanjut Main <ArrowRight size={24} />
           </button>
        </div>
      );
    }

    const currentItem = SORTING_ITEMS[sortIndex];

    return (
      <div className="flex flex-col items-center w-full h-full relative pt-2">
         {/* Instruction */}
         <div className="bg-white/80 px-6 py-2 rounded-full border-2 border-[#8b5a2b] mb-4 shadow-sm">
            <p className="font-fredoka font-bold text-stone-700 text-lg sm:text-xl">
               Pilih timbangan yang pas!
            </p>
         </div>

         {/* Draggable Item (Center) */}
         <div className="flex-1 flex items-center justify-center relative w-full mb-6">
            <div className={`w-32 h-32 ${currentItem.color} rounded-2xl border-4 border-stone-300 shadow-xl flex flex-col items-center justify-center gap-2 animate-float cursor-grab active:cursor-grabbing z-20`}>
               <span className="text-5xl filter drop-shadow-sm">{currentItem.emoji}</span>
               <span className="font-baloo font-bold text-stone-700 text-center leading-none text-sm px-2">{currentItem.name}</span>
            </div>
            
            {/* Feedback Overlay */}
            {sortFeedback && (
              <div className={`absolute inset-0 flex items-center justify-center z-30 animate-pop`}>
                  {sortFeedback === 'correct' ? (
                     <div className="bg-green-500 text-white p-4 rounded-full shadow-lg border-4 border-white"><Check size={48} strokeWidth={4}/></div>
                  ) : (
                     <div className="bg-red-500 text-white p-4 rounded-full shadow-lg border-4 border-white"><X size={48} strokeWidth={4}/></div>
                  )}
              </div>
            )}
         </div>

         {/* Drop Zones (Scales) */}
         <div className="w-full flex justify-around items-end gap-4 sm:gap-12 pb-4">
             {/* Kitchen Scale (Light) */}
             <button 
               onClick={() => handleSortChoice('light')}
               className="group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
             >
                <div className="relative w-32 h-32 flex items-end justify-center pointer-events-none">
                    <div className="w-20 h-16 bg-red-500 rounded-xl shadow-md relative z-10 flex items-center justify-center border-b-4 border-red-700">
                        <div className="w-12 h-12 bg-white rounded-full border-2 border-stone-200 relative">
                             <div className="absolute top-1/2 left-1/2 w-0.5 h-5 bg-red-600 origin-bottom -translate-x-1/2 -translate-y-full rotate-12" />
                        </div>
                    </div>
                    <div className="absolute bottom-16 w-24 h-8 bg-stone-100 border-2 border-stone-300 rounded-b-xl shadow-sm" />
                </div>
                <div className="bg-white/90 px-3 py-1 rounded-lg border-2 border-red-400 mt-2">
                   <span className="font-fredoka font-bold text-red-600 text-sm">Benda Ringan</span>
                </div>
             </button>

             {/* Market Scale (Heavy) */}
             <button 
               onClick={() => handleSortChoice('heavy')}
               className="group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
             >
                 <div className="relative w-32 h-32 flex items-end justify-center pointer-events-none">
                    <div className="w-24 h-12 bg-emerald-700 rounded-lg shadow-md relative z-10 border-b-4 border-emerald-900 flex items-center justify-between px-2">
                       <div className="w-8 h-2 bg-stone-400 rounded-full" />
                    </div>
                    <div className="absolute bottom-10 left-[-5px] w-24 h-6 bg-zinc-300 rounded-b-full border-b-4 border-zinc-400 shadow-sm flex justify-center items-end z-20" />
                    <div className="absolute bottom-12 right-2 flex items-end">
                       <div className="w-4 h-6 bg-amber-600 rounded-t-sm border-r border-amber-800" />
                    </div>
                 </div>
                 <div className="bg-white/90 px-3 py-1 rounded-lg border-2 border-emerald-400 mt-2">
                   <span className="font-fredoka font-bold text-emerald-600 text-sm">Benda Berat</span>
                </div>
             </button>
         </div>
      </div>
    );
  };

  const renderSimulationComparison = () => {
    return (
      <div className="flex flex-col items-center w-full h-full relative pt-2">
          {/* Header */}
          <div className="w-full flex justify-between items-start px-2">
             <button onClick={() => setSimStage('sorting')} className="bg-stone-200 hover:bg-stone-300 p-2 rounded-full">
                <ArrowLeft size={20} className="text-stone-600"/>
             </button>
             <div className="bg-white/80 px-4 py-1 rounded-full border-2 border-[#8b5a2b] shadow-sm">
                <p className="font-fredoka font-bold text-stone-700 text-base">
                   Bandingkan Berat Benda!
                </p>
             </div>
             <button onClick={() => { setLeftPan(null); setRightPan(null); }} className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full text-blue-600">
                <RefreshCcw size={20} />
             </button>
          </div>

          {/* BALANCE SCALE VISUALIZATION */}
          <div className="flex-1 w-full flex items-end justify-center mb-20 relative">
              {/* Scale Structure */}
              <div className="relative w-80 sm:w-96 h-40 flex items-end justify-center">
                  
                  {/* Plank (Rotates based on tilt) */}
                  <div 
                    className="absolute bottom-12 w-full h-3 bg-amber-800 rounded-full transition-transform duration-700 ease-out z-10 flex justify-between items-end px-4"
                    style={{ transform: `rotate(${scaleTilt}deg)` }}
                  >
                      {/* Left Pan Attachment */}
                      <div className="relative flex flex-col items-center transform -translate-y-full origin-bottom" style={{ transform: `translateY(100%) rotate(${-scaleTilt}deg)` }}>
                          {/* Pan String */}
                          <div className="h-16 w-0.5 bg-stone-400 relative -top-16">
                             {/* The Pan */}
                             <button 
                               onClick={() => { if(leftPan) setLeftPan(null); }} 
                               className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-8 bg-stone-300 border-b-4 border-stone-400 rounded-b-2xl flex items-end justify-center cursor-pointer hover:bg-stone-200 transition-colors"
                             >
                                {leftPan && (
                                   <div className={`absolute bottom-2 ${leftPan.size} animate-pop filter drop-shadow-md`}>
                                      <span className="text-4xl">{leftPan.emoji}</span>
                                   </div>
                                )}
                                {!leftPan && <div className="text-stone-400 font-bold text-xs mb-1 opacity-50">Kiri</div>}
                             </button>
                          </div>
                      </div>

                      {/* Right Pan Attachment */}
                      <div className="relative flex flex-col items-center transform -translate-y-full origin-bottom" style={{ transform: `translateY(100%) rotate(${-scaleTilt}deg)` }}>
                          {/* Pan String */}
                          <div className="h-16 w-0.5 bg-stone-400 relative -top-16">
                             {/* The Pan */}
                             <button 
                               onClick={() => { if(rightPan) setRightPan(null); }} 
                               className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-8 bg-stone-300 border-b-4 border-stone-400 rounded-b-2xl flex items-end justify-center cursor-pointer hover:bg-stone-200 transition-colors"
                             >
                                {rightPan && (
                                   <div className={`absolute bottom-2 ${rightPan.size} animate-pop filter drop-shadow-md`}>
                                      <span className="text-4xl">{rightPan.emoji}</span>
                                   </div>
                                )}
                                {!rightPan && <div className="text-stone-400 font-bold text-xs mb-1 opacity-50">Kanan</div>}
                             </button>
                          </div>
                      </div>
                  </div>

                  {/* Base / Fulcrum */}
                  <div className="absolute bottom-0 w-8 h-14 bg-stone-600 rounded-t-full border-b-4 border-stone-800 z-0" />
              </div>
          </div>

          {/* INVENTORY / ITEM PICKER */}
          <div className="w-full bg-stone-200/90 rounded-t-3xl border-t-4 border-stone-400 p-4 absolute bottom-0">
             <p className="text-center font-baloo font-bold text-stone-500 text-sm mb-2">Klik benda untuk meletakkannya!</p>
             <div className="flex gap-4 overflow-x-auto pb-2 justify-center">
                 {WEIGHT_ITEMS.map((item) => (
                    <div key={item.id} className="flex flex-col items-center gap-1 shrink-0 group">
                       <div className="w-16 h-16 bg-white rounded-xl border-2 border-stone-300 shadow-sm flex items-center justify-center text-3xl cursor-pointer hover:scale-110 hover:border-blue-400 transition-all active:scale-95 relative">
                          {item.emoji}
                          
                          {/* Click Actions Overlay */}
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 rounded-xl flex flex-col">
                             <button onClick={() => setLeftPan(item)} className="flex-1 w-full bg-blue-500/80 text-white text-[10px] font-bold flex items-center justify-center rounded-t-lg hover:bg-blue-600">
                                Kiri
                             </button>
                             <button onClick={() => setRightPan(item)} className="flex-1 w-full bg-green-500/80 text-white text-[10px] font-bold flex items-center justify-center rounded-b-lg hover:bg-green-600">
                                Kanan
                             </button>
                          </div>
                       </div>
                       <span className="text-xs font-bold text-stone-600">{item.name}</span>
                    </div>
                 ))}
             </div>
          </div>
      </div>
    );
  };

  const renderQuizVisuals = () => {
    const currentQuiz = WEIGHT_QUIZ_QUESTIONS[quizIndex];
    
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
               Soal {quizIndex + 1} / {WEIGHT_QUIZ_QUESTIONS.length}
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

             {/* Scale Icon Visual */}
             <div className="relative w-32 h-32 flex items-center justify-center">
                 <div className="absolute inset-0 bg-purple-200 rounded-full animate-pulse opacity-50" />
                 <Scale size={80} className="text-purple-600 relative z-10" />
             </div>

             {/* Answer Buttons */}
             <div className="flex gap-4 w-full justify-center">
                {currentQuiz.options.map((opt, idx) => (
                   <button 
                     key={idx}
                     onClick={() => handleQuizAnswer(opt.isCorrect)}
                     className={`flex-1 max-w-[180px] py-4 rounded-xl text-white font-fredoka font-bold text-lg sm:text-2xl shadow-[0_6px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 transition-all border-b-4 ${opt.color}`}
                   >
                     {opt.text}
                   </button>
                ))}
             </div>

          </div>
       </div>
    );
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 sm:p-8 animate-pop">
      
      <div className="flex w-full h-full max-w-6xl gap-6 sm:gap-10">
        
        {/* LEFT SIDEBAR: Navigation */}
        <div className="flex flex-col gap-4 w-1/4 min-w-[200px] mt-20 sm:mt-0 justify-center">
           
           {/* COLLAPSED: Time Adventure (Inactive) */}
           <div className="relative group opacity-80 hover:opacity-100">
              <button 
                onClick={onBack} 
                className="w-full h-16 bg-amber-100 rounded-xl border-4 border-amber-300 flex items-center px-4 gap-3 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-300">
                   <Clock size={20} className="text-blue-500" />
                </div>
                <div className="text-left">
                  <span className="block font-fredoka font-bold text-amber-800 text-sm">Petualangan Waktu</span>
                </div>
              </button>
           </div>

           {/* EXPANDED: Weight Adventure (Active) */}
           <div className="w-full bg-stone-100/50 rounded-3xl p-3 flex flex-col gap-3 border-4 border-stone-300">
                <div className="flex items-center gap-2 px-2">
                    <span className="text-2xl">⚖️</span>
                    <span className="font-fredoka font-extrabold text-stone-700">Petualangan Berat</span>
                </div>

                {/* Sub-button 1: Belajar Dulu */}
                <button 
                    onClick={() => onModeChange('learning')}
                    className={`w-full h-16 rounded-xl border-2 flex items-center px-3 gap-3 transition-all relative
                    ${mode === 'learning' 
                        ? 'bg-blue-500 border-blue-700 shadow-md transform scale-105 z-10' 
                        : 'bg-stone-200 border-stone-400 hover:bg-stone-300'
                    }`}
                >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <BookOpen size={20} className={mode === 'learning' ? 'text-white' : 'text-stone-500'} />
                    </div>
                    <span className={`font-fredoka font-bold ${mode === 'learning' ? 'text-white' : 'text-stone-600'}`}>Belajar Dulu</span>
                </button>

                {/* Sub-button 2: Simulasi */}
                <button 
                    onClick={() => onModeChange('simulation')}
                    className={`w-full h-16 rounded-xl border-2 flex items-center px-3 gap-3 transition-all relative
                    ${mode === 'simulation'
                        ? 'bg-yellow-500 border-yellow-700 shadow-md transform scale-105 z-10'
                        : 'bg-stone-200 border-stone-400 hover:bg-stone-300'
                    }`}
                >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Gamepad2 size={20} className={mode === 'simulation' ? 'text-white' : 'text-stone-500'} />
                    </div>
                    <span className={`font-fredoka font-bold flex-1 text-left ${mode === 'simulation' ? 'text-white' : 'text-stone-600'}`}>Simulasi</span>
                    {mode === 'simulation' ? <Unlock size={16} className="text-white"/> : <Unlock size={16} className="text-stone-400"/>}
                </button>

                 {/* Sub-button 3: Kuis (UNLOCKED & ACTIVE) */}
                 <button 
                    onClick={() => onModeChange('quiz')}
                    className={`w-full h-16 rounded-xl border-2 flex items-center px-3 gap-3 transition-all relative
                    ${mode === 'quiz'
                       ? 'bg-purple-500 border-purple-700 shadow-md transform scale-105 z-10'
                       : 'bg-stone-200 border-stone-400 hover:bg-stone-300'
                    }
                 `}
                 >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <GraduationCap size={20} className={mode === 'quiz' ? 'text-white' : 'text-stone-500'} />
                    </div>
                    <span className={`font-fredoka font-bold flex-1 text-left ${mode === 'quiz' ? 'text-white' : 'text-stone-600'}`}>Kuis</span>
                    {mode === 'quiz' ? <Star size={16} className="text-yellow-300 fill-yellow-300 animate-pulse"/> : <Unlock size={16} className="text-stone-400"/>}
                </button>
           </div>
           
           {/* Home Button */}
           <button 
             onClick={onBack}
             className="mt-auto w-16 h-16 bg-red-500 rounded-full border-4 border-red-700 shadow-lg flex items-center justify-center hover:scale-110 transition-transform self-start"
           >
             <Home size={30} className="text-white" />
           </button>
        </div>


        {/* RIGHT SIDE: Content Board */}
        <div className="flex-1 relative perspective-1000 flex items-center">
          <div className="relative w-full aspect-[4/3] bg-[#fdf6e3] rounded-[3rem] border-[12px] border-[#8b5a2b] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_100px_rgba(139,90,43,0.2)] p-8 flex flex-col items-center justify-between transition-all overflow-hidden">
            
            {/* Wood Texture */}
            <div className="absolute inset-0 rounded-[2.2rem] opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none" />
            
            {/* CONTENT RENDERER SWITCHER */}
            {mode === 'learning' ? (
              <>
                 {/* VISUAL COMPONENT SWITCHER FOR LEARNING */}
                 {slideIndex === 0 && renderHumanScaleVisual()}
                 {slideIndex === 1 && renderBalanceScaleVisual()}
                 {slideIndex === 2 && renderAnimalSeesawVisual()}
                 {slideIndex === 3 && renderStandardToolsVisual()}
                 {slideIndex === 4 && renderUnitConversionVisual()}

                 {/* FOOTER NAVIGATION */}
                 <div className="w-full flex justify-between items-center mt-4 relative z-10">
                    {/* Prev */}
                    <button 
                        onClick={handlePrev}
                        disabled={slideIndex === 0}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full font-fredoka font-bold text-xl transition-all ${slideIndex === 0 ? 'opacity-0 pointer-events-none' : 'bg-stone-300 text-stone-600 hover:bg-stone-400'}`}
                      >
                        <ArrowLeft size={24} strokeWidth={3} />
                        Kembali
                    </button>

                     {/* Dots */}
                     <div className="flex gap-2">
                        {[0, 1, 2, 3, 4].map(i => (
                          <div key={i} className={`w-3 h-3 rounded-full transition-all ${i === slideIndex ? 'bg-[#8b5a2b] scale-125' : 'bg-[#8b5a2b]/30'}`} />
                        ))}
                      </div>

                    {/* Next */}
                    <button 
                      onClick={handleNext} 
                      disabled={slideIndex === 4}
                      className={`group flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full shadow-[0_4px_0_#15803d] active:shadow-none active:translate-y-1 transition-all ${slideIndex === 4 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
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
               simStage === 'sorting' ? renderSimulationSorting() : renderSimulationComparison()
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

export default WeightAdventure;
