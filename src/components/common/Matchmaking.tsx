import { useState, useEffect } from 'react';
import LoLIcon from './LoLIcon';

export default function Matchmaking() {
  const [dots, setDots] = useState('');
  const [searchTime, setSearchTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSearchTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        {/* Spinning Champion Icons */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-lol-gold animate-spin">
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-lol-gold rounded-full flex items-center justify-center">
              <LoLIcon type="battle" size="xs" className="text-black" />
            </div>
          </div>
          <div className="absolute inset-4 bg-black/40 rounded-full flex items-center justify-center">
            <LoLIcon type="target" size="xl" />
          </div>
        </div>

        {/* Status Text */}
        <h2 className="text-3xl font-bold text-white mb-2 font-['Orbitron']">
          Finding Opponent{dots}
        </h2>
        
        <p className="text-lol-light-blue text-lg mb-6">
          Searching for worthy challenger
        </p>

        {/* Search Timer */}
        <div className="bg-black/30 rounded-lg p-4 mb-6 border border-lol-gold/20">
          <div className="text-sm text-gray-400 mb-1">Search Time</div>
          <div className="text-2xl font-bold text-lol-gold">{formatTime(searchTime)}</div>
        </div>

        {/* Matchmaking Messages */}
        <div className="space-y-3 text-gray-300">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-lol-light-blue rounded-full animate-pulse"></div>
            <span>Analyzing match history...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-lol-gold rounded-full animate-pulse animation-delay-150"></div>
            <span>Finding players with similar skill...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-200"></div>
            <span>Checking famous players queue...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-300"></div>
            <span>Preparing battle arena...</span>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-sm font-semibold text-purple-300 mb-2">⭐ Famous Players Available</h3>
          <p className="text-xs text-gray-400">
            You might face Faker, Tyler1, Caps, Doublelift, or other legends with their real match data!
          </p>
        </div>
      </div>
    </div>
  );
}