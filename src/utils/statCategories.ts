import type { StatCategory, MatchData } from '../types';

const STAT_CATEGORIES: StatCategory[] = [
  // Serious Stats
  {
    id: 'avg_cs_min',
    name: 'Average CS/Min',
    description: 'Average CS per minute across last 5 ranked games',
    getValue: (matches: MatchData[]) => {
      const rankedMatches = matches.slice(0, 5);
      const avgCs = rankedMatches.reduce((sum, match) => 
        sum + (match.cs / (match.gameDuration / 60)), 0) / rankedMatches.length;
      return Number(avgCs.toFixed(1));
    },
    higherWins: true,
    weight: 3
  },
  {
    id: 'last_game_vision',
    name: 'Vision Score',
    description: 'Vision score in your most recent match',
    getValue: (matches: MatchData[]) => matches[0]?.visionScore || 0,
    higherWins: true,
    weight: 3
  },
  {
    id: 'avg_kda',
    name: 'Average KDA',
    description: 'KDA ratio across last 10 games',
    getValue: (matches: MatchData[]) => {
      const recent = matches.slice(0, 10);
      const avgKda = recent.reduce((sum, match) => {
        const kda = match.deaths === 0 ? match.kills + match.assists : 
                   (match.kills + match.assists) / match.deaths;
        return sum + kda;
      }, 0) / recent.length;
      return Number(avgKda.toFixed(2));
    },
    higherWins: true,
    weight: 4
  },

  // Meme Stats
  {
    id: 'most_deaths_game',
    name: 'Most Deaths',
    description: 'Highest death count in your last 10 games',
    getValue: (matches: MatchData[]) => 
      Math.max(...matches.slice(0, 10).map(m => m.deaths)),
    higherWins: false,
    weight: 2
  },
  {
    id: 'third_game_deaths',
    name: 'Deaths in Game #3',
    description: 'Number of deaths in your 3rd most recent game',
    getValue: (matches: MatchData[]) => matches[2]?.deaths || 0,
    higherWins: false,
    weight: 1
  },
  {
    id: 'longest_game',
    name: 'Longest Game Duration',
    description: 'Your longest game in the last 20 matches (minutes)',
    getValue: (matches: MatchData[]) => 
      Math.max(...matches.slice(0, 20).map(m => Math.floor(m.gameDuration / 60))),
    higherWins: true,
    weight: 1
  },

  // Fun/Weird Stats
  {
    id: 'total_gold_last_5',
    name: 'Total Gold Earned',
    description: 'Combined gold earned across last 5 games',
    getValue: (matches: MatchData[]) => 
      matches.slice(0, 5).reduce((sum, match) => sum + match.goldEarned, 0),
    higherWins: true,
    weight: 2
  },
  {
    id: 'perfect_games',
    name: 'Deathless Games',
    description: 'Number of games with 0 deaths in last 20 matches',
    getValue: (matches: MatchData[]) => 
      matches.slice(0, 20).filter(match => match.deaths === 0).length,
    higherWins: true,
    weight: 2
  },
  {
    id: 'aram_cs',
    name: 'ARAM CS',
    description: 'CS in your most recent ARAM game',
    getValue: (matches: MatchData[]) => {
      const aramMatch = matches.find(match => match.gameMode === 'ARAM');
      return aramMatch?.cs || 0;
    },
    higherWins: true,
    weight: 1
  },
  {
    id: 'win_streak',
    name: 'Current Win Streak',
    description: 'Consecutive wins from your most recent games',
    getValue: (matches: MatchData[]) => {
      let streak = 0;
      for (const match of matches) {
        if (match.win) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    },
    higherWins: true,
    weight: 2
  },

  // Champion Mastery Stats
  {
    id: 'teemo_mastery',
    name: 'Teemo Mastery Points',
    description: 'Total mastery points on Teemo (the devil himself)',
    getValue: (matches: MatchData[]) => {
      // This will be populated from Champion Mastery API
      return matches[0]?.championMasteries?.find(m => m.championName === 'Teemo')?.masteryPoints || 0;
    },
    higherWins: true,
    weight: 1
  },
  {
    id: 'yasuo_mastery',
    name: 'Yasuo Mastery Points',
    description: 'Total mastery points on Yasuo (wind wall man)',
    getValue: (matches: MatchData[]) => {
      return matches[0]?.championMasteries?.find(m => m.championName === 'Yasuo')?.masteryPoints || 0;
    },
    higherWins: true,
    weight: 1
  },
  {
    id: 'highest_mastery',
    name: 'Highest Mastery Champion',
    description: 'Mastery points on your most played champion',
    getValue: (matches: MatchData[]) => {
      const masteries = matches[0]?.championMasteries || [];
      return Math.max(...masteries.map(m => m.masteryPoints), 0);
    },
    higherWins: true,
    weight: 4
  },
  {
    id: 'mastery_7_count',
    name: 'Mastery Level 7 Champions',
    description: 'Number of champions with mastery level 7',
    getValue: (matches: MatchData[]) => {
      const masteries = matches[0]?.championMasteries || [];
      return masteries.filter(m => m.championLevel >= 7).length;
    },
    higherWins: true,
    weight: 3
  },

  // Additional Match Data Stats
  {
    id: 'avg_damage_dealt',
    name: 'Average Damage Dealt',
    description: 'Average damage to champions per game (last 10)',
    getValue: (matches: MatchData[]) => {
      const recent = matches.slice(0, 10);
      const avgDmg = recent.reduce((sum, match) => sum + (match.damageDealtToChampions || 0), 0) / recent.length;
      return Math.floor(avgDmg);
    },
    higherWins: true,
    weight: 4
  },
  {
    id: 'avg_damage_taken',
    name: 'Average Damage Taken',
    description: 'Average damage absorbed per game (last 10) - better positioning wins',
    getValue: (matches: MatchData[]) => {
      const recent = matches.slice(0, 10);
      const avgDmg = recent.reduce((sum, match) => sum + (match.damageTaken || 0), 0) / recent.length;
      return Math.floor(avgDmg);
    },
    higherWins: false,
    weight: 2
  },
  {
    id: 'total_healing',
    name: 'Healing Done',
    description: 'Total healing provided to allies (last 5 games)',
    getValue: (matches: MatchData[]) => {
      return matches.slice(0, 5).reduce((sum, match) => sum + (match.totalHeal || 0), 0);
    },
    higherWins: true,
    weight: 2
  },
  {
    id: 'total_minions',
    name: 'Total Minions Killed',
    description: 'Combined minions + jungle monsters (last 5 games)',
    getValue: (matches: MatchData[]) => {
      return matches.slice(0, 5).reduce((sum, match) => 
        sum + (match.totalMinionsKilled || 0) + (match.neutralMinionsKilled || 0), 0);
    },
    higherWins: true,
    weight: 2
  },
  {
    id: 'wards_placed',
    name: 'Wards Placed',
    description: 'Total wards placed (last 10 games)',
    getValue: (matches: MatchData[]) => {
      return matches.slice(0, 10).reduce((sum, match) => sum + (match.wardsPlaced || 0), 0);
    },
    higherWins: true,
    weight: 2
  },
  {
    id: 'wards_killed',
    name: 'Wards Destroyed',
    description: 'Enemy wards destroyed (last 10 games)',
    getValue: (matches: MatchData[]) => {
      return matches.slice(0, 10).reduce((sum, match) => sum + (match.wardsKilled || 0), 0);
    },
    higherWins: true,
    weight: 2
  },

  // Ping Stats
  {
    id: 'danger_pings',
    name: 'Danger Pings',
    description: 'Total danger pings sent (last 10) - less panic wins',
    getValue: (matches: MatchData[]) => {
      return matches.slice(0, 10).reduce((sum, match) => sum + (match.dangerPings || 0), 0);
    },
    higherWins: false,
    weight: 1
  },
  {
    id: 'enemy_missing_pings',
    name: 'Missing Enemy Pings',
    description: 'Enemy missing pings (last 10) - awareness wins',
    getValue: (matches: MatchData[]) => {
      return matches.slice(0, 10).reduce((sum, match) => sum + (match.enemyMissingPings || 0), 0);
    },
    higherWins: true,
    weight: 1
  },

  // Summoner & Account Stats
  {
    id: 'summoner_level',
    name: 'Summoner Level',
    description: 'Current summoner level - veteran bonus',
    getValue: (matches: MatchData[]) => {
      return matches[0]?.summonerLevel || 0;
    },
    higherWins: true,
    weight: 3
  },
  {
    id: 'account_age',
    name: 'Account Age',
    description: 'Days since account creation - experience matters',
    getValue: (matches: MatchData[]) => {
      const creationDate = matches[0]?.accountCreationDate;
      if (!creationDate) return 0;
      return Math.floor((Date.now() - creationDate) / (1000 * 60 * 60 * 24));
    },
    higherWins: true,
    weight: 2
  },

  // Creative Match Stats
  {
    id: 'snowball_games',
    name: 'Snowball Games',
    description: 'Games won with 15+ kill advantage (last 20)',
    getValue: (matches: MatchData[]) => {
      return matches.slice(0, 20).filter(match => 
        match.win && (match.kills + match.assists - match.deaths) >= 15
      ).length;
    },
    higherWins: true,
    weight: 2
  },
  {
    id: 'clutch_factor',
    name: 'Clutch Factor',
    description: 'Games won with negative KDA (last 15) - carried by team',
    getValue: (matches: MatchData[]) => {
      return matches.slice(0, 15).filter(match => 
        match.win && (match.kills + match.assists) < match.deaths
      ).length;
    },
    higherWins: true,
    weight: 2
  },
  {
    id: 'one_trick_tendency',
    name: 'One-Trick Tendency',
    description: '% of games on most played champion (last 20) - diversity wins',
    getValue: (matches: MatchData[]) => {
      const recent = matches.slice(0, 20);
      const championCounts = new Map();
      recent.forEach(match => {
        championCounts.set(match.championName, (championCounts.get(match.championName) || 0) + 1);
      });
      const maxCount = Math.max(...championCounts.values());
      return Math.floor((maxCount / recent.length) * 100);
    },
    higherWins: false,
    weight: 1
  },
  {
    id: 'late_game_specialist',
    name: 'Late Game Specialist',
    description: 'Win rate in 35+ minute games (last 20)',
    getValue: (matches: MatchData[]) => {
      const longGames = matches.slice(0, 20).filter(match => match.gameDuration >= 2100); // 35+ min
      if (longGames.length === 0) return 0;
      const wins = longGames.filter(match => match.win).length;
      return Math.floor((wins / longGames.length) * 100);
    },
    higherWins: true,
    weight: 2
  },
  {
    id: 'early_game_dominance',
    name: 'Early Game Kills',
    description: 'Average kills in first 15 minutes (last 10)',
    getValue: (matches: MatchData[]) => {
      const recent = matches.slice(0, 10);
      // Estimate based on game duration - if short game, likely high early kills
      const avgEarlyKills = recent.reduce((sum, match) => {
        const gameMinutes = match.gameDuration / 60;
        const estimatedEarlyKills = gameMinutes < 25 ? match.kills * 0.7 : match.kills * 0.4;
        return sum + estimatedEarlyKills;
      }, 0) / recent.length;
      return Number(avgEarlyKills.toFixed(1));
    },
    higherWins: true,
    weight: 2
  },
  {
    id: 'support_carry',
    name: 'Support Carry',
    description: 'Games with 0-1 kills but 15+ assists (last 20)',
    getValue: (matches: MatchData[]) => {
      return matches.slice(0, 20).filter(match => 
        match.kills <= 1 && match.assists >= 15
      ).length;
    },
    higherWins: true,
    weight: 2
  }
];

export function getRandomStatCategory(): StatCategory {
  const totalWeight = STAT_CATEGORIES.reduce((sum, cat) => sum + cat.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const category of STAT_CATEGORIES) {
    random -= category.weight;
    if (random <= 0) {
      return category;
    }
  }
  
  return STAT_CATEGORIES[0]; // Fallback
}

export function getRandomStatChoices(count: number = 3): StatCategory[] {
  if (count >= STAT_CATEGORIES.length) {
    return [...STAT_CATEGORIES];
  }
  
  // Create a weighted selection pool
  const choices: StatCategory[] = [];
  const availableStats = [...STAT_CATEGORIES];
  
  for (let i = 0; i < count; i++) {
    if (availableStats.length === 0) break;
    
    const totalWeight = availableStats.reduce((sum, cat) => sum + cat.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedIndex = 0;
    
    for (let j = 0; j < availableStats.length; j++) {
      random -= availableStats[j].weight;
      if (random <= 0) {
        selectedIndex = j;
        break;
      }
    }
    
    choices.push(availableStats[selectedIndex]);
    availableStats.splice(selectedIndex, 1); // Remove to avoid duplicates
  }
  
  return choices;
}

export function calculateDamage(winner: 1 | 2 | 'draw', player1Value: number, player2Value: number): number {
  // Handle draw case - no damage dealt
  if (winner === 'draw') {
    return 0;
  }
  
  const difference = Math.abs(player1Value - player2Value);
  const baseDamage = 15;
  
  // Prevent division by zero when both values are 0
  const maxValue = Math.max(player1Value, player2Value);
  if (maxValue === 0) {
    return baseDamage; // Return base damage if both values are 0
  }
  
  // Scale damage based on difference (min 10%, max 25%)
  const scaleFactor = Math.min(Math.max(difference / maxValue, 0.1), 0.25);
  
  return Math.floor(baseDamage * (1 + scaleFactor));
}

export { STAT_CATEGORIES };