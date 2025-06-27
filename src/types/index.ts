export interface Player {
  id: string;
  summonerName: string;
  summonerIcon: string;
  puuid: string;
  hp: number;
  maxHp: number;
  wins: number;
  losses: number;
  rank?: string;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface ChampionMastery {
  championId: number;
  championName: string;
  championLevel: number;
  masteryPoints: number;
  lastPlayTime: number;
}

export interface MatchData {
  gameId: string;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  gameDuration: number;
  championName: string;
  visionScore: number;
  goldEarned: number;
  items: number[];
  gameMode: string;
  win: boolean;
  
  // Additional Match API fields
  damageDealtToChampions?: number;
  damageTaken?: number;
  totalHeal?: number;
  totalMinionsKilled?: number;
  neutralMinionsKilled?: number;
  wardsPlaced?: number;
  wardsKilled?: number;
  
  // Ping stats (undocumented fields)
  dangerPings?: number;
  enemyMissingPings?: number;
  allInPings?: number;
  assistMePings?: number;
  baitPings?: number;
  basicPings?: number;
  commandPings?: number;
  enemyVisionPings?: number;
  holdPings?: number;
  needVisionPings?: number;
  onMyWayPings?: number;
  pushPings?: number;
  visionClearedPings?: number;
  
  // Summoner data (attached to first match for easy access)
  summonerLevel?: number;
  championMasteries?: ChampionMastery[];
}

export interface StatComparison {
  category: string;
  description: string;
  player1Value: number;
  player2Value: number;
  winner: 1 | 2 | 'draw';
  statType: 'higher_wins' | 'lower_wins';
}

export interface BattleRound {
  roundNumber: number;
  statComparison: StatComparison;
  damage: number;
  completed: boolean;
}

export interface Battle {
  id: string;
  player1: Player;
  player2: Player;
  rounds: BattleRound[];
  currentRound: number;
  status: 'waiting' | 'in_progress' | 'completed';
  winner?: Player;
  createdAt: Date;
}

export interface GameState {
  currentPlayer: Player | null;
  currentBattle: Battle | null;
  isAuthenticated: boolean;
  gamePhase: 'login' | 'menu' | 'matchmaking' | 'battle' | 'results';
}

export interface StatCategory {
  id: string;
  name: string;
  description: string;
  getValue: (matches: MatchData[]) => number;
  higherWins: boolean;
  weight: number; // for random selection
}

export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface LeaderboardEntry {
  player: Player;
  wins: number;
  losses: number;
  winRate: number;
  rank: number;
}