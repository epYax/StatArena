import { useState, useEffect } from 'react';
import LoLIcon from '../common/LoLIcon';

interface CoinFlipProps {
  player1Name: string;
  player2Name: string;
  player1Icon: string;
  player2Icon: string;
  onFlipComplete: (winner: 1 | 2) => void;
}

export default function CoinFlip({ player1Name, player2Name, player1Icon, player2Icon, onFlipComplete }: CoinFlipProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<1 | 2 | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Start coin flip animation after a brief delay
    const startDelay = setTimeout(() => {
      setIsFlipping(true);
      
      // Determine the winner (random)
      const winner = Math.random() > 0.5 ? 1 : 2;
      
      // Show result after flip animation (extended duration)
      const flipDuration = setTimeout(() => {
        setIsFlipping(false);
        setResult(winner);
        setShowResult(true);
        
        // Call callback after showing result (extended delay)
        const resultDelay = setTimeout(() => {
          onFlipComplete(winner);
        }, 2500);
        
        return () => clearTimeout(resultDelay);
      }, 3000); // Extended from 2000ms to 3000ms
      
      return () => clearTimeout(flipDuration);
    }, 1000); // Extended from 500ms to 1000ms
    
    return () => clearTimeout(startDelay);
  }, [onFlipComplete]);

  return (
    <div className="max-w-2xl mx-auto text-center p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 font-['Orbitron'] flex items-center justify-center gap-2">
          <LoLIcon type="coin" size="md" />
          Coin Flip
        </h2>
        <p className="text-lol-light-blue text-lg">
          Determining who chooses the stat first...
        </p>
        <div className="h-1 w-24 bg-gradient-to-r from-lol-gold to-lol-light-blue mx-auto mt-4"></div>
      </div>

      {/* Players */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className={`text-center p-4 rounded-lg border-2 transition-all duration-500 ${
          result === 1 ? 'border-lol-gold bg-lol-gold/10 scale-105' : 'border-gray-600'
        }`}>
          <div className="mb-2 flex justify-center">
            <LoLIcon type="crown" size="lg" />
          </div>
          <div className="text-white font-semibold">{player1Name}</div>
        </div>
        
        <div className={`text-center p-4 rounded-lg border-2 transition-all duration-500 ${
          result === 2 ? 'border-lol-gold bg-lol-gold/10 scale-105' : 'border-gray-600'
        }`}>
          <div className="mb-2 flex justify-center">
            <LoLIcon type="crown" size="lg" />
          </div>
          <div className="text-white font-semibold">{player2Name}</div>
        </div>
      </div>

      {/* Enhanced 3D Coin Animation */}
      <div className="mb-8 flex justify-center">
        <div className="relative w-40 h-40 perspective-1000">
          <div className={`
            relative w-full h-full transform-style-preserve-3d transition-all duration-1000
            ${isFlipping ? 'animate-spin-3d' : ''}
            ${showResult ? 'scale-110' : ''}
            ${showResult && result === 2 ? 'rotate-y-180' : ''}
          `}>
            {/* Coin Front Face (Player 1) */}
            <div className={`
              absolute inset-0 w-full h-full rounded-full border-4 border-lol-gold
              flex items-center justify-center backface-hidden
              bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl
              ${result === 1 && showResult ? 'shadow-blue-500/50 ring-4 ring-blue-400/50' : ''}
            `}>
              <div className="relative">
                <img 
                  src={player1Icon} 
                  alt={player1Name}
                  className="w-20 h-20 rounded-full border-2 border-white shadow-lg"
                />
                {result === 1 && showResult && (
                  <div className="absolute -top-2 -right-2 animate-bounce">
                    <LoLIcon type="crown" size="lg" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Coin Back Face (Player 2) */}
            <div className={`
              absolute inset-0 w-full h-full rounded-full border-4 border-lol-gold
              flex items-center justify-center backface-hidden transform rotate-y-180
              bg-gradient-to-br from-red-400 to-red-600 shadow-xl
              ${result === 2 && showResult ? 'shadow-red-500/50 ring-4 ring-red-400/50' : ''}
            `}>
              <div className="relative">
                <img 
                  src={player2Icon} 
                  alt={player2Name}
                  className="w-20 h-20 rounded-full border-2 border-white shadow-lg"
                />
                {result === 2 && showResult && (
                  <div className="absolute -top-2 -right-2 animate-bounce">
                    <LoLIcon type="crown" size="lg" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Spinning glow effect */}
            {isFlipping && (
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-pulse opacity-75"></div>
            )}
          </div>
          
          {/* Dramatic lighting effects */}
          {isFlipping && (
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-lol-gold/20 to-transparent animate-pulse"></div>
          )}
          
          {/* Victory sparkles */}
          {showResult && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 animate-ping">
                <LoLIcon type="sparkle" size="sm" className="text-lol-gold" />
              </div>
              <div className="absolute top-1/4 right-0 animate-ping" style={{animationDelay: '0.5s'}}>
                <LoLIcon type="sparkle" size="sm" className="text-lol-gold" />
              </div>
              <div className="absolute bottom-1/4 left-0 animate-ping" style={{animationDelay: '1s'}}>
                <LoLIcon type="sparkle" size="sm" className="text-lol-gold" />
              </div>
              <div className="absolute bottom-0 right-1/4 animate-ping" style={{animationDelay: '1.5s'}}>
                <LoLIcon type="sparkle" size="sm" className="text-lol-gold" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center">
        {!showResult ? (
          <div className="text-lol-light-blue text-lg animate-pulse flex items-center justify-center gap-2">
            <LoLIcon type="dice" size="sm" />
            Flipping coin...
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-2xl font-bold text-lol-gold">
              {result === 1 ? player1Name : player2Name} goes first!
            </div>
            <div className="text-gray-300">
              Get ready to choose your stat...
            </div>
          </div>
        )}
      </div>

      {/* Loading bar effect */}
      {isFlipping && (
        <div className="mt-6 w-64 mx-auto">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-lol-gold to-yellow-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}