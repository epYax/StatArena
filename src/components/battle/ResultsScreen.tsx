import type { Battle } from '../../types';
import LoLIcon from '../common/LoLIcon';

interface ResultsScreenProps {
  battle: Battle;
  onReturnToMenu: () => void;
}

export default function ResultsScreen({ battle, onReturnToMenu }: ResultsScreenProps) {
  const winner = battle.winner!;


  const getBattleSummary = () => {
    const roundsPlayed = battle.rounds.length;
    const avgDamage = battle.rounds.reduce((sum, round) => sum + round.damage, 0) / roundsPlayed;
    return { roundsPlayed, avgDamage: Math.round(avgDamage) };
  };

  const { roundsPlayed, avgDamage } = getBattleSummary();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* Victory/Defeat Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 font-['Orbitron']">
            BATTLE COMPLETE
          </h1>
          <div className="h-1 w-48 bg-gradient-to-r from-lol-gold to-lol-light-blue mx-auto"></div>
        </div>

        {/* Winner Announcement */}
        <div className="bg-gradient-to-r from-lol-gold/20 to-yellow-600/20 rounded-xl p-8 mb-8 border-2 border-lol-gold glow-effect">
          <h2 className="text-3xl font-bold text-lol-gold mb-4">
            VICTORY
          </h2>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img 
              src={winner.summonerIcon} 
              alt="Winner Icon"
              className="w-16 h-16 rounded-full border-2 border-lol-gold"
            />
            <div>
              <div className="text-2xl font-bold text-white">{winner.summonerName}</div>
              <div className="text-lol-light-blue">Remaining HP: {winner.hp}/{winner.maxHp}</div>
            </div>
          </div>
        </div>

        {/* Battle Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/40 rounded-lg p-6 border border-lol-light-blue/30">
            <div className="mb-2 flex justify-center">
              <LoLIcon type="battle" size="lg" className="text-lol-light-blue" />
            </div>
            <div className="text-2xl font-bold text-white">{roundsPlayed}</div>
            <div className="text-gray-400">Rounds Played</div>
          </div>
          
          <div className="bg-black/40 rounded-lg p-6 border border-red-500/30">
            <div className="mb-2 flex justify-center">
              <LoLIcon type="damage" size="lg" className="text-red-400" />
            </div>
            <div className="text-2xl font-bold text-white">{avgDamage}</div>
            <div className="text-gray-400">Avg Damage/Round</div>
          </div>
          
          <div className="bg-black/40 rounded-lg p-6 border border-lol-gold/30">
            <div className="mb-2 flex justify-center">
              <LoLIcon type="hourglass" size="lg" className="text-lol-gold" />
            </div>
            <div className="text-2xl font-bold text-white">
              {Math.floor(roundsPlayed * 15)}s
            </div>
            <div className="text-gray-400">Battle Duration</div>
          </div>
        </div>

        {/* Round Breakdown */}
        <div className="bg-black/30 rounded-lg p-6 mb-8 border border-gray-600">
          <h3 className="text-xl font-bold text-white mb-4">Round Breakdown</h3>
          <div className="space-y-3">
            {battle.rounds.map((round, index) => (
              <div 
                key={index}
                className="flex items-center justify-between bg-black/40 rounded p-3 border border-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-lol-gold rounded-full flex items-center justify-center text-black font-bold text-sm">
                    {round.roundNumber}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{round.statComparison.category}</div>
                    <div className="text-sm text-gray-400">{round.statComparison.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white">
                    {round.statComparison.player1Value} vs {round.statComparison.player2Value}
                  </div>
                  <div className="text-red-400 text-sm">-{round.damage} HP</div>
                </div>
                <div className={`text-lg ${round.statComparison.winner === 1 ? 'text-green-400' : 'text-blue-400'} flex justify-center`}>
                  {round.statComparison.winner === 1 ? 
                    <LoLIcon type="crown" size="sm" /> : 
                    <LoLIcon type="robot" size="sm" />
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReturnToMenu}
            className="px-8 py-4 bg-gradient-to-r from-lol-gold to-yellow-600 hover:from-yellow-500 hover:to-lol-gold 
                     rounded-lg font-bold text-lg text-black transition-all duration-300 glow-effect"
          >
            Return to Menu
          </button>
          
          <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 
                           rounded-lg font-bold text-lg text-white transition-all duration-300">
            Play Again
          </button>
          
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 
                           rounded-lg font-bold text-lg text-white transition-all duration-300">
            Share Victory
          </button>
        </div>

        {/* Fun Stats */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
            <LoLIcon type="magic" size="sm" />
            Fun Fact
          </h3>
          <p className="text-gray-400">
            {battle.rounds.some(r => r.statComparison.category.includes('Death')) 
              ? "Someone's feeding habits were exposed in this battle!"
              : "This was a battle of skill and strategy!"
            }
          </p>
        </div>
      </div>
    </div>
  );
}