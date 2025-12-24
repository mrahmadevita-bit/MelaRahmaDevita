import React, { useState, useEffect } from 'react';
import Background from './components/Background';
import PlayerProfile from './components/PlayerProfile';
import AvatarSelector from './components/AvatarSelector';
import GuideCharacter from './components/GuideCharacter';
import MenuButtons from './components/MenuButtons';
import TimeAdventure from './components/TimeAdventure';
import WeightAdventure from './components/WeightAdventure'; // Import new component
import { TimeOfDay, PlayerProfile as PlayerProfileType, AvatarType, AdventureMode } from './types';
import { DEFAULT_PROFILE } from './constants';
import { SunMoon } from 'lucide-react';

type ViewState = 'LOBBY' | 'TIME_ADVENTURE' | 'WEIGHT_ADVENTURE';

const App: React.FC = () => {
  // --- State Management ---
  // Start specifically at 'morning' as requested, regardless of real time
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [profile, setProfile] = useState<PlayerProfileType>(DEFAULT_PROFILE);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [currentView, setCurrentView] = useState<ViewState>('LOBBY');
  const [adventureMode, setAdventureMode] = useState<AdventureMode>('learning');
  
  // Track the current lesson slide index to coordinate character animations
  const [currentLessonStep, setCurrentLessonStep] = useState(0);

  // --- Logic: Simulated Time Cycle ---
  useEffect(() => {
    // Sequence of time
    const timeCycle: TimeOfDay[] = ['morning', 'noon', 'afternoon', 'night'];
    
    // Set initial state
    setIsLoaded(true);

    // Cycle through the day every 20 seconds (simulating time passing)
    const interval = setInterval(() => {
      // PAUSE AUTOMATIC CYCLE IF IN TIME SIMULATION
      // This allows the simulation to control the background manually
      if (currentView === 'TIME_ADVENTURE' && adventureMode === 'simulation') {
        return;
      }

      setTimeOfDay((prevTime) => {
        const currentIndex = timeCycle.indexOf(prevTime);
        const nextIndex = (currentIndex + 1) % timeCycle.length;
        return timeCycle[nextIndex];
      });
    }, 20000); // 20 seconds per phase

    return () => clearInterval(interval);
  }, [currentView, adventureMode]); // Add dependencies to react to mode changes

  // --- Logic: Load Profile from LocalStorage ---
  useEffect(() => {
    const savedProfile = localStorage.getItem('mathAdventureProfile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Failed to parse profile', e);
      }
    }
  }, []);

  // --- Logic: Save Profile ---
  const handleUpdateName = (name: string) => {
    const newProfile = { ...profile, name };
    setProfile(newProfile);
    localStorage.setItem('mathAdventureProfile', JSON.stringify(newProfile));
  };

  const handleUpdateAvatar = (avatar: AvatarType) => {
    const newProfile = { ...profile, avatar };
    setProfile(newProfile);
    localStorage.setItem('mathAdventureProfile', JSON.stringify(newProfile));
  };

  // Logic for Character Positioning
  const getCharacterPositionClass = () => {
    if (currentView === 'LOBBY') return '';
    // Both Time and Weight modes follow similar sidekick logic
    if (adventureMode === 'simulation' || adventureMode === 'quiz') return 'translate-x-[250%] translate-y-[5%]'; 
    return 'translate-x-[20%] translate-y-[5%]'; // Learning mode position
  };

  if (!isLoaded) return null;

  return (
    <div className="relative w-full h-screen overflow-hidden select-none font-sans">
      
      {/* 1. Dynamic Background Layer */}
      {/* Pass theme='garden' if in Weight Adventure */}
      <Background timeOfDay={timeOfDay} theme={currentView === 'WEIGHT_ADVENTURE' ? 'garden' : 'default'} />

      {/* 1.5 Backdrop Blur for Sub-menus */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-md z-0 transition-opacity duration-500 ${currentView !== 'LOBBY' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
      />

      {/* 2. UI Layer */}
      <div className="relative z-10 w-full h-full p-4 md:p-8">
        
        {/* Top Left: Player Profile (Always Visible) */}
        <PlayerProfile 
          profile={profile} 
          onUpdateName={handleUpdateName}
          onAvatarClick={() => setIsAvatarModalOpen(true)}
        />

        {/* Left/Bottom: Interactive Guide */}
        <div className={`transition-all duration-700 ease-in-out ${getCharacterPositionClass()}`}>
           <GuideCharacter 
             playerName={profile.name} 
             lessonStep={currentView !== 'LOBBY' ? currentLessonStep : -1}
             adventureMode={currentView !== 'LOBBY' ? adventureMode : undefined}
             adventureType={currentView === 'WEIGHT_ADVENTURE' ? 'weight' : 'time'}
             timeOfDay={timeOfDay}
           />
        </div>

        {/* VIEW: LOBBY */}
        {currentView === 'LOBBY' && (
           <MenuButtons 
             isNight={timeOfDay === 'night'} 
             onTimeAdventureClick={() => {
               setCurrentView('TIME_ADVENTURE');
               setAdventureMode('learning');
               setCurrentLessonStep(0);
               setTimeOfDay('morning'); // Reset to morning when entering
             }}
             onWeightAdventureClick={() => {
                setCurrentView('WEIGHT_ADVENTURE');
                setAdventureMode('learning');
                setCurrentLessonStep(0);
                setTimeOfDay('noon'); // Garden looks nice at noon
             }}
           />
        )}

        {/* VIEW: TIME ADVENTURE */}
        {currentView === 'TIME_ADVENTURE' && (
          <TimeAdventure 
            mode={adventureMode}
            onModeChange={setAdventureMode}
            onBack={() => {
              setCurrentView('LOBBY');
              setCurrentLessonStep(0);
              setAdventureMode('learning');
              setTimeOfDay('morning');
            }} 
            onSlideChange={setCurrentLessonStep}
            setTimeOfDay={setTimeOfDay}
          />
        )}

        {/* VIEW: WEIGHT ADVENTURE */}
        {currentView === 'WEIGHT_ADVENTURE' && (
          <WeightAdventure
            mode={adventureMode}
            onModeChange={setAdventureMode}
            onBack={() => {
              setCurrentView('LOBBY');
              setCurrentLessonStep(0);
              setAdventureMode('learning');
              setTimeOfDay('morning');
            }}
            onSlideChange={setCurrentLessonStep}
          />
        )}
        
      </div>

      {/* 3. Modal Layer */}
      <AvatarSelector 
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSelect={handleUpdateAvatar}
        currentAvatar={profile.avatar}
      />

      {/* --- Global Lighting Overlays --- */}
      <div 
        className={`pointer-events-none fixed inset-0 bg-indigo-950/40 z-20 mix-blend-multiply transition-opacity duration-1000 ${timeOfDay === 'night' ? 'opacity-100' : 'opacity-0'}`} 
      />
      <div 
        className={`pointer-events-none fixed inset-0 bg-orange-500/20 z-20 mix-blend-overlay transition-opacity duration-1000 ${timeOfDay === 'afternoon' ? 'opacity-100' : 'opacity-0'}`} 
      />
      <div 
        className={`pointer-events-none fixed inset-0 bg-gradient-to-t from-red-500/10 to-transparent z-20 mix-blend-soft-light transition-opacity duration-1000 ${timeOfDay === 'afternoon' ? 'opacity-100' : 'opacity-0'}`} 
      />

    </div>
  );
};

export default App;