import { useState, useEffect } from 'react';

interface CoinFlipProps {
  player1Name: string;
  player2Name: string;
  onFlipComplete: (winner: 1 | 2) => void;
}

export default function CoinFlip({ player1Name, player2Name, onFlipComplete }: CoinFlipProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<1 | 2 | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Start coin flip animation after a brief delay
    const startDelay = setTimeout(() => {
      setIsFlipping(true);
      
      // Determine the winner (random)
      const winner = Math.random() > 0.5 ? 1 : 2;
      
      // Show result after flip animation
      const flipDuration = setTimeout(() => {
        setIsFlipping(false);
        setResult(winner);
        setShowResult(true);
        
        // Call callback after showing result
        const resultDelay = setTimeout(() => {
          onFlipComplete(winner);
        }, 1500);
        
        return () => clearTimeout(resultDelay);
      }, 2000);
      
      return () => clearTimeout(flipDuration);
    }, 500);
    
    return () => clearTimeout(startDelay);
  }, [onFlipComplete]);

  return (
    <div className="max-w-2xl mx-auto text-center p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 font-['Orbitron']">
          🪙 Coin Flip
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
          <div className="text-2xl mb-2">👑</div>
          <div className="text-white font-semibold">{player1Name}</div>
        </div>
        
        <div className={`text-center p-4 rounded-lg border-2 transition-all duration-500 ${
          result === 2 ? 'border-lol-gold bg-lol-gold/10 scale-105' : 'border-gray-600'
        }`}>
          <div className="text-2xl mb-2">👑</div>
          <div className="text-white font-semibold">{player2Name}</div>
        </div>
      </div>

      {/* Coin Animation */}
      <div className="mb-8 flex justify-center">
        <div className={`relative w-32 h-32 ${isFlipping ? 'animate-spin' : ''}`}>
          <div className={`
            w-full h-full rounded-full border-4 border-lol-gold flex items-center justify-center text-4xl font-bold
            transition-all duration-500 transform
            ${isFlipping ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/50' : 'bg-gradient-to-br from-lol-gold to-yellow-600'}
            ${showResult ? 'scale-110' : ''}
          `}>
            {!showResult ? (
              <span className="text-black animate-pulse">🪙</span>
            ) : (
              <span className="text-black">
                {result === 1 ? '👑' : '⚔️'}
              </span>
            )}
          </div>
          
          {/* Spinning effect overlay */}
          {isFlipping && (
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin"></div>
          )}
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center">
        {!showResult ? (
          <div className="text-lol-light-blue text-lg animate-pulse">
            🎲 Flipping coin...
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