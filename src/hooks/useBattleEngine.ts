import { useState, useEffect, useCallback } from 'react';
import type { Battle, Player, BattleRound, StatComparison, StatCategory } from '../types';
import { getRandomStatCategory, getRandomStatChoices, calculateDamage } from '../utils/statCategories';
import { riotApi, generateMockMatchData } from '../services/riotApi';

// Battle phases as constants for better type safety
export const BATTLE_PHASES = {
  COIN_FLIP: 'coin_flip',
  SLOT_SPINNING: 'slot_spinning', 
  SLOT_SLOWING: 'slot_slowing',
  PLAYER_CHOICE: 'player_choice',
  WAITING_FOR_OPPONENT: 'waiting_for_opponent',
  STAT_SELECTION: 'stat_selection',
  ANTICIPATION: 'anticipation',
  REVEAL: 'reveal',
  DAMAGE: 'damage',
  NEXT_ROUND: 'next_round',
  ERROR: 'error'
} as const;

export type BattlePhase = typeof BATTLE_PHASES[keyof typeof BATTLE_PHASES];

interface BattleState {
  currentBattle: Battle;
  battlePhase: BattlePhase;
  currentStatComparison: StatComparison | null;
  player1Matches: any[];
  player2Matches: any[];
  isMatchDataLoaded: boolean;
  showCalculationAnimation: boolean;
  statChoices: StatCategory[];
  selectedStat: StatCategory | null;
  currentPlayerTurn: 1 | 2;
  playerDamageAnimation: { player1: boolean; player2: boolean };
  floatingDamageNumbers: { id: string; player: 1 | 2; damage: number; timestamp: number }[];
  error: string | null;
  isLoading: boolean;
}

interface BattleActions {
  setBattlePhase: (phase: BattlePhase) => void;
  handleCoinFlipComplete: (winner: 1 | 2) => void;
  handleSlotSpinComplete: (choices: StatCategory[]) => void;
  handleStatSelection: (stat: StatCategory) => void;
  handleCalculationComplete: (player1Value: number, player2Value: number) => void;
  retryBattle: () => void;
}

export function useBattleEngine(initialBattle: Battle, onBattleComplete: (winner: Player) => void) {
  // State
  const [state, setState] = useState<BattleState>({
    currentBattle: initialBattle,
    battlePhase: BATTLE_PHASES.COIN_FLIP,
    currentStatComparison: null,
    player1Matches: [],
    player2Matches: [],
    isMatchDataLoaded: false,
    showCalculationAnimation: false,
    statChoices: [],
    selectedStat: null,
    currentPlayerTurn: 1,
    playerDamageAnimation: { player1: false, player2: false },
    floatingDamageNumbers: [],
    error: null,
    isLoading: true
  });

  // AI decision-making function
  const selectStatForAI = useCallback((choices: StatCategory[]): StatCategory => {
    const player1Hp = state.currentBattle.player1.hp;
    const player2Hp = state.currentBattle.player2.hp;
    const aiIsAhead = player2Hp > player1Hp;
    
    const weights = choices.map((stat, index) => {
      let weight = 1;
      
      if (aiIsAhead) {
        if (stat.name.toLowerCase().includes('death') || 
            stat.name.toLowerCase().includes('vision') ||
            stat.name.toLowerCase().includes('farm')) {
          weight += 0.5;
        }
      } else {
        if (stat.name.toLowerCase().includes('kill') || 
            stat.name.toLowerCase().includes('damage') ||
            stat.name.toLowerCase().includes('gold')) {
          weight += 0.7;
        }
      }
      
      if (index === 1) weight += 0.2;
      weight += Math.random() * 0.3;
      
      return weight;
    });
    
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const random = Math.random() * totalWeight;
    
    let cumulativeWeight = 0;
    for (let i = 0; i < choices.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        return choices[i];
      }
    }
    
    return choices[Math.floor(Math.random() * choices.length)];
  }, [state.currentBattle.player1.hp, state.currentBattle.player2.hp]);

  // Load match data
  const loadMatchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.log('🔄 Loading enhanced match data for battle...');
      const [p1Matches, p2Matches] = await Promise.all([
        riotApi.getEnhancedMatchHistory(
          state.currentBattle.player1.puuid, 
          state.currentBattle.player1.summonerName.split('#')[1]
        ),
        riotApi.getEnhancedMatchHistory(
          state.currentBattle.player2.puuid, 
          state.currentBattle.player2.summonerName.split('#')[1]
        )
      ]);
      
      console.log(`✅ Loaded ${p1Matches.length} matches for player 1, ${p2Matches.length} matches for player 2`);
      
      setState(prev => ({
        ...prev,
        player1Matches: p1Matches,
        player2Matches: p2Matches,
        isMatchDataLoaded: true,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to load match data:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load match data. Using demo mode.',
        isMatchDataLoaded: true,
        isLoading: false
      }));
    }
  }, [state.currentBattle.player1.puuid, state.currentBattle.player1.summonerName, state.currentBattle.player2.puuid, state.currentBattle.player2.summonerName]);

  // Start a new round
  const startRound = useCallback(async () => {
    try {
      let p1Matches = state.player1Matches;
      let p2Matches = state.player2Matches;
      
      if (p1Matches.length === 0 || p2Matches.length === 0) {
        console.warn('⚠️ No match data available, generating mock data for battle');
        p1Matches = p1Matches.length === 0 ? generateMockMatchData() : p1Matches;
        p2Matches = p2Matches.length === 0 ? generateMockMatchData() : p2Matches;
        
        setState(prev => ({
          ...prev,
          player1Matches: p1Matches,
          player2Matches: p2Matches
        }));
      }

      console.log('🎲 Starting new round...');
      const statCategory = state.selectedStat || getRandomStatCategory();
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

      setState(prev => ({ ...prev, currentStatComparison: comparison }));
      
      setTimeout(() => {
        setState(prev => ({ ...prev, battlePhase: BATTLE_PHASES.ANTICIPATION }));
      }, 4000); // Extended from 3000ms to 4000ms for more time to appreciate stat selection
    } catch (error) {
      console.error('Error starting round:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to start round. Please try again.',
        battlePhase: BATTLE_PHASES.ERROR
      }));
    }
  }, [state.player1Matches, state.player2Matches, state.selectedStat]);

  // Apply damage to players
  const applyDamageToPlayers = useCallback(() => {
    setState(prevState => {
      if (!prevState.currentStatComparison) {
        console.error('❌ No stat comparison data available for damage application');
        return prevState;
      }

      const damage = calculateDamage(
        prevState.currentStatComparison.winner, 
        prevState.currentStatComparison.player1Value, 
        prevState.currentStatComparison.player2Value
      );

      let updatedBattle = { ...prevState.currentBattle };
      let newDamageAnimation = { ...prevState.playerDamageAnimation };
      
      let newFloatingNumbers = [...prevState.floatingDamageNumbers];
      
      if (prevState.currentStatComparison.winner === 'draw') {
        console.log(`🤝 Draw! No damage dealt`);
      } else if (prevState.currentStatComparison.winner === 2) {
        updatedBattle.player1.hp = Math.max(0, updatedBattle.player1.hp - damage);
        newDamageAnimation.player1 = true;
        
        // Add floating damage number for player 1
        newFloatingNumbers.push({
          id: `damage-${Date.now()}-p1`,
          player: 1,
          damage: damage,
          timestamp: Date.now()
        });
        
        setTimeout(() => setState(prev => ({ 
          ...prev, 
          playerDamageAnimation: { ...prev.playerDamageAnimation, player1: false }
        })), 1000);
      } else {
        updatedBattle.player2.hp = Math.max(0, updatedBattle.player2.hp - damage);
        newDamageAnimation.player2 = true;
        
        // Add floating damage number for player 2
        newFloatingNumbers.push({
          id: `damage-${Date.now()}-p2`,
          player: 2,
          damage: damage,
          timestamp: Date.now()
        });
        
        setTimeout(() => setState(prev => ({ 
          ...prev, 
          playerDamageAnimation: { ...prev.playerDamageAnimation, player2: false }
        })), 1000);
      }
      
      // Clean up old floating numbers (older than 3 seconds)
      const now = Date.now();
      newFloatingNumbers = newFloatingNumbers.filter(num => now - num.timestamp < 3000);

      return {
        ...prevState,
        currentBattle: updatedBattle,
        playerDamageAnimation: newDamageAnimation,
        floatingDamageNumbers: newFloatingNumbers
      };
    });
  }, []);

  // Check if battle should end
  const checkBattleEnd = useCallback(async () => {
    setState(prevState => {
      if (!prevState.currentStatComparison) {
        console.error('❌ No stat comparison data available');
        return prevState;
      }

      const damage = calculateDamage(
        prevState.currentStatComparison.winner, 
        prevState.currentStatComparison.player1Value, 
        prevState.currentStatComparison.player2Value
      );

      let updatedBattle = { ...prevState.currentBattle };

      const newRound: BattleRound = {
        roundNumber: prevState.currentBattle.currentRound + 1,
        statComparison: prevState.currentStatComparison,
        damage,
        completed: true
      };

      updatedBattle.rounds.push(newRound);
      updatedBattle.currentRound += 1;

      if (prevState.currentBattle.player1.hp <= 0 || prevState.currentBattle.player2.hp <= 0) {
        const winner = prevState.currentBattle.player1.hp > 0 
          ? prevState.currentBattle.player1 
          : prevState.currentBattle.player2;
        console.log(`🏆 Battle complete! Winner: ${winner.summonerName}`);
        setTimeout(() => onBattleComplete(winner), 100);
        return { ...prevState, currentBattle: updatedBattle };
      } else if (updatedBattle.currentRound >= 5) {
        const winner = prevState.currentBattle.player1.hp > prevState.currentBattle.player2.hp 
          ? prevState.currentBattle.player1 
          : prevState.currentBattle.player2;
        console.log(`🏆 Battle complete after 5 rounds! Winner: ${winner.summonerName}`);
        setTimeout(() => onBattleComplete(winner), 100);
        return { ...prevState, currentBattle: updatedBattle };
      } else {
        console.log('🔄 Starting next round...');
        return {
          ...prevState,
          currentBattle: updatedBattle,
          statChoices: [],
          selectedStat: null,
          currentStatComparison: null,
          currentPlayerTurn: prevState.currentPlayerTurn === 1 ? 2 : 1,
          battlePhase: BATTLE_PHASES.SLOT_SPINNING
        };
      }
    });
  }, [onBattleComplete]);

  // Actions
  const actions: BattleActions = {
    setBattlePhase: (phase: BattlePhase) => {
      setState(prev => ({ ...prev, battlePhase: phase }));
    },

    handleCoinFlipComplete: (winner: 1 | 2) => {
      console.log('🪙 Coin flip complete! Player', winner, 'goes first');
      setState(prev => ({ 
        ...prev, 
        currentPlayerTurn: winner,
        battlePhase: BATTLE_PHASES.SLOT_SPINNING
      }));
    },

    handleSlotSpinComplete: (choices: StatCategory[]) => {
      console.log('🎰 Slot spin complete! Choices:', choices.map(c => c.name));
      setState(prev => ({ 
        ...prev, 
        statChoices: choices,
        battlePhase: BATTLE_PHASES.PLAYER_CHOICE
      }));
    },

    handleStatSelection: (stat: StatCategory) => {
      console.log('📊 Player selected stat:', stat.name);
      setState(prev => ({ 
        ...prev, 
        selectedStat: stat,
        battlePhase: BATTLE_PHASES.STAT_SELECTION
      }));
    },

    handleCalculationComplete: (player1Value: number, player2Value: number) => {
      console.log(`🧮 Calculation complete: P1=${player1Value}, P2=${player2Value}`);
      setState(prev => ({ 
        ...prev, 
        showCalculationAnimation: false,
        battlePhase: BATTLE_PHASES.REVEAL
      }));
    },

    retryBattle: () => {
      setState(prev => ({
        ...prev,
        error: null,
        battlePhase: BATTLE_PHASES.COIN_FLIP,
        isLoading: true
      }));
      loadMatchData();
    }
  };

  // Phase transition effects
  useEffect(() => {
    console.log(`🔄 Battle phase changed to: ${state.battlePhase}`);
    let timer: number;
    
    switch (state.battlePhase) {
      case BATTLE_PHASES.ANTICIPATION:
        setState(prev => ({ ...prev, showCalculationAnimation: true }));
        break;
      case BATTLE_PHASES.REVEAL:
        timer = setTimeout(() => {
          setState(prev => ({ ...prev, battlePhase: BATTLE_PHASES.DAMAGE }));
        }, 4000); // Extended from 3000ms to 4000ms for better result absorption
        break;
      case BATTLE_PHASES.DAMAGE:
        applyDamageToPlayers();
        timer = setTimeout(() => {
          setState(prev => ({ ...prev, battlePhase: BATTLE_PHASES.NEXT_ROUND }));
        }, 3000); // Extended from 2000ms to 3000ms for damage animation to be fully appreciated
        break;
      case BATTLE_PHASES.NEXT_ROUND:
        timer = setTimeout(() => {
          checkBattleEnd();
        }, 2500); // Extended from 2000ms to 2500ms for better transition to next round
        break;
      case BATTLE_PHASES.STAT_SELECTION:
        if (state.isMatchDataLoaded && state.selectedStat) {
          startRound();
        }
        break;
    }

    return () => clearTimeout(timer);
  }, [state.battlePhase, state.isMatchDataLoaded, state.selectedStat]);

  // Generate stat choices when data is loaded
  useEffect(() => {
    if (state.isMatchDataLoaded && state.battlePhase === BATTLE_PHASES.PLAYER_CHOICE && state.statChoices.length === 0) {
      console.log('✅ Match data loaded, generating stat choices!');
      const choices = getRandomStatChoices(3);
      setState(prev => ({ ...prev, statChoices: choices }));
    }
  }, [state.isMatchDataLoaded, state.battlePhase]);

  // AI opponent logic
  useEffect(() => {
    if (state.battlePhase === BATTLE_PHASES.PLAYER_CHOICE && state.currentPlayerTurn === 2 && state.statChoices.length > 0) {
      console.log('🤖 AI opponent (Player 2) is making their choice...');
      
      const aiDecisionTime = 5000 + Math.random() * 3000; // Extended from 3-5s to 5-8s for more realistic AI thinking
      
      const aiTimer = setTimeout(() => {
        const aiChoice = selectStatForAI(state.statChoices);
        console.log('🤖 AI selected:', aiChoice.name);
        actions.handleStatSelection(aiChoice);
      }, aiDecisionTime);

      return () => clearTimeout(aiTimer);
    }
  }, [state.battlePhase, state.currentPlayerTurn, state.statChoices, selectStatForAI]);

  // Load initial data
  useEffect(() => {
    loadMatchData();
  }, []);

  return { state, actions };
}