import { useState } from 'react';
import type { GameState, Player, Battle } from './types';
import { riotApi } from './services/riotApi';
import LoginScreen from './components/auth/LoginScreen';
import MainMenu from './components/common/MainMenu';
import BattleScreen from './components/battle/BattleScreen';
import ResultsScreen from './components/battle/ResultsScreen';
import Matchmaking from './components/common/Matchmaking';
import AdminDebugPanel from './components/admin/AdminDebugPanel';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: null,
    currentBattle: null,
    isAuthenticated: false,
    gamePhase: 'login'
  });

  const handleLogin = async (gameName?: string, tagLine?: string) => {
    try {
      // Try to authenticate with provided credentials or fall back to mock
      const account = await riotApi.authenticateWithRiot(gameName, tagLine);
      const player = await riotApi.createPlayer(account);
      
      setGameState(prev => ({
        ...prev,
        currentPlayer: player,
        isAuthenticated: true,
        gamePhase: 'menu'
      }));
    } catch (error) {
      console.error('Login with real API failed:', error);
      console.log('🎮 Switching to demo mode with mock data...');
      
      // If real API fails but user provided credentials, try fallback to mock with their name
      if (gameName && tagLine) {
        console.log('📝 Creating personalized demo account...');
        try {
          const mockAccount = await riotApi.createMockAccountWithName(gameName, tagLine);
          const player = await riotApi.createPlayer(mockAccount);
          
          setGameState(prev => ({
            ...prev,
            currentPlayer: player,
            isAuthenticated: true,
            gamePhase: 'menu'
          }));
          return;
        } catch (mockError) {
          console.error('Mock fallback failed:', mockError);
        }
      }
      
      // Final fallback - completely random mock account
      try {
        console.log('🎲 Creating random demo account...');
        const account = await riotApi.authenticateWithRiot();
        const player = await riotApi.createPlayer(account);
        
        setGameState(prev => ({
          ...prev,
          currentPlayer: player,
          isAuthenticated: true,
          gamePhase: 'menu'
        }));
      } catch (finalError) {
        console.error('All login methods failed:', finalError);
        // Create a basic fallback player
        console.log('⚠️ Creating basic demo player...');
        const fallbackPlayer: Player = {
          id: 'FALLBACK_PLAYER',
          puuid: 'FALLBACK_PLAYER',
          summonerName: 'DemoPlayer#123',
          summonerIcon: '29',
          rank: 'Gold IV',
          hp: 100,
          maxHp: 100,
          wins: 50,
          losses: 40,
          badges: []
        };
        
        setGameState(prev => ({
          ...prev,
          currentPlayer: fallbackPlayer,
          isAuthenticated: true,
          gamePhase: 'menu'
        }));
      }
    }
  };

  const handleFindBattle = async () => {
    if (!gameState.currentPlayer) return;
    
    setGameState(prev => ({ ...prev, gamePhase: 'matchmaking' }));
    
    try {
      // Extract region from current player's tag for regional matching
      const playerRegion = gameState.currentPlayer.summonerName.includes('#') 
        ? gameState.currentPlayer.summonerName.split('#')[1] 
        : undefined;
      
      const opponent = await riotApi.findRandomOpponent(playerRegion);
      
      const battle: Battle = {
        id: `battle_${Date.now()}`,
        player1: { ...gameState.currentPlayer, hp: 100, maxHp: 100 },
        player2: { ...opponent, hp: 100, maxHp: 100 },
        rounds: [],
        currentRound: 0,
        status: 'in_progress',
        createdAt: new Date()
      };
      
      setGameState(prev => ({
        ...prev,
        currentBattle: battle,
        gamePhase: 'battle'
      }));
    } catch (error) {
      console.error('Matchmaking failed:', error);
      setGameState(prev => ({ ...prev, gamePhase: 'menu' }));
    }
  };

  const handleBattleComplete = (winner: Player) => {
    setGameState(prev => ({
      ...prev,
      currentBattle: prev.currentBattle ? {
        ...prev.currentBattle,
        winner,
        status: 'completed'
      } : null,
      gamePhase: 'results'
    }));
  };

  const handleReturnToMenu = () => {
    setGameState(prev => ({
      ...prev,
      currentBattle: null,
      gamePhase: 'menu'
    }));
  };

  const renderCurrentScreen = () => {
    switch (gameState.gamePhase) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      
      case 'menu':
        return (
          <MainMenu 
            player={gameState.currentPlayer!}
            onFindBattle={handleFindBattle}
            onAdminPanel={() => setGameState(prev => ({ ...prev, gamePhase: 'admin' }))}
          />
        );
      
      case 'matchmaking':
        return <Matchmaking />;
      
      case 'battle':
        return (
          <BattleScreen 
            battle={gameState.currentBattle!}
            onBattleComplete={handleBattleComplete}
          />
        );
      
      case 'results':
        return (
          <ResultsScreen 
            battle={gameState.currentBattle!}
            onReturnToMenu={handleReturnToMenu}
          />
        );
      
      case 'admin':
        return (
          <AdminDebugPanel 
            player={gameState.currentPlayer!}
            onReturnToMenu={handleReturnToMenu}
          />
        );
      
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lol-dark via-riot-blue to-riot-teal">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;
