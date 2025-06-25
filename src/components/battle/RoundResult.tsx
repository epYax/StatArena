import type { StatComparison } from '../../types';

interface RoundResultProps {
  statComparison: StatComparison;
  damage: number;
}

export default function RoundResult({ statComparison, damage }: RoundResultProps) {

  const getWinnerText = () => {
    if (statComparison.winner === 'draw') return "It's a Draw!";
    return statComparison.winner === 1 ? 'Player 1 Wins!' : 'Player 2 Wins!';
  };

  const getWinnerColor = () => {
    if (statComparison.winner === 'draw') return 'text-lol-gold';
    return statComparison.winner === 1 ? 'text-blue-400' : 'text-red-400';
  };

  return (
    <div className="bg-gradient-to-b from-black/80 to-black/60 rounded-lg p-6 border-2 border-lol-gold/70 shadow-2xl animate-[fadeIn_0.5s_ease-in] glow-effect">
      {/* Stat Category */}
      <div className="text-center mb-4">
        <div className="text-sm font-bold text-lol-gold mb-1 uppercase tracking-wide">
          ⚔️ {statComparison.category} ⚔️
        </div>
        <div className="text-xs text-gray-400">
          {statComparison.description}
        </div>
      </div>

      {/* Stat Comparison with VS styling */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center space-x-4">
          <span className={`text-2xl font-bold ${
            statComparison.winner === 1 ? 'text-blue-400 animate-pulse' : 
            statComparison.winner === 'draw' ? 'text-lol-gold animate-pulse' : 'text-gray-300'
          }`}>
            {statComparison.player1Value}
          </span>
          <span className="text-lol-gold font-bold text-lg">VS</span>
          <span className={`text-2xl font-bold ${
            statComparison.winner === 2 ? 'text-red-400 animate-pulse' : 
            statComparison.winner === 'draw' ? 'text-lol-gold animate-pulse' : 'text-gray-300'
          }`}>
            {statComparison.player2Value}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          ({statComparison.statType === 'higher_wins' ? '⬆️ Higher Wins' : '⬇️ Lower Wins'})
        </div>
      </div>

      {/* Winner Announcement with dramatic effect */}
      <div className="text-center mb-4">
        <div className={`text-2xl font-bold ${getWinnerColor()} animate-pulse drop-shadow-lg`}>
          🏆 {getWinnerText()} 🏆
        </div>
      </div>

      {/* Damage Dealt with impact effect */}
      <div className={`text-center rounded-lg p-3 border ${
        statComparison.winner === 'draw' 
          ? 'bg-lol-gold/20 border-lol-gold/50' 
          : 'bg-red-900/30 border-red-500/50'
      }`}>
        {statComparison.winner === 'draw' ? (
          <>
            <div className="text-3xl font-bold text-lol-gold animate-bounce drop-shadow-lg">
              🤝 0 HP 🤝
            </div>
            <div className="text-sm text-gray-400 mt-1">
              No damage - perfect tie!
            </div>
          </>
        ) : (
          <>
            <div className="text-3xl font-bold text-red-400 animate-bounce drop-shadow-lg">
              💥 -{damage} HP 💥
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Damage dealt to the loser
            </div>
          </>
        )}
      </div>
    </div>
  );
}