import { useState, useEffect } from 'react';
import type { StatComparison, StatCategory } from '../../types';
import { STAT_CATEGORIES } from '../../utils/statCategories';

interface StatSlotMachineProps {
  isSpinning: boolean;
  selectedStat: StatComparison | null;
  phase: string;
  statChoices?: StatCategory[];
  onSpinComplete?: (choices: StatCategory[]) => void;
}

export default function StatSlotMachine({ isSpinning, selectedStat, phase, onSpinComplete }: StatSlotMachineProps) {
  const [reelPositions, setReelPositions] = useState([0, 0, 0]);
  const [displayStat, setDisplayStat] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [reelStates, setReelStates] = useState([false, false, false]); // Individual reel spinning states
  const [finalChoices, setFinalChoices] = useState<StatCategory[]>([]);


  useEffect(() => {
    if (isSpinning && !isAnimating && phase === 'slot_spinning') {
      setIsAnimating(true);
      setDisplayStat('🎰 SPINNING...');
      setReelStates([true, true, true]); // All reels start spinning
      
      // Generate final choices first
      const choices: StatCategory[] = [];
      const availableStats = [...STAT_CATEGORIES];
      
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * availableStats.length);
        choices.push(availableStats[randomIndex]);
        availableStats.splice(randomIndex, 1); // Remove to avoid duplicates
      }
      setFinalChoices(choices);
      
      // Start individual reel spinning with different stop times
      const reelStopTimes = [3000, 4000, 5000]; // Reel 1 stops at 3s, Reel 2 at 4s, Reel 3 at 5s
      
      // Spin each reel independently
      reelStopTimes.forEach((stopTime, reelIndex) => {
        let spinCount = 0;
        const maxSpins = Math.floor(stopTime / 150); // How many spins before stopping
        
        const spinReel = () => {
          if (spinCount < maxSpins) {
            // Keep spinning this reel
            setReelPositions(prev => {
              const newPositions = [...prev];
              newPositions[reelIndex] = Math.floor(Math.random() * STAT_CATEGORIES.length);
              return newPositions;
            });
            spinCount++;
            
            // Slower animation near the end
            const delay = spinCount > maxSpins - 10 ? 200 + (maxSpins - spinCount) * 50 : 150;
            setTimeout(spinReel, delay);
          } else {
            // Stop this reel on the final choice
            setReelPositions(prev => {
              const newPositions = [...prev];
              newPositions[reelIndex] = STAT_CATEGORIES.indexOf(choices[reelIndex]);
              return newPositions;
            });
            
            // Mark this reel as stopped
            setReelStates(prev => {
              const newStates = [...prev];
              newStates[reelIndex] = false;
              return newStates;
            });
          }
        };
        
        // Start spinning this reel
        setTimeout(spinReel, 100);
      });
      
      // After all reels stop, complete the animation
      setTimeout(() => {
        setDisplayStat('Choose your stat!');
        setIsAnimating(false);
        
        // Notify parent component
        if (onSpinComplete) {
          setTimeout(() => onSpinComplete(choices), 500);
        }
      }, 5500); // After the last reel stops
      
    } else if (selectedStat && !isSpinning) {
      setDisplayStat(selectedStat.category);
    }
  }, [isSpinning, phase, onSpinComplete]);

  // const getReelItem = (reelIndex: number, offset: number = 0) => {
  //   const position = (reelPositions[reelIndex] + offset) % STAT_CATEGORIES.length;
  //   return STAT_CATEGORIES[position]?.name || '???';
  // };

  // const getReelStat = (reelIndex: number) => {
  //   if (finalChoices.length > 0 && reelIndex < finalChoices.length) {
  //     return finalChoices[reelIndex];
  //   }
  //   const position = reelPositions[reelIndex] % STAT_CATEGORIES.length;
  //   return STAT_CATEGORIES[position];
  // };

  const getStatDescription = () => {
    if (selectedStat) {
      return selectedStat.description;
    }
    return isSpinning ? 'Rolling for random stat category...' : 'Waiting for battle to start...';
  };

  const getStatTypeIndicator = () => {
    if (!selectedStat) return null;
    
    return (
      <div className="mt-3">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          selectedStat.statType === 'higher_wins' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {selectedStat.statType === 'higher_wins' ? '⬆️ Higher Wins' : '⬇️ Lower Wins'}
        </span>
      </div>
    );
  };

  return (
    <div className="text-center">
      {/* Slot Machine Frame */}
      <div className="bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-xl p-1 shadow-2xl">
        <div className="bg-black rounded-lg p-6">
          
          {/* Title */}
          <h2 className="text-xl font-bold text-lol-gold mb-4 font-['Orbitron']">
            🎰 STAT ROULETTE 🎰
          </h2>

          {/* Three Individual Slot Machines */}
          <div className="flex justify-center space-x-6 mb-6">
            {[0, 1, 2].map((reelIndex) => (
              <div key={reelIndex} className="relative">
                {/* Individual slot machine */}
                <div className="relative w-48 h-80 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border-4 border-lol-gold/70 overflow-hidden">
                  
                  {/* Slot machine frame effect */}
                  <div className="absolute inset-2 border-2 border-lol-gold/30 rounded-lg"></div>
                  
                  {/* Reel number indicator */}
                  <div className="absolute top-2 left-2 w-6 h-6 bg-lol-gold rounded-full flex items-center justify-center text-black font-bold text-sm z-10">
                    {reelIndex + 1}
                  </div>
                  
                  {/* Spinning status indicator */}
                  {reelStates[reelIndex] && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-spin z-10">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                  
                  {/* Individual reel container */}
                  <div className="relative h-full p-4 pt-12">
                    
                    {/* Show current stat for this reel */}
                    {isAnimating ? (
                      // Spinning animation for this specific reel
                      <div className="space-y-3 h-full flex flex-col justify-center">
                        {reelStates[reelIndex] ? (
                          // Still spinning - show random cycling
                          <>
                            {[-1, 0, 1].map((offset, index) => {
                              const statIndex = (reelPositions[reelIndex] + offset) % STAT_CATEGORIES.length;
                              const stat = STAT_CATEGORIES[statIndex < 0 ? STAT_CATEGORIES.length + statIndex : statIndex];
                              const isCenter = offset === 0;
                              
                              return (
                                <div
                                  key={`reel-${reelIndex}-${index}`}
                                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                    isCenter 
                                      ? 'border-lol-gold bg-lol-gold/30 scale-105 shadow-lg animate-pulse' 
                                      : 'border-gray-600 bg-gray-700/40 opacity-50 scale-95'
                                  }`}
                                >
                                  <div className="text-center">
                                    <div className={`font-bold text-xs mb-1 line-clamp-2 ${
                                      isCenter ? 'text-white' : 'text-gray-400'
                                    }`}>
                                      {stat?.name || 'Loading...'}
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                                      stat?.higherWins 
                                        ? 'bg-green-500/20 text-green-400' 
                                        : 'bg-red-500/20 text-red-400'
                                    }`}>
                                      {stat?.higherWins ? '📈' : '📉'}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        ) : (
                          // Stopped - show final choice
                          <div className="p-4 rounded-lg border-2 border-lol-gold bg-lol-gold/20 animate-bounce">
                            <div className="text-center">
                              <div className="text-white font-bold text-sm mb-2">
                                {finalChoices[reelIndex]?.name}
                              </div>
                              <div className="text-gray-300 text-xs mb-2 line-clamp-3">
                                {finalChoices[reelIndex]?.description}
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                                finalChoices[reelIndex]?.higherWins 
                                  ? 'bg-green-500/30 text-green-300 border border-green-500/40' 
                                  : 'bg-red-500/30 text-red-300 border border-red-500/40'
                              }`}>
                                {finalChoices[reelIndex]?.higherWins ? '📈 Higher' : '📉 Lower'}
                              </div>
                              <div className="text-lol-gold font-bold text-lg mt-2">✨</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Final result display
                      finalChoices[reelIndex] && (
                        <div className="h-full flex items-center justify-center">
                          <div className="p-4 rounded-lg border-2 border-lol-gold bg-lol-gold/10 hover:bg-lol-gold/20 transition-all duration-300">
                            <div className="text-center">
                              <div className="text-white font-bold text-base mb-2">
                                {finalChoices[reelIndex].name}
                              </div>
                              <div className="text-gray-300 text-xs mb-2 line-clamp-2">
                                {finalChoices[reelIndex].description}
                              </div>
                              <div className={`text-xs px-3 py-1 rounded-full inline-block ${
                                finalChoices[reelIndex].higherWins 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                {finalChoices[reelIndex].higherWins ? '📈 Higher Wins' : '📉 Lower Wins'}
                              </div>
                              <div className="text-lol-gold font-bold text-lg mt-2">
                                Option {reelIndex + 1}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  
                  {/* Individual reel spinning effects */}
                  {reelStates[reelIndex] && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-b from-lol-gold/5 via-transparent to-lol-gold/5 animate-pulse"></div>
                      <div className="absolute top-0 left-0 right-0 h-1 bg-lol-gold animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-lol-gold animate-pulse"></div>
                    </>
                  )}
                </div>
                
                {/* Reel label */}
                <div className="text-center mt-2">
                  <div className="text-lol-gold text-sm font-semibold">
                    {reelStates[reelIndex] ? '🎰 Spinning...' : '✅ Stopped'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Stat Display */}
          <div className="bg-black/60 rounded-lg p-4 border border-lol-gold/30">
            <div className="text-2xl font-bold text-lol-gold mb-2">
              {displayStat}
            </div>
            <p className="text-gray-300 text-sm">
              {getStatDescription()}
            </p>
            {getStatTypeIndicator()}
          </div>

          {/* Phase Indicator */}
          <div className="mt-4">
            {phase === 'slot_spinning' && (
              <div className="text-lol-light-blue animate-pulse flex items-center justify-center">
                <span className="mr-2">🎰</span>
                Rolling for stat options...
              </div>
            )}
            {phase === 'slot_slowing' && (
              <div className="text-lol-gold animate-pulse flex items-center justify-center">
                <span className="mr-2">⏳</span>
                Slowing down...
              </div>
            )}
            {phase === 'player_choice' && (
              <div className="text-green-400 flex items-center justify-center">
                <span className="mr-2">🤔</span>
                Choose your stat!
              </div>
            )}
            {phase === 'anticipation' && (
              <div className="text-lol-gold animate-pulse flex items-center justify-center">
                <span className="mr-2">⚡</span>
                Calculating player stats...
              </div>
            )}
            {phase === 'reveal' && (
              <div className="text-green-400 flex items-center justify-center">
                <span className="mr-2">✨</span>
                Battle results revealed!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}