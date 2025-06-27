import { useState, useEffect } from 'react';
import type { StatCategory, MatchData } from '../../types';
import LoLIcon from '../common/LoLIcon';

interface FlashyStatAnimationProps {
  statCategory: StatCategory;
  player1Matches: MatchData[];
  player2Matches: MatchData[];
  player1Name: string;
  player2Name: string;
  onAnimationComplete: (player1Value: number, player2Value: number) => void;
}

interface AnimationPhase {
  phase: 'intro' | 'data_flash' | 'calculating' | 'reveal';
  duration: number;
}

export default function FlashyStatAnimation({ 
  statCategory, 
  player1Matches, 
  player2Matches, 
  player1Name,
  player2Name,
  onAnimationComplete 
}: FlashyStatAnimationProps) {
  const [currentPhase, setCurrentPhase] = useState<AnimationPhase['phase']>('intro');
  const [player1Value, setPlayer1Value] = useState(0);
  const [player2Value, setPlayer2Value] = useState(0);
  const [animatingNumbers, setAnimatingNumbers] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number}>>([]);

  const finalPlayer1Value = statCategory.getValue(player1Matches);
  const finalPlayer2Value = statCategory.getValue(player2Matches);

  // Get relevant stat from match based on category
  const getRelevantStatFromMatch = (match: MatchData) => {
    switch (statCategory.id) {
      case 'avg_cs_min':
        return `${match.cs} CS (${Math.floor(match.gameDuration / 60)}m)`;
      case 'last_game_vision':
      case 'vision_score':
        return `${match.visionScore} Vision`;
      case 'avg_kda':
        const kda = match.deaths === 0 ? match.kills + match.assists : ((match.kills + match.assists) / match.deaths).toFixed(1);
        return `${match.kills}/${match.deaths}/${match.assists} (${kda})`;
      case 'most_deaths_game':
      case 'third_game_deaths':
        return `${match.deaths} Deaths`;
      case 'longest_game':
        return `${Math.floor(match.gameDuration / 60)} min`;
      case 'total_gold_last_5':
        return `${(match.goldEarned / 1000).toFixed(1)}k Gold`;
      case 'perfect_games':
        return match.deaths === 0 ? '0 Deaths (Perfect)' : `${match.deaths} Deaths`;
      case 'aram_cs':
        return match.gameMode === 'ARAM' ? `${match.cs} CS (ARAM)` : `${match.cs} CS`;
      case 'win_streak':
        return match.win ? 'Win (W)' : 'Loss (L)';
      default:
        return `${match.kills}/${match.deaths}/${match.assists}`;
    }
  };

  const phases: AnimationPhase[] = [
    { phase: 'intro', duration: 800 },
    { phase: 'data_flash', duration: 4000 }, // Extended to 4 seconds for better viewing
    { phase: 'calculating', duration: 2000 },
    { phase: 'reveal', duration: 1500 }
  ];

  useEffect(() => {
    let phaseIndex = 0;
    
    const runPhase = () => {
      if (phaseIndex >= phases.length) {
        // Animation complete
        setTimeout(() => onAnimationComplete(finalPlayer1Value, finalPlayer2Value), 500);
        return;
      }

      const phase = phases[phaseIndex];
      setCurrentPhase(phase.phase);
      
      // Execute phase-specific logic
      executePhase(phase.phase);
      
      setTimeout(() => {
        phaseIndex++;
        runPhase();
      }, phase.duration);
    };

    runPhase();
  }, []);

  const executePhase = (phase: AnimationPhase['phase']) => {
    switch (phase) {
      case 'intro':
        // Reset everything
        setPlayer1Value(0);
        setPlayer2Value(0);
        setAnimatingNumbers(false);
        break;
        
      case 'data_flash':
        // Create sparkle effects
        generateSparkles();
        break;
        
      case 'calculating':
        // Start number animations
        setAnimatingNumbers(true);
        animateNumbers();
        break;
        
      case 'reveal':
        // Final dramatic reveal
        setPlayer1Value(finalPlayer1Value);
        setPlayer2Value(finalPlayer2Value);
        setAnimatingNumbers(false);
        break;
    }
  };

  const generateSparkles = () => {
    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setSparkles(newSparkles);
    
    setTimeout(() => setSparkles([]), 1000);
  };

  const animateNumbers = () => {
    let progress = 0;
    const duration = 1800;
    const stepTime = 50;
    const totalSteps = duration / stepTime;
    
    const interval = setInterval(() => {
      progress += 1;
      const ratio = progress / totalSteps;
      
      // Easing function for smooth animation
      const eased = 1 - Math.pow(1 - ratio, 3);
      
      // Add some randomness for more dynamic feel
      const randomFactor = 0.1 + Math.random() * 0.2;
      
      setPlayer1Value(Math.floor(finalPlayer1Value * eased * randomFactor * (0.8 + Math.random() * 0.4)));
      setPlayer2Value(Math.floor(finalPlayer2Value * eased * randomFactor * (0.8 + Math.random() * 0.4)));
      
      if (progress >= totalSteps) {
        clearInterval(interval);
      }
    }, stepTime);
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'intro': return 'Analyzing Stats...';
      case 'data_flash': return 'Processing Data...';
      case 'calculating': return 'CALCULATING...';
      case 'reveal': return 'RESULTS!';
      default: return '';
    }
  };

  const getPhaseIcon = () => {
    switch (currentPhase) {
      case 'intro': return 'stats';
      case 'data_flash': return 'lightning';
      case 'calculating': return 'fire';
      case 'reveal': return 'sparkle';
      default: return 'stats';
    }
  };

  const getPlayerCardClass = (playerNum: 1 | 2) => {
    const baseClass = "relative p-6 rounded-xl border-2 transition-all duration-500";
    
    switch (currentPhase) {
      case 'intro':
        return `${baseClass} border-gray-600 bg-black/40 scale-95`;
      case 'data_flash':
        return `${baseClass} border-lol-gold bg-lol-gold/10 animate-pulse scale-100`;
      case 'calculating':
        return `${baseClass} border-blue-400 bg-blue-500/20 animate-bounce scale-105`;
      case 'reveal':
        const isDraw = finalPlayer1Value === finalPlayer2Value;
        if (isDraw) {
          return `${baseClass} border-lol-gold bg-lol-gold/20 animate-pulse scale-105`;
        }
        const isWinner = playerNum === 1 ? 
          (statCategory.higherWins ? finalPlayer1Value > finalPlayer2Value : finalPlayer1Value < finalPlayer2Value) :
          (statCategory.higherWins ? finalPlayer2Value > finalPlayer1Value : finalPlayer2Value < finalPlayer1Value);
        return `${baseClass} ${isWinner ? 'border-green-400 bg-green-500/20 animate-pulse scale-110' : 'border-red-400 bg-red-500/20 scale-95'}`;
      default:
        return baseClass;
    }
  };

  const getNumberClass = () => {
    switch (currentPhase) {
      case 'calculating':
        return "text-4xl font-bold text-white animate-pulse blur-sm";
      case 'reveal':
        return "text-5xl font-bold text-lol-gold animate-bounce drop-shadow-2xl";
      default:
        return "text-3xl font-bold text-gray-400";
    }
  };

  return (
    <div className="relative min-h-[400px] bg-gradient-to-b from-black/95 to-black/80 rounded-xl p-6 border-2 border-lol-gold/50 overflow-hidden">
      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute w-2 h-2 bg-lol-gold rounded-full animate-ping"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        />
      ))}

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className={`text-xl font-bold transition-all duration-500 flex items-center justify-center gap-2 ${
          currentPhase === 'reveal' ? 'text-lol-gold animate-pulse text-2xl' : 'text-white'
        }`}>
          <LoLIcon type={getPhaseIcon() as any} size="sm" />
          {getPhaseText()}
        </h2>
        <div className="text-base text-gray-300 mt-1">
          {statCategory.name}
        </div>
      </div>

      {/* Players Side by Side */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Player 1 */}
        <div className={getPlayerCardClass(1)}>
          <div className="text-center">
            <div className="text-base font-semibold text-white mb-3 truncate">
              {player1Name}
            </div>
            
            {/* Mini match cards - only show during data_flash */}
            {currentPhase === 'data_flash' && (
              <div className="space-y-1 mb-3">
                <div className="text-xs text-gray-400 mb-1">Recent Games:</div>
                {player1Matches.slice(0, 3).map((match, i) => (
                  <div key={i} className="bg-black/80 rounded p-1 text-xs animate-[fadeIn_0.5s_ease-in] border border-lol-gold/20" style={{animationDelay: `${i * 0.2}s`}}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <div className={`w-1 h-1 rounded-full ${match.win ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className="text-gray-300">{match.championName.slice(0, 6)}</span>
                      </div>
                      <div className="text-lol-gold font-semibold text-xs">
                        {getRelevantStatFromMatch(match)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Animated Number */}
            <div className={getNumberClass()}>
              {animatingNumbers ? 
                `${player1Value}${Math.random() > 0.7 ? '?' : ''}` : 
                (currentPhase === 'reveal' ? finalPlayer1Value : '')
              }
            </div>
            
            {currentPhase === 'reveal' && (
              <div className="text-sm text-gray-400 mt-2 flex items-center justify-center gap-1">
                <LoLIcon type={statCategory.higherWins ? 'higher' : 'lower'} size="xs" />
                {statCategory.higherWins ? 'Higher Wins' : 'Lower Wins'}
              </div>
            )}
          </div>
        </div>

        {/* Player 2 */}
        <div className={getPlayerCardClass(2)}>
          <div className="text-center">
            <div className="text-base font-semibold text-white mb-3 truncate">
              {player2Name}
            </div>
            
            {/* Mini match cards - now showing detailed stats like Player 1 */}
            {currentPhase === 'data_flash' && (
              <div className="space-y-1 mb-3">
                <div className="text-xs text-gray-400 mb-1">Recent Games:</div>
                {player2Matches.slice(0, 3).map((match, i) => (
                  <div key={i} className="bg-black/80 rounded p-1 text-xs animate-[fadeIn_0.5s_ease-in] border border-lol-gold/20" style={{animationDelay: `${i * 0.2}s`}}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <div className={`w-1 h-1 rounded-full ${match.win ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className="text-gray-300">{match.championName.slice(0, 6)}</span>
                      </div>
                      <div className="text-lol-gold font-semibold text-xs">
                        {getRelevantStatFromMatch(match)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Animated Number */}
            <div className={getNumberClass()}>
              {animatingNumbers ? 
                `${player2Value}${Math.random() > 0.7 ? '?' : ''}` : 
                (currentPhase === 'reveal' ? finalPlayer2Value : '')
              }
            </div>
            
            {currentPhase === 'reveal' && (
              <div className="text-sm text-gray-400 mt-2 flex items-center justify-center gap-1">
                <LoLIcon type={statCategory.higherWins ? 'higher' : 'lower'} size="xs" />
                {statCategory.higherWins ? 'Higher Wins' : 'Lower Wins'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VS Indicator */}
      <div className="text-center">
        <div className={`text-2xl font-bold transition-all duration-500 ${
          currentPhase === 'reveal' ? 'text-lol-gold animate-pulse text-3xl' : 'text-gray-400'
        }`}>
          VS
        </div>
      </div>

      {/* Background Effects */}
      {currentPhase === 'calculating' && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 animate-pulse pointer-events-none" />
      )}
      
      {currentPhase === 'reveal' && (
        <div className="absolute inset-0 bg-gradient-to-r from-lol-gold/5 via-lol-gold/10 to-lol-gold/5 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}