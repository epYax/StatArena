import type { Battle, Player } from '../../types';
import { calculateDamage, STAT_CATEGORIES } from '../../utils/statCategories';
import { useBattleEngine, BATTLE_PHASES } from '../../hooks/useBattleEngine';
import ErrorBoundary, { BattleError } from '../common/ErrorBoundary';
import { BattleLoading } from '../common/LoadingSpinner';
import StatSlotMachine from './StatSlotMachine';
import PlayerCard from './PlayerCard';
import RoundResult from './RoundResult';
import FlashyStatAnimation from './FlashyStatAnimation';
import StatSelection from './StatSelection';
import CoinFlip from './CoinFlip';

interface BattleScreenProps {
  battle: Battle;
  onBattleComplete: (winner: Player) => void;
}

export default function BattleScreen({ battle, onBattleComplete }: BattleScreenProps) {
  const { state, actions } = useBattleEngine(battle, onBattleComplete);

  const getRoundStatus = () => {
    if (!state.isMatchDataLoaded) {
      return '🔍 Analyzing match histories and champion masteries...';
    }
    
    switch (state.battlePhase) {
      case BATTLE_PHASES.COIN_FLIP:
        return '🪙 Ancient coin decides who strikes first...';
      case BATTLE_PHASES.SLOT_SPINNING:
        return '🎰 The Rift\'s magic reveals stat categories...';
      case BATTLE_PHASES.SLOT_SLOWING:
        return '✨ Statistical destinies taking shape...';
      case BATTLE_PHASES.PLAYER_CHOICE:
        const playerName = state.currentPlayerTurn === 1 
          ? state.currentBattle.player1.summonerName.split('#')[0]
          : state.currentBattle.player2.summonerName.split('#')[0];
        return `⚡ ${playerName} weighing their statistical advantage...`;
      case BATTLE_PHASES.WAITING_FOR_OPPONENT:
        return '🤖 AI opponent analyzing optimal strategy...';
      case BATTLE_PHASES.STAT_SELECTION:
        return '⚔️ Battle preparations underway...';
      case BATTLE_PHASES.ANTICIPATION:
        if (state.showCalculationAnimation) {
          return '🧮 Hextech algorithms processing match data...';
        }
        return '🔮 The numbers don\'t lie - revealing truth...';
      case BATTLE_PHASES.REVEAL:
        const comparison = state.currentStatComparison;
        if (comparison) {
          return `📊 ${comparison.category}: ${comparison.player1Value} vs ${comparison.player2Value}`;
        }
        return '🏆 Statistical supremacy determined...';
      case BATTLE_PHASES.DAMAGE:
        const winner = state.currentStatComparison?.winner;
        if (winner === 'draw') {
          return '🤝 Perfectly matched - no damage dealt!';
        } else if (winner === 1) {
          return '💥 Player 1 strikes with superior stats!';
        } else if (winner === 2) {
          return '💥 Player 2 dominates with better performance!';
        }
        return '⚡ Statistical warfare in progress...';
      case BATTLE_PHASES.NEXT_ROUND:
        const roundNum = state.currentBattle.currentRound + 1;
        if (roundNum >= 5) {
          return '🏁 Final calculations - determining ultimate victor...';
        }
        return `🔄 Round ${roundNum + 1} approaches - new challenges await...`;
      default:
        return '⚔️ The battle rages on...';
    }
  };

  const getPhaseProgress = () => {
    const phases = [
      BATTLE_PHASES.COIN_FLIP,
      BATTLE_PHASES.SLOT_SPINNING,
      BATTLE_PHASES.PLAYER_CHOICE,
      BATTLE_PHASES.STAT_SELECTION,
      BATTLE_PHASES.ANTICIPATION,
      BATTLE_PHASES.REVEAL,
      BATTLE_PHASES.DAMAGE,
      BATTLE_PHASES.NEXT_ROUND
    ];
    
    const currentIndex = phases.indexOf(state.battlePhase);
    return {
      current: currentIndex >= 0 ? currentIndex + 1 : 1,
      total: phases.length,
      percentage: currentIndex >= 0 ? ((currentIndex + 1) / phases.length) * 100 : 0
    };
  };

  // Show loading screen
  if (state.isLoading) {
    return <BattleLoading phase="loading_data" />;
  }

  // Show error screen
  if (state.error) {
    return (
      <BattleError 
        error={state.error}
        onRetry={actions.retryBattle}
        onExit={() => window.history.back()}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black">
        {/* Header with persistent player info */}
        <div className="bg-black/50 border-b border-lol-gold/30 p-3 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto">
            {/* Top row - Title and status */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-center">
                <h1 className="text-xl font-bold text-white font-['Orbitron']">StatArena</h1>
                <p className="text-sm text-lol-light-blue">Round {state.currentBattle.currentRound + 1} of 5</p>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">Battle Status</div>
                <div className="text-sm text-lol-gold font-semibold">{getRoundStatus()}</div>
                {/* Phase Progress Bar */}
                <div className="mt-2 w-48 mx-auto">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Round Progress</span>
                    <span>{getPhaseProgress().current}/{getPhaseProgress().total}</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-lol-gold to-lol-light-blue rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${getPhaseProgress().percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Persistent Player HP Bars */}
            <div className="grid grid-cols-3 gap-3 items-center transition-all duration-500 ease-in-out">
              {/* Player 1 */}
              <div className={`bg-gradient-to-r from-blue-900/30 to-blue-700/30 rounded-lg p-2 border border-blue-500/30 transition-all duration-300 ${
                state.playerDamageAnimation.player1 ? 'animate-pulse bg-red-500/50 border-red-500 scale-105 shadow-lg shadow-red-500/50' : ''
              } ${
                state.currentPlayerTurn === 1 && (state.battlePhase === BATTLE_PHASES.PLAYER_CHOICE || state.battlePhase === BATTLE_PHASES.STAT_SELECTION) ? 'active-player-highlight' : ''
              }`}>
                <div className="flex items-center space-x-2">
                  <img 
                    src={state.currentBattle.player1.summonerIcon} 
                    alt="Player 1"
                    className={`w-10 h-10 rounded-full border-2 border-blue-400 transition-all duration-300 ${
                      state.playerDamageAnimation.player1 ? 'border-red-400 animate-bounce' : ''
                    }`}
                  />
                  <div className="flex-1">
                    <div className="text-white font-semibold text-xs truncate">
                      {state.currentBattle.player1.summonerName}
                    </div>
                    <div className="text-xs text-gray-300 mb-1">
                      HP: {state.currentBattle.player1.hp}/{state.currentBattle.player1.maxHp}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          state.playerDamageAnimation.player1 
                            ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' 
                            : 'bg-gradient-to-r from-green-500 to-blue-500'
                        }`}
                        style={{ width: `${(state.currentBattle.player1.hp / state.currentBattle.player1.maxHp) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  {state.currentPlayerTurn === 1 && (
                    <div className="text-lol-gold animate-pulse text-sm">⚡</div>
                  )}
                  {state.playerDamageAnimation.player1 && (
                    <div className="text-red-500 animate-bounce text-sm">💥</div>
                  )}
                </div>
              </div>

              {/* VS and stat display */}
              <div className="text-center">
                <div className="text-xl font-bold text-lol-gold mb-1 animate-pulse">VS</div>
                {state.currentStatComparison && (state.battlePhase === BATTLE_PHASES.REVEAL || state.battlePhase === BATTLE_PHASES.DAMAGE || state.battlePhase === BATTLE_PHASES.NEXT_ROUND) && (
                  <div className="text-xs text-gray-300 bg-black/50 rounded px-2 py-1">
                    {state.currentStatComparison.category}
                  </div>
                )}
              </div>

              {/* Player 2 */}
              <div className={`bg-gradient-to-r from-red-900/30 to-red-700/30 rounded-lg p-2 border border-red-500/30 transition-all duration-300 ${
                state.playerDamageAnimation.player2 ? 'animate-pulse bg-red-500/50 border-red-500 scale-105 shadow-lg shadow-red-500/50' : ''
              } ${
                state.currentPlayerTurn === 2 && (state.battlePhase === BATTLE_PHASES.PLAYER_CHOICE || state.battlePhase === BATTLE_PHASES.STAT_SELECTION) ? 'active-player-highlight' : ''
              }`}>
                <div className="flex items-center space-x-2">
                  {state.currentPlayerTurn === 2 && (
                    <div className="text-lol-gold animate-pulse text-sm">⚡</div>
                  )}
                  {state.playerDamageAnimation.player2 && (
                    <div className="text-red-500 animate-bounce text-sm">💥</div>
                  )}
                  <div className="flex-1">
                    <div className="text-white font-semibold text-xs truncate text-right">
                      {state.currentBattle.player2.summonerName}
                    </div>
                    <div className="text-xs text-gray-300 mb-1 text-right">
                      HP: {state.currentBattle.player2.hp}/{state.currentBattle.player2.maxHp}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          state.playerDamageAnimation.player2 
                            ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' 
                            : 'bg-gradient-to-r from-red-500 to-orange-500'
                        }`}
                        style={{ width: `${(state.currentBattle.player2.hp / state.currentBattle.player2.maxHp) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <img 
                    src={state.currentBattle.player2.summonerIcon} 
                    alt="Player 2"
                    className={`w-10 h-10 rounded-full border-2 border-red-400 transition-all duration-300 ${
                      state.playerDamageAnimation.player2 ? 'border-red-400 animate-bounce' : ''
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Damage Numbers */}
        {state.floatingDamageNumbers.map((damageNum) => (
          <div
            key={damageNum.id}
            className={`floating-damage ${damageNum.player === 1 ? 'left-1/4' : 'right-1/4'}`}
            style={{
              position: 'fixed',
              top: '50%',
              left: damageNum.player === 1 ? '25%' : '75%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000
            }}
          >
            -{damageNum.damage}
          </div>
        ))}

        {/* Main Content Area with smooth transitions */}
        <div className="flex-1 relative overflow-hidden">
          
          {/* Slot Machine Layer */}
          <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            (state.battlePhase === BATTLE_PHASES.SLOT_SPINNING || state.battlePhase === BATTLE_PHASES.SLOT_SLOWING) 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8 pointer-events-none'
          }`}>
            <div className="flex items-center justify-center h-full p-8">
              <div className="max-w-6xl w-full">
                <StatSlotMachine 
                  isSpinning={state.battlePhase === BATTLE_PHASES.SLOT_SPINNING}
                  selectedStat={state.currentStatComparison}
                  phase={state.battlePhase}
                  statChoices={state.statChoices}
                  onSpinComplete={actions.handleSlotSpinComplete}
                />
              </div>
            </div>
          </div>

          {/* Main Battle Content Layer */}
          <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            (state.battlePhase === BATTLE_PHASES.SLOT_SPINNING || state.battlePhase === BATTLE_PHASES.SLOT_SLOWING) 
              ? 'opacity-0 translate-y-8 pointer-events-none' 
              : 'opacity-100 translate-y-0'
          }`}>
            <div className="flex items-center justify-center h-full p-8">
              {state.battlePhase === BATTLE_PHASES.COIN_FLIP ? (
                /* Coin Flip */
                <div className="battle-phase-enter">
                  <CoinFlip
                  player1Name={state.currentBattle.player1.summonerName}
                  player2Name={state.currentBattle.player2.summonerName}
                  player1Icon={state.currentBattle.player1.summonerIcon}
                  player2Icon={state.currentBattle.player2.summonerIcon}
                  onFlipComplete={actions.handleCoinFlipComplete}
                  />
                </div>
              ) : state.battlePhase === BATTLE_PHASES.PLAYER_CHOICE && state.statChoices.length > 0 ? (
                /* Stat Selection or Waiting */
                state.currentPlayerTurn === 1 ? (
                  /* Player 1's turn - show selection interface */
                  <StatSelection
                    choices={state.statChoices}
                    player1Name={state.currentBattle.player1.summonerName}
                    player2Name={state.currentBattle.player2.summonerName}
                    onStatSelected={actions.handleStatSelection}
                    isPlayer1Turn={true}
                  />
                ) : (
                  /* Player 2's turn - show waiting screen while AI decides */
                  <div className="text-center max-w-2xl mx-auto">
                    <div className="text-6xl mb-6 animate-bounce">🤖</div>
                    <h2 className="text-3xl font-bold text-white mb-4 font-['Orbitron']">
                      {state.currentBattle.player2.summonerName} is choosing...
                    </h2>
                    <p className="text-lol-light-blue text-lg mb-6">
                      Your opponent is analyzing the stat options. Please wait while they make their decision.
                    </p>
                    
                    {/* AI thinking animation */}
                    <div className="bg-black/50 rounded-xl p-6 border border-lol-gold/30 mb-6">
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-lol-gold rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-lol-gold rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-lol-gold rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm">
                        🧠 Analyzing stat advantages...
                      </div>
                    </div>

                    {/* Blurred stat choices (so player can see what options exist) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50 blur-sm pointer-events-none">
                      {state.statChoices.map((stat) => (
                        <div key={stat.id} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                          <div className="text-white font-bold text-sm mb-2">{stat.name}</div>
                          <div className="text-gray-400 text-xs">{stat.description}</div>
                          <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${
                            stat.higherWins ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {stat.higherWins ? '📈 Higher' : '📉 Lower'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ) : state.showCalculationAnimation && state.currentStatComparison ? (
                /* Calculation Animation */
                <div className="max-w-4xl w-full">
                  <FlashyStatAnimation
                    statCategory={STAT_CATEGORIES.find(cat => cat.name === state.currentStatComparison!.category) || STAT_CATEGORIES[0]}
                    player1Matches={state.player1Matches}
                    player2Matches={state.player2Matches}
                    player1Name={state.currentBattle.player1.summonerName}
                    player2Name={state.currentBattle.player2.summonerName}
                    onAnimationComplete={actions.handleCalculationComplete}
                  />
                </div>
              ) : (
                /* Normal Battle Arena - Expanded player cards for battle phases */
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center battle-content-enter">
                  {/* Player 1 - Expanded */}
                  <div className="player-card-enter-left">
                    <PlayerCard 
                    player={state.currentBattle.player1}
                    statValue={state.currentStatComparison?.player1Value}
                    isWinner={state.currentStatComparison?.winner === 1}
                    showStat={state.battlePhase === BATTLE_PHASES.REVEAL || state.battlePhase === BATTLE_PHASES.DAMAGE || state.battlePhase === BATTLE_PHASES.NEXT_ROUND}
                    isShaking={state.battlePhase === BATTLE_PHASES.DAMAGE && state.currentStatComparison?.winner === 2}
                    />
                  </div>

                  {/* VS Section - Battle results */}
                  <div className="text-center">
                    {/* Großer Battle Theme Banner - CENTER AREA */}
                    {state.selectedStat ? (
                      <div className="mb-6">
                        <div className="relative bg-gradient-to-r from-lol-gold/20 via-yellow-500/30 to-lol-gold/20 rounded-2xl border-2 border-lol-gold/60 p-6 shadow-2xl battle-phase-enter w-full max-w-2xl mx-auto overflow-hidden">
                          {/* Decorative background effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-lol-gold/10 to-transparent animate-pulse"></div>
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lol-gold to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lol-gold to-transparent"></div>
                          
                          {/* Content */}
                          <div className="relative z-10">
                            <div className="text-xs text-lol-gold font-bold mb-2 tracking-widest uppercase">
                              ⚔️ BATTLE CATEGORY ⚔️
                            </div>
                            <div className="text-2xl font-bold text-white mb-3 leading-tight font-['Orbitron'] drop-shadow-lg">
                              {state.selectedStat.name}
                            </div>
                            <div className="text-sm text-gray-200 mb-4 leading-relaxed max-w-lg mx-auto">
                              {state.selectedStat.description}
                            </div>
                            
                            {/* Win condition badge */}
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm border-2 ${
                              state.selectedStat.higherWins 
                                ? 'bg-green-500/30 text-green-300 border-green-400/60 shadow-green-400/20' 
                                : 'bg-red-500/30 text-red-300 border-red-400/60 shadow-red-400/20'
                            } shadow-lg`}>
                              {state.selectedStat.higherWins ? '📈 HIGHER WINS' : '📉 LOWER WINS'}
                            </div>
                            
                            {/* Show comparison values during reveal/damage phases */}
                            {state.currentStatComparison && (state.battlePhase === BATTLE_PHASES.REVEAL || state.battlePhase === BATTLE_PHASES.DAMAGE || state.battlePhase === BATTLE_PHASES.NEXT_ROUND) && (
                              <div className="mt-6 pt-4 border-t-2 border-lol-gold/30">
                                <div className="text-xs text-lol-gold font-bold mb-2 tracking-wide uppercase">BATTLE RESULT</div>
                                <div className="flex justify-center items-center gap-6 text-xl font-bold">
                                  <div className="text-center">
                                    <div className="text-blue-400 text-2xl font-bold drop-shadow">{state.currentStatComparison.player1Value}</div>
                                    <div className="text-xs text-blue-300">Player 1</div>
                                  </div>
                                  <div className="text-lol-gold text-3xl font-bold animate-pulse">⚔️</div>
                                  <div className="text-center">
                                    <div className="text-red-400 text-2xl font-bold drop-shadow">{state.currentStatComparison.player2Value}</div>
                                    <div className="text-xs text-red-300">Player 2</div>
                                  </div>
                                </div>
                                
                                {/* Winner announcement */}
                                <div className="mt-4">
                                  {state.currentStatComparison.winner !== 'draw' ? (
                                    <div className={`text-lg font-bold drop-shadow-lg ${
                                      state.currentStatComparison.winner === 1 ? 'text-blue-400' : 'text-red-400'
                                    }`}>
                                      🏆 PLAYER {state.currentStatComparison.winner} DOMINATES! 🏆
                                    </div>
                                  ) : (
                                    <div className="text-lg font-bold text-lol-gold drop-shadow-lg">
                                      🤝 PERFECT TIE - NO DAMAGE! 🤝
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Decorative corner elements */}
                          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-lol-gold/60"></div>
                          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-lol-gold/60"></div>
                          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-lol-gold/60"></div>
                          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-lol-gold/60"></div>
                        </div>
                      </div>
                    ) : (
                      // Show default VS when no stat selected
                      <div className="text-4xl font-bold text-lol-gold mb-4">⚔️</div>
                    )}

                    {/* Battle Results (only if no stat panel or as additional info) */}
                    {state.currentStatComparison && (state.battlePhase === BATTLE_PHASES.REVEAL || state.battlePhase === BATTLE_PHASES.DAMAGE || state.battlePhase === BATTLE_PHASES.NEXT_ROUND) && !state.selectedStat && (
                      <RoundResult 
                        statComparison={state.currentStatComparison}
                        damage={calculateDamage(state.currentStatComparison.winner, 
                                              state.currentStatComparison.player1Value, 
                                              state.currentStatComparison.player2Value)}
                      />
                    )}
                  </div>

                  {/* Player 2 - Expanded */}
                  <div className="player-card-enter-right">
                    <PlayerCard 
                    player={state.currentBattle.player2}
                    statValue={state.currentStatComparison?.player2Value}
                    isWinner={state.currentStatComparison?.winner === 2}
                    showStat={state.battlePhase === BATTLE_PHASES.REVEAL || state.battlePhase === BATTLE_PHASES.DAMAGE || state.battlePhase === BATTLE_PHASES.NEXT_ROUND}
                    isShaking={state.battlePhase === BATTLE_PHASES.DAMAGE && state.currentStatComparison?.winner === 1}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Persistent Round History */}
        <div className="bg-black/30 border-t border-lol-gold/20 p-2 mt-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-semibold text-white">Round History</h3>
              <div className="text-xs text-gray-400">
                {state.currentBattle.rounds.length > 0 ? `${state.currentBattle.rounds.length} rounds completed` : 'Battle starting...'}
              </div>
            </div>
            
            {state.currentBattle.rounds.length > 0 ? (
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {state.currentBattle.rounds.map((round, index) => (
                  <div key={index} className="flex-shrink-0 bg-black/40 rounded p-1.5 border border-gray-600 min-w-[100px]">
                    <div className="text-xs text-gray-400 text-center mb-0.5">R{round.roundNumber}</div>
                    <div className="text-xs text-lol-gold text-center mb-0.5 truncate" title={round.statComparison.category}>
                      {round.statComparison.category.split(' ')[0]}
                    </div>
                    <div className="text-xs text-white text-center mb-0.5">
                      {round.statComparison.player1Value} vs {round.statComparison.player2Value}
                    </div>
                    <div className={`text-xs text-center ${
                      round.statComparison.winner === 'draw' ? 'text-lol-gold' : 'text-red-400'
                    }`}>
                      {round.statComparison.winner === 'draw' ? 'Draw' : `-${round.damage} HP`}
                    </div>
                    <div className="text-center">
                      {round.statComparison.winner === 'draw' ? '🤝' : 
                       round.statComparison.winner === 1 ? '👤' : '🤖'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-2 text-gray-500 text-xs">
                No rounds completed yet. Battle will begin soon!
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}