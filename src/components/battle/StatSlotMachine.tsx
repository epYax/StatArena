import { useState, useEffect } from 'react';
import type { StatComparison, StatCategory } from '../../types';
import { STAT_CATEGORIES } from '../../utils/statCategories';
import LoLIcon from '../common/LoLIcon';

interface StatSlotMachineProps {
  isSpinning: boolean;
  selectedStat: StatComparison | null;
  phase: string;
  statChoices?: StatCategory[];
  onSpinComplete?: (choices: StatCategory[]) => void;
}

export default function StatSlotMachine({ isSpinning, selectedStat, phase, onSpinComplete }: StatSlotMachineProps) {
  const [reelStates, setReelStates] = useState<'spinning' | 'stopping' | 'stopped'>('stopped');
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [finalChoices, setFinalChoices] = useState<StatCategory[]>([]);
  const [displayChoices, setDisplayChoices] = useState<StatCategory[]>([]);

  useEffect(() => {
    if (isSpinning && phase === 'slot_spinning') {
      console.log('🎰 Starting sequential slot machine');
      
      // Generate final choices first
      const choices: StatCategory[] = [];
      const availableStats = [...STAT_CATEGORIES];
      
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * availableStats.length);
        choices.push(availableStats[randomIndex]);
        availableStats.splice(randomIndex, 1);
      }
      setFinalChoices(choices);
      setDisplayChoices([]);
      setReelStates('spinning');
      setCurrentReelIndex(0);
      
      // Start sequential reel stopping
      startSequentialReels(choices);
    }
  }, [isSpinning, phase]);

  const startSequentialReels = (choices: StatCategory[]) => {
    const stopReel = (reelIndex: number) => {
      console.log(`🛑 Stopping reel ${reelIndex + 1}`);
      
      setDisplayChoices(prev => {
        const newChoices = [...prev];
        newChoices[reelIndex] = choices[reelIndex];
        return newChoices;
      });
      
      if (reelIndex < 2) {
        // Move to next reel after 800ms
        setTimeout(() => {
          setCurrentReelIndex(reelIndex + 1);
          stopReel(reelIndex + 1);
        }, 800);
      } else {
        // All reels stopped
        setTimeout(() => {
          setReelStates('stopped');
          console.log('All reels stopped, notifying parent');
          if (onSpinComplete) {
            onSpinComplete(choices);
          }
        }, 500);
      }
    };
    
    // Start with first reel after 1 second of spinning
    setTimeout(() => {
      stopReel(0);
    }, 1000);
  };

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
          <LoLIcon type={selectedStat.statType === 'higher_wins' ? 'higher' : 'lower'} size="xs" className="mr-1" />
          {selectedStat.statType === 'higher_wins' ? 'Higher Wins' : 'Lower Wins'}
        </span>
      </div>
    );
  };

  const getReelContent = (reelIndex: number) => {
    const hasChoice = displayChoices[reelIndex];
    const isCurrentReel = currentReelIndex === reelIndex;
    const isSpinning = reelStates === 'spinning' && !hasChoice;
    
    if (hasChoice) {
      // Show final choice
      return (
        <div className="h-full flex items-center justify-center animate-bounce">
          <div className="p-4 rounded-lg border-2 border-lol-gold bg-lol-gold/20 text-center">
            <div className="text-white font-bold text-sm mb-2">
              {hasChoice.name}
            </div>
            <div className="text-gray-300 text-xs mb-2">
              {hasChoice.description}
            </div>
            <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${
              hasChoice.higherWins 
                ? 'bg-green-500/30 text-green-300' 
                : 'bg-red-500/30 text-red-300'
            }`}>
              <LoLIcon type={hasChoice.higherWins ? 'higher' : 'lower'} size="xs" />
              {hasChoice.higherWins ? 'Higher' : 'Lower'}
            </div>
          </div>
        </div>
      );
    }
    
    if (isSpinning) {
      // Show spinning animation
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <LoLIcon type="slot-machine" size="xl" className="animate-spin" />
            </div>
            <div className="text-lol-gold font-bold animate-pulse">
              SPINNING...
            </div>
          </div>
        </div>
      );
    }
    
    // Default state
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="mb-2 flex justify-center">
            <LoLIcon type="target" size="lg" />
          </div>
          <div className="text-sm">Ready</div>
        </div>
      </div>
    );
  };

  return (
    <div className="text-center">
      {/* Slot Machine Frame */}
      <div className="bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-xl p-1 shadow-2xl">
        <div className="bg-black rounded-lg p-6">
          
          {/* Title */}
          <h2 className="text-xl font-bold text-lol-gold mb-6 font-['Orbitron'] flex items-center justify-center gap-3">
            <LoLIcon type="slot-machine" size="md" />
            STAT ROULETTE
            <LoLIcon type="slot-machine" size="md" />
          </h2>

          {/* Three Simplified Slot Machines */}
          <div className="flex justify-center space-x-6 mb-6">
            {[0, 1, 2].map((reelIndex) => (
              <div key={reelIndex} className="relative">
                {/* Individual slot machine */}
                <div className="relative w-48 h-64 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border-4 border-lol-gold/70 overflow-hidden">
                  
                  {/* Reel number */}
                  <div className="absolute top-2 left-2 w-6 h-6 bg-lol-gold rounded-full flex items-center justify-center text-black font-bold text-sm z-10">
                    {reelIndex + 1}
                  </div>
                  
                  {/* Spinning indicator */}
                  {reelStates === 'spinning' && currentReelIndex >= reelIndex && !displayChoices[reelIndex] && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-spin z-10">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                  
                  {/* Reel content */}
                  <div className="p-4 pt-12">
                    {getReelContent(reelIndex)}
                  </div>
                  
                  {/* Spinning effects */}
                  {reelStates === 'spinning' && !displayChoices[reelIndex] && (
                    <div className="absolute inset-0 bg-gradient-to-b from-lol-gold/10 via-transparent to-lol-gold/10 animate-pulse"></div>
                  )}
                </div>
                
                {/* Status label */}
                <div className="text-center mt-2">
                  <div className="text-lol-gold text-sm font-semibold flex items-center justify-center gap-1">
                    {displayChoices[reelIndex] ? (
                      <><LoLIcon type="check" size="xs" /> Stopped</>
                    ) : reelStates === 'spinning' ? (
                      <><LoLIcon type="slot-machine" size="xs" /> Spinning</>
                    ) : (
                      <><LoLIcon type="hourglass" size="xs" /> Ready</>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status Display */}
          <div className="bg-black/60 rounded-lg p-4 border border-lol-gold/30">
            <div className="text-lg font-bold text-lol-gold mb-2 flex items-center justify-center gap-2">
              {reelStates === 'spinning' ? (
                <><LoLIcon type="slot-machine" size="sm" /> Rolling for options...</>
              ) : reelStates === 'stopped' ? (
                <><LoLIcon type="target" size="sm" /> Choose your stat!</>
              ) : (
                <><LoLIcon type="hourglass" size="sm" /> Ready to roll</>
              )}
            </div>
            <p className="text-gray-300 text-sm">
              {reelStates === 'spinning' ? 'Watch the reels stop one by one!' : 
               'Stat categories will appear sequentially'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}