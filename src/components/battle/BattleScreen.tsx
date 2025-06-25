import { useState, useEffect } from 'react';
import type { Battle, Player, BattleRound, StatComparison, StatCategory } from '../../types';
import { getRandomStatCategory, getRandomStatChoices, calculateDamage, STAT_CATEGORIES } from '../../utils/statCategories';
import { riotApi, generateMockMatchData } from '../../services/riotApi';
import { auth, db } from '../../services/supabase';
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

type BattlePhase = 'coin_flip' | 'slot_spinning' | 'slot_slowing' | 'player_choice' | 'waiting_for_opponent' | 'stat_selection' | 'anticipation' | 'reveal' | 'damage' | 'next_round';

export default function BattleScreen({ battle, onBattleComplete }: BattleScreenProps) {
  const [currentBattle, setCurrentBattle] = useState<Battle>(battle);
  const [battlePhase, setBattlePhase] = useState<BattlePhase>('coin_flip');
  const [currentStatComparison, setCurrentStatComparison] = useState<StatComparison | null>(null);
  const [player1Matches, setPlayer1Matches] = useState<any[]>([]);
  const [player2Matches, setPlayer2Matches] = useState<any[]>([]);
  const [isMatchDataLoaded, setIsMatchDataLoaded] = useState(false);
  const [showCalculationAnimation, setShowCalculationAnimation] = useState(false);
  
  // New state for stat choices and turn management
  const [statChoices, setStatChoices] = useState<StatCategory[]>([]);
  const [selectedStat, setSelectedStat] = useState<StatCategory | null>(null);
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState<1 | 2>(1);
  
  // Damage animation state
  const [playerDamageAnimation, setPlayerDamageAnimation] = useState<{player1: boolean, player2: boolean}>({
    player1: false,
    player2: false
  });
  
  // Save battle to database when authenticated
  // AI decision-making function for stat selection
  const selectStatForAI = (choices: StatCategory[]): StatCategory => {
    // Simple AI strategy:
    // 1. Prefer defensive stats when opponent is ahead
    // 2. Prefer offensive stats when AI is ahead
    // 3. Use weighted random selection for variety
    
    const player1Hp = currentBattle.player1.hp;
    const player2Hp = currentBattle.player2.hp;
    const aiIsAhead = player2Hp > player1Hp;
    
    // Create weighted choices based on stat names and win conditions
    const weights = choices.map((stat, index) => {
      let weight = 1; // Base weight
      
      // Prefer certain stat types based on game state
      if (aiIsAhead) {
        // When ahead, prefer defensive/consistent stats
        if (stat.name.toLowerCase().includes('death') || 
            stat.name.toLowerCase().includes('vision') ||
            stat.name.toLowerCase().includes('farm')) {
          weight += 0.5;
        }
      } else {
        // When behind, prefer aggressive stats
        if (stat.name.toLowerCase().includes('kill') || 
            stat.name.toLowerCase().includes('damage') ||
            stat.name.toLowerCase().includes('gold')) {
          weight += 0.7;
        }
      }
      
      // Slightly prefer middle option for variety
      if (index === 1) weight += 0.2;
      
      // Random factor for unpredictability
      weight += Math.random() * 0.3;
      
      return weight;
    });
    
    // Select based on weighted probability
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const random = Math.random() * totalWeight;
    
    let cumulativeWeight = 0;
    for (let i = 0; i < choices.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        return choices[i];
      }
    }
    
    // Fallback to random choice
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const saveBattleResult = async (completedBattle: Battle, winner: Player) => {
    try {
      const { user } = await auth.getUser();
      if (!user) {
        console.log('User not authenticated, skipping battle save');
        return;
      }

      // Calculate battle stats
      const totalDamage = completedBattle.rounds.reduce((sum, round) => sum + round.damage, 0);
      const battleDuration = completedBattle.rounds.length * 15; // Approximate 15s per round
      
      // Determine player1 and player2 IDs (use user ID for current user, generate temp ID for opponent)
      const isPlayer1User = completedBattle.player1.puuid === user.id || completedBattle.player1.summonerName.includes(user.email || '');
      const player1Id = isPlayer1User ? user.id : 'temp-opponent-1';
      const player2Id = isPlayer1User ? 'temp-opponent-2' : user.id;
      const winnerId = winner === completedBattle.player1 ? player1Id : player2Id;

      const battleData = {
        player1_id: player1Id,
        player2_id: player2Id,
        winner_id: winnerId,
        rounds_played: completedBattle.rounds.length,
        total_damage: totalDamage,
        battle_duration: battleDuration,
        rounds_data: completedBattle.rounds,
        battle_type: 'standard' as const
      };

      const { data, error } = await db.saveBattle(battleData);
      
      if (error) {
        console.error('Failed to save battle:', error);
      } else {
        console.log('✅ Battle saved successfully:', data);
      }
    } catch (error) {
      console.error('Error saving battle:', error);
    }
  };

  useEffect(() => {
    loadMatchData();
  }, []);

  useEffect(() => {
    console.log(`🔄 Battle phase changed to: ${battlePhase}`);
    let timer: number;
    
    switch (battlePhase) {
      case 'coin_flip':
        console.log('🪙 Coin flip phase...');
        // Coin flip handles its own timing
        break;
      case 'slot_spinning':
        console.log('🎰 Slot machine spinning...');
        // Slot machine animation handles its own timing
        break;
      case 'slot_slowing':
        console.log('⏳ Slot machine slowing down...');
        // Handled by slot machine component
        break;
      case 'player_choice':
        console.log('🤔 Player choosing stat...');
        // Timer in StatSelection component handles this phase
        break;
      case 'waiting_for_opponent':
        console.log('⏳ Waiting for opponent...');
        // This is just a display state
        break;
      case 'stat_selection':
        console.log('🎰 Starting battle with selected stat...');
        // Only start the round if match data is loaded and stat is selected
        if (isMatchDataLoaded && selectedStat) {
          startRound();
        } else {
          console.log('⏳ Waiting for match data and stat selection...');
        }
        break;
      case 'anticipation':
        console.log('⏳ Anticipation phase...');
        // Start flashy calculation animation for both players
        setShowCalculationAnimation(true);
        break;
      case 'reveal':
        console.log('📋 Revealing stats...');
        timer = setTimeout(() => {
          console.log('💥 Moving to damage phase');
          setBattlePhase('damage');
        }, 3000);
        break;
      case 'damage':
        console.log('⚔️ Applying damage...');
        // Apply damage immediately when entering damage phase
        applyDamageToPlayers();
        timer = setTimeout(() => {
          console.log('➡️ Moving to next round');
          setBattlePhase('next_round');
        }, 2000);
        break;
      case 'next_round':
        console.log('🔄 Checking if battle should continue...');
        timer = setTimeout(() => {
          checkBattleEnd();
        }, 2000);
        break;
    }

    return () => clearTimeout(timer);
  }, [battlePhase, isMatchDataLoaded]);

  // Separate useEffect to handle match data loaded and stat choices
  useEffect(() => {
    if (isMatchDataLoaded && battlePhase === 'player_choice' && statChoices.length === 0) {
      console.log('✅ Match data loaded, generating stat choices!');
      const choices = getRandomStatChoices(3);
      setStatChoices(choices);
    }
  }, [isMatchDataLoaded, battlePhase]);

  // Handle stat selection completion
  useEffect(() => {
    if (isMatchDataLoaded && battlePhase === 'stat_selection' && selectedStat) {
      console.log('✅ Stat selected, starting battle!');
      startRound();
    }
  }, [isMatchDataLoaded, battlePhase, selectedStat]);

  // Auto-select stat for player 2 (AI opponent)
  useEffect(() => {
    if (battlePhase === 'player_choice' && currentPlayerTurn === 2 && statChoices.length > 0) {
      console.log('🤖 AI opponent (Player 2) is making their choice...');
      
      // AI makes decision after 3-5 seconds for realism
      const aiDecisionTime = 3000 + Math.random() * 2000; // 3-5 seconds
      
      const aiTimer = setTimeout(() => {
        // AI strategy: prefer stats that seem advantageous
        // For now, we'll use a simple strategy: prefer stats with specific patterns
        const aiChoice = selectStatForAI(statChoices);
        console.log('🤖 AI selected:', aiChoice.name);
        handleStatSelection(aiChoice);
      }, aiDecisionTime);

      return () => clearTimeout(aiTimer);
    }
  }, [battlePhase, currentPlayerTurn, statChoices]);

  const loadMatchData = async () => {
    try {
      console.log('🔄 Loading enhanced match data for battle...');
      const [p1Matches, p2Matches] = await Promise.all([
        riotApi.getEnhancedMatchHistory(currentBattle.player1.puuid, currentBattle.player1.summonerName.split('#')[1]),
        riotApi.getEnhancedMatchHistory(currentBattle.player2.puuid, currentBattle.player2.summonerName.split('#')[1])
      ]);
      console.log(`✅ Loaded ${p1Matches.length} matches for player 1, ${p2Matches.length} matches for player 2`);
      console.log(`📊 Player 1 masteries: ${p1Matches[0]?.championMasteries?.length || 0}, Level: ${p1Matches[0]?.summonerLevel || 'N/A'}`);
      console.log(`📊 Player 2 masteries: ${p2Matches[0]?.championMasteries?.length || 0}, Level: ${p2Matches[0]?.summonerLevel || 'N/A'}`);
      setPlayer1Matches(p1Matches);
      setPlayer2Matches(p2Matches);
      setIsMatchDataLoaded(true);
    } catch (error) {
      console.error('Failed to load match data:', error);
      setIsMatchDataLoaded(true); // Set to true even on error so battle can proceed with fallback
    }
  };

  const startRound = async () => {
    // If no match data, try to load mock data as fallback
    let p1Matches = player1Matches;
    let p2Matches = player2Matches;
    
    if (p1Matches.length === 0 || p2Matches.length === 0) {
      console.warn('⚠️ No match data available, generating mock data for battle');
      try {
        // Generate mock data for both players
        p1Matches = p1Matches.length === 0 ? generateMockMatchData() : p1Matches;
        p2Matches = p2Matches.length === 0 ? generateMockMatchData() : p2Matches;
        
        // Update state with mock data
        if (player1Matches.length === 0) setPlayer1Matches(p1Matches);
        if (player2Matches.length === 0) setPlayer2Matches(p2Matches);
      } catch (error) {
        console.error('❌ Failed to generate mock data:', error);
        return;
      }
    }

    console.log('🎲 Starting new round...');
    const statCategory = selectedStat || getRandomStatCategory(); // Use selected stat or fallback to random
    const player1Value = statCategory.getValue(p1Matches);
    const player2Value = statCategory.getValue(p2Matches);
    
    const winner = player1Value === player2Value 
      ? 'draw' as const
      : statCategory.higherWins 
        ? (player1Value > player2Value ? 1 : 2)
        : (player1Value < player2Value ? 1 : 2);

    const comparison: StatComparison = {
      category: statCategory.name,
      description: statCategory.description,
      player1Value,
      player2Value,
      winner,
      statType: statCategory.higherWins ? 'higher_wins' : 'lower_wins'
    };

    console.log(`📊 Stat: ${comparison.category}`);
    console.log(`🥊 ${comparison.player1Value} vs ${comparison.player2Value}`);
    console.log(`🏆 Winner: ${comparison.winner === 'draw' ? 'Draw!' : `Player ${comparison.winner}`}`);

    setCurrentStatComparison(comparison);
    
    // Wait for slot machine animation to complete (3 seconds) then move to anticipation
    setTimeout(() => {
      console.log('🎰 Slot machine animation complete, moving to anticipation');
      setBattlePhase('anticipation');
    }, 3000);
  };

  const handleCoinFlipComplete = (winner: 1 | 2) => {
    console.log('🪙 Coin flip complete! Player', winner, 'goes first');
    setCurrentPlayerTurn(winner);
    
    // Start slot machine animation
    setTimeout(() => {
      setBattlePhase('slot_spinning');
    }, 1000);
  };

  const handleSlotSpinComplete = (choices: StatCategory[]) => {
    console.log('🎰 Slot spin complete! Choices:', choices.map(c => c.name));
    setStatChoices(choices);
    setBattlePhase('player_choice');
  };

  const handleStatSelection = (stat: StatCategory) => {
    console.log('📊 Player selected stat:', stat.name);
    setSelectedStat(stat);
    setBattlePhase('stat_selection');
  };

  const handleCalculationComplete = (player1Value: number, player2Value: number) => {
    console.log(`🧮 Calculation complete: P1=${player1Value}, P2=${player2Value}`);
    
    // Animation complete, move to reveal
    console.log('✨ Calculation complete, moving to reveal phase');
    setShowCalculationAnimation(false);
    setBattlePhase('reveal');
  };

  const applyDamageToPlayers = () => {
    if (!currentStatComparison) {
      console.error('❌ No stat comparison data available for damage application');
      return;
    }

    console.log('🎯 Applying damage and triggering animations...');
    const damage = calculateDamage(currentStatComparison.winner, 
                                 currentStatComparison.player1Value, 
                                 currentStatComparison.player2Value);

    let updatedBattle = { ...currentBattle };
    
    const originalHp1 = updatedBattle.player1.hp;
    const originalHp2 = updatedBattle.player2.hp;
    
    if (currentStatComparison.winner === 'draw') {
      console.log(`🤝 Draw! No damage dealt`);
    } else if (currentStatComparison.winner === 2) {
      updatedBattle.player1.hp = Math.max(0, updatedBattle.player1.hp - damage);
      console.log(`💔 Player 1 takes ${damage} damage: ${originalHp1} → ${updatedBattle.player1.hp}`);
      // Trigger player 1 damage animation
      setPlayerDamageAnimation(prev => ({ ...prev, player1: true }));
      setTimeout(() => setPlayerDamageAnimation(prev => ({ ...prev, player1: false })), 1000);
    } else {
      updatedBattle.player2.hp = Math.max(0, updatedBattle.player2.hp - damage);
      console.log(`💔 Player 2 takes ${damage} damage: ${originalHp2} → ${updatedBattle.player2.hp}`);
      // Trigger player 2 damage animation
      setPlayerDamageAnimation(prev => ({ ...prev, player2: true }));
      setTimeout(() => setPlayerDamageAnimation(prev => ({ ...prev, player2: false })), 1000);
    }

    // Update battle state immediately
    setCurrentBattle(updatedBattle);
  };

  const checkBattleEnd = async () => {
    if (!currentStatComparison) {
      console.error('❌ No stat comparison data available');
      return;
    }

    console.log('🏁 Checking if battle should end...');
    const damage = calculateDamage(currentStatComparison.winner, 
                                 currentStatComparison.player1Value, 
                                 currentStatComparison.player2Value);

    // Use current battle state (HP already updated by applyDamageToPlayers)
    let updatedBattle = { ...currentBattle };

    const newRound: BattleRound = {
      roundNumber: currentBattle.currentRound + 1,
      statComparison: currentStatComparison,
      damage,
      completed: true
    };

    updatedBattle.rounds.push(newRound);
    updatedBattle.currentRound += 1;

    console.log(`📋 Round ${newRound.roundNumber} completed`);
    setCurrentBattle(updatedBattle);

    // Check if battle is over - someone reached 0 HP or max rounds
    if (updatedBattle.player1.hp <= 0 || updatedBattle.player2.hp <= 0) {
      const winner = updatedBattle.player1.hp > 0 
        ? updatedBattle.player1 
        : updatedBattle.player2;
      console.log(`🏆 Battle complete! Winner: ${winner.summonerName} (${winner.hp} HP remaining)`);
      
      // Save battle result to database
      await saveBattleResult(updatedBattle, winner);
      
      onBattleComplete(winner);
    } else if (updatedBattle.currentRound >= 5) {
      // Max rounds reached - winner by HP
      const winner = updatedBattle.player1.hp > updatedBattle.player2.hp 
        ? updatedBattle.player1 
        : updatedBattle.player2;
      console.log(`🏆 Battle complete after 5 rounds! Winner: ${winner.summonerName} (${winner.hp} vs ${winner === updatedBattle.player1 ? updatedBattle.player2.hp : updatedBattle.player1.hp} HP)`);
      
      // Save battle result to database
      await saveBattleResult(updatedBattle, winner);
      
      onBattleComplete(winner);
    } else {
      console.log('🔄 Starting next round...');
      // Reset for new round and alternate turns
      setStatChoices([]);
      setSelectedStat(null);
      setCurrentStatComparison(null);
      
      // Alternate turns (no coin flip needed after first round)
      const nextPlayer = currentPlayerTurn === 1 ? 2 : 1;
      setCurrentPlayerTurn(nextPlayer);
      console.log(`🔄 Player ${nextPlayer} goes first this round`);
      
      setBattlePhase('slot_spinning');
    }
  };

  const getRoundStatus = () => {
    if (!isMatchDataLoaded) {
      return 'Loading match data...';
    }
    
    switch (battlePhase) {
      case 'coin_flip':
        return 'Determining turn order...';
      case 'slot_spinning':
        return 'Rolling stat options...';
      case 'slot_slowing':
        return 'Finalizing choices...';
      case 'player_choice':
        return `Player ${currentPlayerTurn} choosing stat...`;
      case 'waiting_for_opponent':
        return 'Opponent choosing...';
      case 'stat_selection':
        return 'Preparing battle...';
      case 'anticipation':
        if (showCalculationAnimation) {
          return 'Battle calculations in progress...';
        }
        return 'Revealing stats...';
      case 'reveal':
        return 'Determining winner...';
      case 'damage':
        return 'Applying damage...';
      case 'next_round':
        return 'Preparing next round...';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black">
      {/* Header with persistent player info */}
      <div className="bg-black/50 border-b border-lol-gold/30 p-3 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          {/* Top row - Title and status */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-center">
              <h1 className="text-xl font-bold text-white font-['Orbitron']">StatArena</h1>
              <p className="text-sm text-lol-light-blue">Round {currentBattle.currentRound + 1} of 5</p>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Battle Status</div>
              <div className="text-sm text-lol-gold font-semibold">{getRoundStatus()}</div>
            </div>
          </div>

          {/* Persistent Player HP Bars */}
          <div className="grid grid-cols-3 gap-3 items-center transition-all duration-500 ease-in-out">
            {/* Player 1 */}
            <div className={`bg-gradient-to-r from-blue-900/30 to-blue-700/30 rounded-lg p-2 border border-blue-500/30 transition-all duration-300 ${
              playerDamageAnimation.player1 ? 'animate-pulse bg-red-500/50 border-red-500 scale-105 shadow-lg shadow-red-500/50' : ''
            }`}>
              <div className="flex items-center space-x-2">
                <img 
                  src={currentBattle.player1.summonerIcon} 
                  alt="Player 1"
                  className={`w-10 h-10 rounded-full border-2 border-blue-400 transition-all duration-300 ${
                    playerDamageAnimation.player1 ? 'border-red-400 animate-bounce' : ''
                  }`}
                />
                <div className="flex-1">
                  <div className="text-white font-semibold text-xs truncate">
                    {currentBattle.player1.summonerName}
                  </div>
                  <div className="text-xs text-gray-300 mb-1">
                    HP: {currentBattle.player1.hp}/{currentBattle.player1.maxHp}
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        playerDamageAnimation.player1 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' 
                          : 'bg-gradient-to-r from-green-500 to-blue-500'
                      }`}
                      style={{ width: `${(currentBattle.player1.hp / currentBattle.player1.maxHp) * 100}%` }}
                    ></div>
                  </div>
                </div>
                {currentPlayerTurn === 1 && (
                  <div className="text-lol-gold animate-pulse text-sm">⚡</div>
                )}
                {playerDamageAnimation.player1 && (
                  <div className="text-red-500 animate-bounce text-sm">💥</div>
                )}
              </div>
            </div>

            {/* VS and stat display */}
            <div className="text-center">
              <div className="text-xl font-bold text-lol-gold mb-1 animate-pulse">VS</div>
              {currentStatComparison && (battlePhase === 'reveal' || battlePhase === 'damage' || battlePhase === 'next_round') && (
                <div className="text-xs text-gray-300 bg-black/50 rounded px-2 py-1">
                  {currentStatComparison.category}
                </div>
              )}
            </div>

            {/* Player 2 */}
            <div className={`bg-gradient-to-r from-red-900/30 to-red-700/30 rounded-lg p-2 border border-red-500/30 transition-all duration-300 ${
              playerDamageAnimation.player2 ? 'animate-pulse bg-red-500/50 border-red-500 scale-105 shadow-lg shadow-red-500/50' : ''
            }`}>
              <div className="flex items-center space-x-2">
                {currentPlayerTurn === 2 && (
                  <div className="text-lol-gold animate-pulse text-sm">⚡</div>
                )}
                {playerDamageAnimation.player2 && (
                  <div className="text-red-500 animate-bounce text-sm">💥</div>
                )}
                <div className="flex-1">
                  <div className="text-white font-semibold text-xs truncate text-right">
                    {currentBattle.player2.summonerName}
                  </div>
                  <div className="text-xs text-gray-300 mb-1 text-right">
                    HP: {currentBattle.player2.hp}/{currentBattle.player2.maxHp}
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        playerDamageAnimation.player2 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' 
                          : 'bg-gradient-to-r from-red-500 to-orange-500'
                      }`}
                      style={{ width: `${(currentBattle.player2.hp / currentBattle.player2.maxHp) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <img 
                  src={currentBattle.player2.summonerIcon} 
                  alt="Player 2"
                  className={`w-10 h-10 rounded-full border-2 border-red-400 transition-all duration-300 ${
                    playerDamageAnimation.player2 ? 'border-red-400 animate-bounce' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with smooth transitions */}
      <div className="flex-1 relative overflow-hidden">
        
        {/* Slot Machine Layer */}
        <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${
          (battlePhase === 'slot_spinning' || battlePhase === 'slot_slowing') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8 pointer-events-none'
        }`}>
          <div className="flex items-center justify-center h-full p-8">
            <div className="max-w-6xl w-full">
              <StatSlotMachine 
                isSpinning={battlePhase === 'slot_spinning'}
                selectedStat={currentStatComparison}
                phase={battlePhase}
                statChoices={statChoices}
                onSpinComplete={handleSlotSpinComplete}
              />
            </div>
          </div>
        </div>

        {/* Main Battle Content Layer */}
        <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${
          (battlePhase === 'slot_spinning' || battlePhase === 'slot_slowing') 
            ? 'opacity-0 translate-y-8 pointer-events-none' 
            : 'opacity-100 translate-y-0'
        }`}>
          <div className="flex items-center justify-center h-full p-8">
        {battlePhase === 'coin_flip' ? (
          /* Coin Flip */
          <CoinFlip
            player1Name={currentBattle.player1.summonerName}
            player2Name={currentBattle.player2.summonerName}
            onFlipComplete={handleCoinFlipComplete}
          />
        ) : battlePhase === 'player_choice' && statChoices.length > 0 ? (
          /* Stat Selection or Waiting */
          currentPlayerTurn === 1 ? (
            /* Player 1's turn - show selection interface */
            <StatSelection
              choices={statChoices}
              player1Name={currentBattle.player1.summonerName}
              player2Name={currentBattle.player2.summonerName}
              onStatSelected={handleStatSelection}
              isPlayer1Turn={true}
            />
          ) : (
            /* Player 2's turn - show waiting screen while AI decides */
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-6xl mb-6 animate-bounce">🤖</div>
              <h2 className="text-3xl font-bold text-white mb-4 font-['Orbitron']">
                {currentBattle.player2.summonerName} is choosing...
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
                {statChoices.map((stat, index) => (
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
        ) : battlePhase === 'waiting_for_opponent' ? (
          /* Legacy waiting state (shouldn't be used anymore) */
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">⏳</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {currentPlayerTurn === 1 ? currentBattle.player1.summonerName : currentBattle.player2.summonerName} is choosing...
            </h2>
            <p className="text-gray-400">Please wait while your opponent selects their stat</p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lol-gold"></div>
            </div>
          </div>
        ) : showCalculationAnimation && currentStatComparison ? (
          /* Calculation Animation */
          <div className="max-w-4xl w-full">
            <FlashyStatAnimation
              statCategory={STAT_CATEGORIES.find(cat => cat.name === currentStatComparison.category) || STAT_CATEGORIES[0]}
              player1Matches={player1Matches}
              player2Matches={player2Matches}
              player1Name={currentBattle.player1.summonerName}
              player2Name={currentBattle.player2.summonerName}
              onAnimationComplete={handleCalculationComplete}
            />
          </div>
        ) : (
          /* Normal Battle Arena - Expanded player cards for battle phases */
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Player 1 - Expanded */}
            <PlayerCard 
              player={currentBattle.player1}
              statValue={currentStatComparison?.player1Value}
              isWinner={currentStatComparison?.winner === 1}
              showStat={battlePhase === 'reveal' || battlePhase === 'damage' || battlePhase === 'next_round'}
              isShaking={battlePhase === 'damage' && currentStatComparison?.winner === 2}
            />

            {/* VS Section - Battle results */}
            <div className="text-center">
              {currentStatComparison && (battlePhase === 'reveal' || battlePhase === 'damage' || battlePhase === 'next_round') ? (
                <RoundResult 
                  statComparison={currentStatComparison}
                  damage={calculateDamage(currentStatComparison.winner, 
                                        currentStatComparison.player1Value, 
                                        currentStatComparison.player2Value)}
                />
              ) : (
                <div className="text-4xl font-bold text-lol-gold mb-4">⚔️</div>
              )}
            </div>

            {/* Player 2 - Expanded */}
            <PlayerCard 
              player={currentBattle.player2}
              statValue={currentStatComparison?.player2Value}
              isWinner={currentStatComparison?.winner === 2}
              showStat={battlePhase === 'reveal' || battlePhase === 'damage' || battlePhase === 'next_round'}
              isShaking={battlePhase === 'damage' && currentStatComparison?.winner === 1}
            />
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
              {currentBattle.rounds.length > 0 ? `${currentBattle.rounds.length} rounds completed` : 'Battle starting...'}
            </div>
          </div>
          
          {currentBattle.rounds.length > 0 ? (
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {currentBattle.rounds.map((round, index) => (
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
  );
}