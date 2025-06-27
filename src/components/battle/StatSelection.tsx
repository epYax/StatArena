import { useState, useEffect } from 'react';
import type { StatCategory } from '../../types';
import LoLIcon from '../common/LoLIcon';

interface StatSelectionProps {
  choices: StatCategory[];
  player1Name: string;
  player2Name: string;
  onStatSelected: (selectedStat: StatCategory) => void;
  isPlayer1Turn?: boolean;
  timeLimit?: number;
}

export default function StatSelection({ 
  choices, 
  player1Name, 
  player2Name, 
  onStatSelected, 
  isPlayer1Turn = true,
  timeLimit = 25
}: StatSelectionProps) {
  const [selectedChoice, setSelectedChoice] = useState<StatCategory | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Timer countdown effect
  useEffect(() => {
    if (!isTimerRunning || isConfirming) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          // Auto-select middle option (index 1) when time runs out
          if (!selectedChoice && choices.length >= 2) {
            handleConfirm(choices[1]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, isConfirming, selectedChoice, choices]);

  const handleStatChoice = (stat: StatCategory) => {
    if (!isConfirming && isTimerRunning) {
      setSelectedChoice(stat);
      handleConfirm(stat); // Immediately confirm selection
    }
  };

  const handleConfirm = (forcedChoice?: StatCategory) => {
    const choice = forcedChoice || selectedChoice;
    if (choice) {
      setIsConfirming(true);
      setIsTimerRunning(false);
      if (forcedChoice) setSelectedChoice(forcedChoice);
      
      // Small delay for visual feedback
      setTimeout(() => {
        onStatSelected(choice);
      }, 500);
    }
  };

  const currentPlayer = isPlayer1Turn ? player1Name : player2Name;

  const getTimerColor = () => {
    if (timeLeft > 10) return 'text-green-400';
    if (timeLeft > 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTimerBgColor = () => {
    if (timeLeft > 10) return 'from-green-400 to-green-600';
    if (timeLeft > 5) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with Timer */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 font-['Orbitron'] flex items-center justify-center gap-3">
          <LoLIcon type="battle" size="md" />
          Battle Stat Selection
          <LoLIcon type="battle" size="md" />
        </h2>
        
        {/* Timer Display */}
        <div className="mb-4">
          <div className={`text-6xl font-bold ${getTimerColor()} mb-2 ${timeLeft <= 5 ? 'animate-pulse' : ''}`}>
            {timeLeft}
          </div>
          <div className="w-64 h-3 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getTimerBgColor()} rounded-full transition-all duration-1000 ease-linear`}
              style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
            ></div>
          </div>
          <div className="text-gray-400 text-sm mt-2">
            {timeLeft > 0 ? 'Time remaining' : 'Time up! Auto-selecting...'}
          </div>
        </div>

        <p className="text-lol-light-blue text-lg">
          <span className="text-lol-gold font-semibold">{currentPlayer}</span> - Click to select!
        </p>
        <div className="h-1 w-24 bg-gradient-to-r from-lol-gold to-lol-light-blue mx-auto mt-4"></div>
      </div>

      {/* Stat Choices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {choices.map((stat, index) => (
          <div
            key={stat.id}
            onClick={() => !isConfirming && handleStatChoice(stat)}
            className={`
              relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 p-6 cursor-pointer transition-all duration-300
              hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-800 hover:scale-105 hover:shadow-lg hover:shadow-lol-gold/20 transform
              ${selectedChoice?.id === stat.id 
                ? 'border-lol-gold bg-gradient-to-br from-lol-gold/20 to-yellow-600/20 ring-4 ring-lol-gold/50 shadow-lg shadow-lol-gold/30 scale-105' 
                : index === 1 
                  ? 'border-yellow-500/70 ring-2 ring-yellow-400/30' // Middle option highlighted as default
                  : 'border-gray-600 hover:border-lol-gold/50'
              }
              ${isConfirming ? 'pointer-events-none opacity-60' : ''}
              ${timeLeft <= 5 && index === 1 ? 'animate-pulse' : ''}
            `}
          >
            {/* Auto-select indicator for middle option */}
            {index === 1 && !selectedChoice && timeLeft <= 5 && (
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
                <LoLIcon type="hourglass" size="xs" className="text-black" />
              </div>
            )}

            {/* Selection indicator */}
            {selectedChoice?.id === stat.id && (
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-lol-gold to-yellow-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <LoLIcon type="lightning" size="sm" className="text-black" />
              </div>
            )}

            {/* Stat info */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-3">
                {stat.name}
              </h3>
              <p className="text-gray-300 text-sm mb-4 min-h-[2.5rem]">
                {stat.description}
              </p>
              
              {/* Win condition indicator */}
              <div className={`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                ${stat.higherWins 
                  ? 'bg-green-900/30 text-green-300 border border-green-500/30' 
                  : 'bg-red-900/30 text-red-300 border border-red-500/30'
                }
              `}>
                <LoLIcon type={stat.higherWins ? 'higher' : 'lower'} size="xs" className="mr-1" />
                {stat.higherWins ? 'Higher Wins' : 'Lower Wins'}
              </div>
            </div>

            {/* Choice number */}
            <div className="absolute top-3 left-3 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-gray-300 text-sm font-bold">{index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Status display when confirming */}
      {isConfirming && (
        <div className="text-center">
          <div className="bg-gradient-to-r from-lol-gold/20 to-yellow-600/20 rounded-xl p-6 border-2 border-lol-gold">
            <div className="flex items-center justify-center mb-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-lol-gold mr-3"></div>
              <LoLIcon type="lightning" size="md" className="text-lol-gold mr-2" />
              <span className="text-xl font-bold text-white">Locking in choice...</span>
            </div>
            <p className="text-lol-gold font-semibold">
              {selectedChoice?.name} selected!
            </p>
          </div>
        </div>
      )}

      {/* Quick info */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          {timeLeft > 5 
            ? "Click on the stat that gives you the best advantage!" 
            : "Hurry! Middle option will be auto-selected if time runs out!"
          }
        </p>
        {timeLeft <= 5 && (
          <p className="text-yellow-400 text-xs mt-2 animate-pulse flex items-center justify-center gap-1">
            <LoLIcon type="sparkle" size="xs" />
            Default choice (Option 2) highlighted
          </p>
        )}
      </div>
    </div>
  );
}