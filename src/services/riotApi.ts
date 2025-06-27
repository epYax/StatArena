import type { RiotAccount, MatchData, Player, ChampionMastery } from '../types';
import { getRandomFamousPlayer, getFamousPlayersByRegion } from '../data/famousPlayers';
// import { supabase } from './supabase';

// Configuration - temporarily back to direct API calls
const RIOT_API_KEY = import.meta.env.VITE_RIOT_API_KEY;
const REGIONAL = import.meta.env.VITE_RIOT_REGIONAL || 'americas';
// const RIOT_API_BASE = `https://${REGIONAL}.api.riotgames.com`;

// Simple rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // 100ms between requests

// Helper function to get correct server region based on tag
function getServerFromTag(tagLine: string): { region: string; regional: string } {
  const tag = tagLine.toUpperCase();
  
  // European servers
  if (tag === 'EUW' || tag.includes('EUW')) {
    return { region: 'euw1', regional: 'europe' };
  } else if (tag === 'EUNE' || tag.includes('EUN')) {
    return { region: 'eun1', regional: 'europe' };
  } else if (tag === 'TR1' || tag === 'TR') {
    return { region: 'tr1', regional: 'europe' };
  } else if (tag === 'RU' || tag === 'RU1') {
    return { region: 'ru', regional: 'europe' };
  }
  
  // Americas servers
  else if (tag === 'NA1' || tag === 'NA') {
    return { region: 'na1', regional: 'americas' };
  } else if (tag === 'BR1' || tag === 'BR') {
    return { region: 'br1', regional: 'americas' };
  } else if (tag === 'LAN' || tag === 'LA1') {
    return { region: 'la1', regional: 'americas' };
  } else if (tag === 'LAS' || tag === 'LA2') {
    return { region: 'la2', regional: 'americas' };
  }
  
  // Asia servers
  else if (tag === 'KR' || tag === 'KR1') {
    return { region: 'kr', regional: 'asia' };
  } else if (tag === 'JP1' || tag === 'JP') {
    return { region: 'jp1', regional: 'asia' };
  }
  
  // SEA/Oceania servers
  else if (tag === 'OC1' || tag === 'OCE') {
    return { region: 'oc1', regional: 'sea' };
  } else if (tag === 'PH2' || tag === 'PH') {
    return { region: 'ph2', regional: 'sea' };
  } else if (tag === 'SG2' || tag === 'SG') {
    return { region: 'sg2', regional: 'sea' };
  } else if (tag === 'TH2' || tag === 'TH') {
    return { region: 'th2', regional: 'sea' };
  } else if (tag === 'TW2' || tag === 'TW') {
    return { region: 'tw2', regional: 'sea' };
  } else if (tag === 'VN2' || tag === 'VN') {
    return { region: 'vn2', regional: 'sea' };
  }
  
  // Check for common tag patterns
  else if (tag.includes('EU')) {
    return { region: 'euw1', regional: 'europe' };
  } else if (tag.includes('ASIA')) {
    return { region: 'kr', regional: 'asia' };
  }
  
  // Default to Europe (since most tags are European format)
  return { region: 'euw1', regional: 'europe' };
}

// Secure API call via Supabase Edge Function
// async function callRiotAPI(endpoint: string, region?: string, regional?: string, params?: Record<string, any>) {
//   try {
//     const { data: { session } } = await supabase.auth.getSession();
//     
//     if (!session) {
//       throw new Error('User not authenticated');
//     }

//     const response = await supabase.functions.invoke('riot-api', {
//       body: {
//         endpoint,
//         region: region || 'euw1',
//         regional: regional || REGIONAL,
//         params: params || {}
//       }
//     });

//     if (response.error) {
//       throw new Error(`Supabase function error: ${response.error.message}`);
//     }

//     return response.data;
//   } catch (error) {
//     console.error('Error calling Riot API via Supabase:', error);
//     throw error;
//   }
// }

// Fallback data for demo mode (using reliable icon IDs)
const MOCK_SUMMONER_ICONS = [
  'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/profileicon/29.png',
  'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/profileicon/588.png',
  'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/profileicon/1394.png',
  'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/profileicon/3379.png',
  'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/profileicon/4578.png',
];

const MOCK_CHAMPIONS = [
  'Ahri', 'Yasuo', 'Jinx', 'Thresh', 'Lee Sin', 'Zed', 'Katarina', 'Vayne',
  'Ezreal', 'Lux', 'Riven', 'Teemo', 'Darius', 'Garen', 'Ashe', 'Veigar'
];

function generateMockChampionMasteries(): ChampionMastery[] {
  const masteries: ChampionMastery[] = [];
  const champions = ['Teemo', 'Yasuo', 'Jinx', 'Thresh', 'Lee Sin', 'Zed', 'Katarina', 'Vayne', 'Ezreal', 'Lux'];
  
  champions.forEach((champion, index) => {
    masteries.push({
      championId: 17 + index, // Mock champion IDs
      championName: champion,
      championLevel: Math.floor(Math.random() * 7) + 1,
      masteryPoints: Math.floor(Math.random() * 500000) + 10000,
      lastPlayTime: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000 // Within last 30 days
    });
  });
  
  return masteries.sort((a, b) => b.masteryPoints - a.masteryPoints);
}

function generateMockMatchData(): MatchData[] {
  const matches: MatchData[] = [];
  const mockMasteries = generateMockChampionMasteries();
  
  for (let i = 0; i < 25; i++) {
    const gameDuration = 1200 + Math.random() * 1800;
    const isWin = Math.random() > 0.45;
    const kills = Math.floor(Math.random() * 20);
    const deaths = Math.floor(Math.random() * 12);
    const assists = Math.floor(Math.random() * 25);
    
    const match: MatchData = {
      gameId: `MOCK_${Date.now()}_${i}`,
      kills,
      deaths,
      assists,
      cs: Math.floor((gameDuration / 60) * (4 + Math.random() * 6)),
      gameDuration: Math.floor(gameDuration),
      championName: MOCK_CHAMPIONS[Math.floor(Math.random() * MOCK_CHAMPIONS.length)],
      visionScore: Math.floor(Math.random() * 80),
      goldEarned: Math.floor(10000 + Math.random() * 15000),
      items: Array(6).fill(0).map(() => Math.floor(Math.random() * 4000)),
      gameMode: Math.random() > 0.8 ? 'ARAM' : 'CLASSIC',
      win: isWin,
      
      // Additional Match API fields
      damageDealtToChampions: Math.floor(15000 + Math.random() * 30000),
      damageTaken: Math.floor(12000 + Math.random() * 25000),
      totalHeal: Math.floor(Math.random() * 8000),
      totalMinionsKilled: Math.floor((gameDuration / 60) * (3 + Math.random() * 5)),
      neutralMinionsKilled: Math.floor((gameDuration / 60) * (0.5 + Math.random() * 2)),
      wardsPlaced: Math.floor(Math.random() * 30) + 5,
      wardsKilled: Math.floor(Math.random() * 15),
      
      // Mock ping stats
      dangerPings: Math.floor(Math.random() * 20),
      enemyMissingPings: Math.floor(Math.random() * 15),
      allInPings: Math.floor(Math.random() * 8),
      assistMePings: Math.floor(Math.random() * 10),
      basicPings: Math.floor(Math.random() * 25) + 5,
      commandPings: Math.floor(Math.random() * 12),
      enemyVisionPings: Math.floor(Math.random() * 8),
      holdPings: Math.floor(Math.random() * 6),
      needVisionPings: Math.floor(Math.random() * 10),
      onMyWayPings: Math.floor(Math.random() * 15),
      pushPings: Math.floor(Math.random() * 8),
      visionClearedPings: Math.floor(Math.random() * 5)
    };
    
    // Add summoner data to first match
    if (i === 0) {
      match.summonerLevel = Math.floor(Math.random() * 300) + 30;
      // match.accountCreationDate = Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000; // 0-5 years ago
      match.championMasteries = mockMasteries;
    }
    
    matches.push(match);
  }
  
  return matches;
}

// Champion ID to Name mapping - from Riot Data Dragon
const CHAMPION_ID_MAP: Record<number, string> = {
  1: 'Annie', 2: 'Olaf', 3: 'Galio', 4: 'Twisted Fate', 5: 'Xin Zhao', 6: 'Urgot', 7: 'LeBlanc', 8: 'Vladimir', 9: 'Fiddlesticks',
  10: 'Kayle', 11: 'Master Yi', 12: 'Alistar', 13: 'Ryze', 14: 'Sion', 15: 'Sivir', 16: 'Soraka', 17: 'Teemo', 18: 'Tristana',
  19: 'Warwick', 20: 'Nunu & Willump', 21: 'Miss Fortune', 22: 'Ashe', 23: 'Tryndamere', 24: 'Jax', 25: 'Morgana', 26: 'Zilean',
  27: 'Singed', 28: 'Evelynn', 29: 'Twitch', 30: 'Karthus', 31: 'Cho\'Gath', 32: 'Amumu', 33: 'Rammus', 34: 'Anivia',
  35: 'Shaco', 36: 'Dr. Mundo', 37: 'Sona', 38: 'Kassadin', 39: 'Irelia', 40: 'Janna', 41: 'Gangplank', 42: 'Corki',
  43: 'Karma', 44: 'Taric', 45: 'Veigar', 48: 'Trundle', 50: 'Swain', 51: 'Caitlyn', 53: 'Blitzcrank', 54: 'Malphite',
  55: 'Katarina', 56: 'Nocturne', 57: 'Maokai', 58: 'Renekton', 59: 'Jarvan IV', 60: 'Elise', 61: 'Orianna', 62: 'Wukong',
  63: 'Brand', 64: 'Lee Sin', 67: 'Vayne', 68: 'Rumble', 69: 'Cassiopeia', 72: 'Skarner', 74: 'Heimerdinger', 75: 'Nasus',
  76: 'Nidalee', 77: 'Udyr', 78: 'Poppy', 79: 'Gragas', 80: 'Pantheon', 81: 'Ezreal', 82: 'Mordekaiser', 83: 'Yorick',
  84: 'Akali', 85: 'Kennen', 86: 'Garen', 89: 'Leona', 90: 'Malzahar', 91: 'Talon', 92: 'Riven', 96: 'Kog\'Maw',
  98: 'Shen', 99: 'Lux', 101: 'Xerath', 102: 'Shyvana', 103: 'Ahri', 104: 'Graves', 105: 'Fizz', 106: 'Volibear',
  107: 'Rengar', 110: 'Varus', 111: 'Nautilus', 112: 'Viktor', 113: 'Sejuani', 114: 'Fiora', 115: 'Ziggs', 117: 'Lulu',
  119: 'Draven', 120: 'Hecarim', 121: 'Kha\'Zix', 122: 'Darius', 126: 'Jayce', 127: 'Lisandra', 131: 'Diana', 133: 'Quinn',
  134: 'Syndra', 136: 'Aurelion Sol', 141: 'Kayn', 142: 'Zoe', 143: 'Zyra', 145: 'Kai\'Sa', 147: 'Seraphine', 150: 'Gnar',
  154: 'Zac', 157: 'Yasuo', 161: 'Vel\'Koz', 163: 'Taliyah', 164: 'Camille', 201: 'Braum', 202: 'Jhin', 203: 'Kindred',
  222: 'Jinx', 223: 'Tahm Kench', 234: 'Viego', 235: 'Senna', 236: 'Lucian', 238: 'Zed', 240: 'Kled', 245: 'Ekko',
  246: 'Qiyana', 254: 'Vi', 266: 'Aatrox', 267: 'Nami', 268: 'Azir', 350: 'Yuumi', 360: 'Samira', 412: 'Thresh',
  420: 'Illaoi', 421: 'Rek\'Sai', 427: 'Ivern', 429: 'Kalista', 432: 'Bard', 497: 'Rakan', 498: 'Xayah', 516: 'Ornn',
  517: 'Sylas', 518: 'Neeko', 523: 'Aphelios', 526: 'Rell', 555: 'Pyke', 711: 'Vex', 777: 'Yone', 875: 'Sett',
  876: 'Lillia', 887: 'Gwen', 888: 'Renata Glasc', 895: 'Nilah', 897: 'K\'Sante', 901: 'Smolder', 902: 'Aurora', 950: 'Naafiri'
};

// Helper function - use CORS proxy for development
async function makeRiotAPIRequest(url: string) {
  // Simple rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();

  if (!RIOT_API_KEY) {
    throw new Error('Riot API key not configured');
  }

  // Try direct API call first (might work in dev environment)
  console.log(`🔍 Making direct API request: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
        'Accept': 'application/json'
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Riot API error: ${response.status} - ${errorText}`);
      
      if (response.status === 404) {
        throw new Error('Player or data not found');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded - too many API requests. Using demo mode.');
      } else if (response.status === 403) {
        throw new Error('API key is invalid or expired. Using demo mode.');
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    }

    const jsonData = await response.json();
    
    // 🔍 DETAILED API RESPONSE LOGGING
    console.group(`📊 API Response: ${url}`);
    console.log('🔍 Full Response Data:', JSON.stringify(jsonData, null, 2));
    console.log('🔍 Response Type:', typeof jsonData);
    console.log('🔍 Response Keys:', Object.keys(jsonData || {}));
    console.groupEnd();
    
    return jsonData;
  } catch (error) {
    console.error('Direct API request failed:', error);
    throw error;
  }
}

export class RiotApiService {
  private static instance: RiotApiService;
  private mockUsers = new Map<string, { account: RiotAccount; matches: MatchData[] }>();

  static getInstance(): RiotApiService {
    if (!RiotApiService.instance) {
      RiotApiService.instance = new RiotApiService();
    }
    return RiotApiService.instance;
  }

  async authenticateWithRiot(gameName?: string, tagLine?: string): Promise<RiotAccount> {
    // If no game name provided, use mock mode for demo
    if (!gameName || !tagLine) {
      console.log('No credentials provided, using mock mode for demo');
      return this.mockAuthentication();
    }

    try {
      // Get correct regional endpoint based on tag
      const { regional } = getServerFromTag(tagLine);
      const regionalApiBase = `https://${regional}.api.riotgames.com`;
      
      // Real API call to get account by Riot ID
      const url = `${regionalApiBase}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
      console.log(`🔍 Looking up account on ${regional}: ${url}`);
      const accountData = await makeRiotAPIRequest(url);
      
      console.group(`🎮 ACCOUNT LOOKUP RESULT`);
      console.log(`✅ Successfully found Riot account: ${accountData.gameName}#${accountData.tagLine}`);
      console.log(`🆔 PUUID: ${accountData.puuid}`);
      console.log(`🔍 Complete Account Data:`, JSON.stringify(accountData, null, 2));
      console.groupEnd();
      
      return {
        puuid: accountData.puuid,
        gameName: accountData.gameName,
        tagLine: accountData.tagLine
      };
    } catch (error) {
      console.error('❌ Failed to authenticate with Riot API:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          throw new Error(`Player "${gameName}#${tagLine}" not found. Please check your Riot ID.`);
        } else if (error.message.includes('403')) {
          throw new Error('API key is invalid or expired. Using demo mode.');
        } else if (error.message.includes('CORS')) {
          throw new Error('CORS error: Cannot connect to Riot API from browser. Using demo mode.');
        }
      }
      
      throw new Error('Failed to connect to Riot API. Using demo mode.');
    }
  }

  private async mockAuthentication(): Promise<RiotAccount> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockAccount: RiotAccount = {
      puuid: `MOCK_PUUID_${Date.now()}`,
      gameName: `Player${Math.floor(Math.random() * 9999)}`,
      tagLine: 'LOL'
    };

    this.mockUsers.set(mockAccount.puuid, {
      account: mockAccount,
      matches: generateMockMatchData()
    });

    return mockAccount;
  }

  async createMockAccountWithName(gameName: string, tagLine: string): Promise<RiotAccount> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockAccount: RiotAccount = {
      puuid: `MOCK_PUUID_${gameName}_${Date.now()}`,
      gameName: gameName,
      tagLine: tagLine
    };

    this.mockUsers.set(mockAccount.puuid, {
      account: mockAccount,
      matches: generateMockMatchData()
    });

    return mockAccount;
  }

  async getEnhancedMatchHistory(puuid: string, tagLine?: string): Promise<MatchData[]> {
    console.log(`🔄 Getting enhanced match history for PUUID: ${puuid}, tagLine: ${tagLine}`);
    
    // SAFETY CHECK: Verify this is not a mock PUUID being passed to real API
    if (puuid.startsWith('MOCK_')) {
      console.warn('⚠️ WARNING: Mock PUUID passed to getEnhancedMatchHistory, returning mock data');
      return generateMockMatchData();
    }
    
    // Get match history first (most important)
    let matches: MatchData[];
    try {
      matches = await this.getMatchHistory(puuid, tagLine);
      console.log(`✅ Got ${matches.length} matches`);
    } catch (error) {
      console.error('❌ Failed to get match history:', error);
      throw error; // Re-throw match history errors since this is essential
    }
    
    // Get additional data with individual error handling
    let masteries: any[] = [];
    try {
      masteries = await this.getChampionMasteries(puuid, tagLine);
      console.log(`✅ Got ${masteries.length} champion masteries`);
    } catch (error) {
      console.error('⚠️ Failed to get champion masteries, continuing without them:', error);
    }
    
    let summonerData: any = null;
    try {
      summonerData = await this.getSummonerData(puuid, tagLine);
      console.log(`✅ Got summoner data: level ${summonerData?.level}`);
    } catch (error) {
      console.error('⚠️ Failed to get summoner data, continuing without it:', error);
    }
    
    // Attach additional data to first match for easy access
    if (matches.length > 0) {
      if (masteries.length > 0) {
        matches[0].championMasteries = masteries;
      }
      if (summonerData) {
        matches[0].summonerLevel = summonerData.level;
      }
    }
    
    return matches;
  }

  async getMatchHistory(puuid: string, tagLine?: string): Promise<MatchData[]> {
    console.log(`🎯 MATCH HISTORY REQUEST: PUUID=${puuid}, TagLine=${tagLine}`);
    
    // If mock user, return mock data
    if (puuid.startsWith('MOCK_')) {
      console.log('🎭 Using MOCK data for', puuid);
      const userData = this.mockUsers.get(puuid);
      if (!userData) {
        throw new Error('User not found');
      }
      return userData.matches;
    }

    try {
      // Get correct regional endpoint
      const { regional } = tagLine ? getServerFromTag(tagLine) : { regional: REGIONAL };
      const regionalApiBase = `https://${regional}.api.riotgames.com`;
      
      // Get match IDs
      const matchIdsUrl = `${regionalApiBase}/lol/match/v5/matches/by-puuid/${puuid}/ids?count=20`;
      console.log(`🔍 Fetching match history from ${regional} region for PUUID: ${puuid.substring(0, 10)}...`);
      const matchIds = await makeRiotAPIRequest(matchIdsUrl);
      
      if (!matchIds || matchIds.length === 0) {
        console.warn('⚠️ No matches found for this player, using mock data');
        return generateMockMatchData();
      }

      console.log(`📝 Found ${matchIds.length} matches, testing exactly 15 to find the break point...`);

      // Get match details for each match (test 15 to find where it breaks)
      const matchPromises = matchIds.slice(0, 15).map(async (matchId: string, index: number) => {
        const matchUrl = `${regionalApiBase}/lol/match/v5/matches/${matchId}`;
        const matchData = await makeRiotAPIRequest(matchUrl);
        
        // Find the participant data for this player
        // Find the participant data for this player
        const participant = matchData.info.participants.find(
          (p: any) => p.puuid === puuid
        );

        if (!participant) {
          console.error(`❌ PUUID MISMATCH in match #${index + 1} (${matchId}):`);
          console.error(`❌ Looking for: ${puuid}`);
          console.error(`❌ Available PUUIDs:`, matchData.info.participants.map((p: any) => p.puuid));
          console.error(`❌ Match participants names:`, matchData.info.participants.map((p: any) => p.summonerName || 'Unknown'));
          console.error(`❌ This indicates match #${index + 1} belongs to a different player!`);
          
          // Skip this match instead of crashing
          console.warn(`⚠️ Skipping match #${index + 1} due to PUUID mismatch`);
          return null; // Return null to filter out later
        }
        
        // Verify the participant matches our expected player
        console.log(`✅ Match #${index + 1} (${matchId}): Found ${participant.summonerName} playing ${participant.championName}`);

        return {
          gameId: matchData.metadata.matchId,
          kills: participant.kills,
          deaths: participant.deaths,
          assists: participant.assists,
          cs: participant.totalMinionsKilled + participant.neutralMinionsKilled,
          gameDuration: matchData.info.gameDuration,
          championName: participant.championName,
          visionScore: participant.visionScore,
          goldEarned: participant.goldEarned,
          items: [
            participant.item0,
            participant.item1,
            participant.item2,
            participant.item3,
            participant.item4,
            participant.item5
          ],
          gameMode: matchData.info.gameMode,
          win: participant.win,
          
          // Additional Match API fields
          damageDealtToChampions: participant.totalDamageDealtToChampions,
          damageTaken: participant.totalDamageTaken,
          totalHeal: participant.totalHeal,
          totalMinionsKilled: participant.totalMinionsKilled,
          neutralMinionsKilled: participant.neutralMinionsKilled,
          wardsPlaced: participant.wardsPlaced,
          wardsKilled: participant.wardsKilled,
          
          // Ping stats (undocumented fields)
          dangerPings: participant.dangerPings,
          enemyMissingPings: participant.enemyMissingPings,
          allInPings: participant.allInPings,
          assistMePings: participant.assistMePings,
          baitPings: participant.baitPings,
          basicPings: participant.basicPings,
          commandPings: participant.commandPings,
          enemyVisionPings: participant.enemyVisionPings,
          holdPings: participant.holdPings,
          needVisionPings: participant.needVisionPings,
          onMyWayPings: participant.onMyWayPings,
          pushPings: participant.pushPings,
          visionClearedPings: participant.visionClearedPings
        } as MatchData;
      });

      const results = await Promise.all(matchPromises);
      
      // Filter out null results (failed matches)
      const validMatches = results.filter(match => match !== null);
      
      console.log(`✅ Successfully processed ${validMatches.length} out of ${matchPromises.length} matches`);
      if (validMatches.length < matchPromises.length) {
        console.warn(`⚠️ Skipped ${matchPromises.length - validMatches.length} matches due to PUUID mismatches`);
      }
      
      return validMatches;
    } catch (error) {
      console.error('Failed to fetch match history:', error);
      console.log('Falling back to mock data');
      return generateMockMatchData();
    }
  }

  async getChampionMasteries(puuid: string, tagLine?: string): Promise<ChampionMastery[]> {
    // If mock user, return mock data
    if (puuid.startsWith('MOCK_')) {
      return generateMockChampionMasteries();
    }

    try {
      // Get correct region for this player
      const { region } = tagLine ? getServerFromTag(tagLine) : { region: 'na1' };
      console.log(`🌍 Using region: ${region} for tagLine: ${tagLine}`);
      
      // Use the PUUID directly for champion masteries - no need for summoner ID!
      const masteriesUrl = `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`;
      console.log(`🏆 Fetching masteries directly by PUUID from: ${masteriesUrl}`);
      const masteriesData = await makeRiotAPIRequest(masteriesUrl);
      
      console.group(`🏆 CHAMPION MASTERIES DEBUG`);
      console.log(`✅ Fetched ${masteriesData.length} champion masteries`);
      console.log(`🔍 First 3 raw mastery objects:`, JSON.stringify(masteriesData.slice(0, 3), null, 2));
      console.log(`🔍 All champion IDs found:`, masteriesData.map((m: any) => m.championId));
      console.log(`🔍 Mastery levels:`, masteriesData.map((m: any) => m.championLevel));
      console.log(`🔍 Mastery points:`, masteriesData.map((m: any) => m.championPoints));
      console.log(`🔍 Raw mastery object structure:`, Object.keys(masteriesData[0] || {}));
      console.groupEnd();
      
      // Convert to our format with proper champion names
      const convertedMasteries = masteriesData.map((mastery: any) => {
        const championName = CHAMPION_ID_MAP[mastery.championId] || `Unknown Champion ${mastery.championId}`;
        return {
          championId: mastery.championId,
          championName: championName,
          championLevel: mastery.championLevel,
          masteryPoints: mastery.championPoints,
          lastPlayTime: mastery.lastPlayTime
        };
      });
      
      console.group(`📊 CONVERTED MASTERIES`);
      console.log(`✅ Converted ALL ${convertedMasteries.length} masteries with proper names:`);
      console.log(`🔝 Top 5 masteries:`);
      convertedMasteries.slice(0, 5).forEach((mastery: any, index: number) => {
        console.log(`${index + 1}. ${mastery.championName} (ID: ${mastery.championId}) - Level ${mastery.championLevel} - ${mastery.masteryPoints.toLocaleString()} points`);
      });
      console.log(`... and ${convertedMasteries.length - 5} more champions`);
      console.groupEnd();
      
      return convertedMasteries;
    } catch (error) {
      console.error('❌ Failed to fetch champion masteries:', error);
      throw error; // Re-throw to see the actual error
    }
  }

  async getSummonerData(puuid: string, tagLine?: string): Promise<{ level: number } | null> {
    // If mock user, return mock data
    if (puuid.startsWith('MOCK_')) {
      return {
        level: Math.floor(Math.random() * 300) + 30
      };
    }

    // Try different regions since PUUID might be from different server than tagLine suggests
    const regionsToTry = [
      // Start with region from tagLine if available
      tagLine ? getServerFromTag(tagLine).region : 'euw1',
      // Then try other common regions
      'euw1', 'eune1', 'na1', 'kr', 'br1', 'la1', 'la2', 'oc1', 'ru', 'tr1', 'jp1'
    ];
    
    // Remove duplicates
    const uniqueRegions = [...new Set(regionsToTry)];
    
    for (const region of uniqueRegions) {
      try {
        const summonerUrl = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
        console.log(`🔍 Trying summoner data from ${region}: ${summonerUrl}`);
        const summonerData = await makeRiotAPIRequest(summonerUrl);
        
        if (summonerData && summonerData.summonerLevel !== undefined) {
          console.log(`✅ Found summoner data on ${region}: Level ${summonerData.summonerLevel}`);
          
          return {
            level: summonerData.summonerLevel
          };
        }
      } catch (error) {
        console.log(`❌ Region ${region} failed, trying next...`);
        continue;
      }
    }
    
    throw new Error(`Summoner not found on any region for PUUID: ${puuid}`);
  }

  async createPlayer(account: RiotAccount): Promise<Player> {
    console.log(`🎮 CREATING PLAYER: ${account.gameName}#${account.tagLine} (PUUID: ${account.puuid})`);
    
    // Use enhanced match history which includes all additional data
    const matches = await this.getEnhancedMatchHistory(account.puuid, account.tagLine);
    
    const wins = matches.filter(m => m.win).length;
    const losses = matches.filter(m => !m.win).length;
    
    let summonerIcon = MOCK_SUMMONER_ICONS[Math.floor(Math.random() * MOCK_SUMMONER_ICONS.length)];
    let rank = undefined;
    
    // Try to get real summoner info for icon and rank (non-blocking)
    if (!account.puuid.startsWith('MOCK_')) {
      try {
        // Get correct region for this player
        const { region } = getServerFromTag(account.tagLine);
        const summonerUrl = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`;
        console.log(`🌍 Trying ${region} server for summoner data...`);
        
        const summonerData = await makeRiotAPIRequest(summonerUrl);
        
        console.group(`🎮 PLAYER CREATION SUMMONER DATA`);
        console.log(`✅ Got summoner data:`, JSON.stringify(summonerData, null, 2));
        console.log(`🔍 Summoner ID check: summonerData.id = ${summonerData.id}`);
        console.log(`🔍 All summoner data keys:`, Object.keys(summonerData));
        console.log(`🔍 Profile Icon ID: ${summonerData.profileIconId}`);
        console.log(`🔍 Summoner Level: ${summonerData.summonerLevel}`);
        console.log(`🔍 Revision Date: ${summonerData.revisionDate} (${new Date(summonerData.revisionDate)})`);
        console.groupEnd();
        
        const iconId = summonerData.profileIconId;
        
        // Try Community Dragon first for newer icons, then fallback to Data Dragon
        if (iconId > 5000) {
          console.warn(`⚠️ High icon ID detected (${iconId}), trying Community Dragon CDN`);
          // Community Dragon often has newer icons
          summonerIcon = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${iconId}.jpg`;
          console.log(`📷 Using Community Dragon for high icon ID: ${summonerIcon}`);
        } else {
          // Use standard Data Dragon for lower IDs
          summonerIcon = `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${iconId}.png`;
          console.log(`✅ Using Data Dragon for icon ID: ${iconId}`);
          console.log(`📷 Icon URL: ${summonerIcon}`);
        }

        // Try to get rank data using PUUID
        try {
          const rankUrl = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-puuid/${account.puuid}`;
          console.log(`🏆 Fetching rank data using PUUID: ${rankUrl}`);
          const rankData = await makeRiotAPIRequest(rankUrl);
            
            // Find SoloQ rank (RANKED_SOLO_5x5)
            const soloqEntry = rankData.find((entry: any) => entry.queueType === 'RANKED_SOLO_5x5');
            if (soloqEntry) {
              rank = `${soloqEntry.tier} ${soloqEntry.rank}`;
              console.log(`🏆 Found SoloQ rank: ${rank}`);
            } else {
              console.log(`🏆 No SoloQ rank found (unranked)`);
            }
        } catch (rankError) {
          console.warn('⚠️ Could not fetch rank data using PUUID:', rankError);
          // Ensure rank stays undefined so fallback triggers
          rank = undefined;
        }
      } catch (error) {
        console.warn('⚠️ Could not fetch summoner data:', error);
        console.warn(`🔍 Failed URL was: https://${getServerFromTag(account.tagLine).region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`);
        // This is not an error - player might exist on different server or not have played LoL
      }
    }
    
    // For mock accounts or when API fails, always ensure we have a rank
    console.log(`🔍 Checking rank before fallback: ${rank}`);
    if (!rank) {
      const mockRanks = ['IRON IV', 'BRONZE II', 'SILVER III', 'GOLD I', 'PLATINUM II', 'DIAMOND IV'];
      rank = mockRanks[Math.floor(Math.random() * mockRanks.length)];
      console.log(`🎲 Generated mock rank: ${rank}`);
    } else {
      console.log(`✅ Using existing rank: ${rank}`);
    }
    
    const player = {
      id: account.puuid,
      summonerName: `${account.gameName}#${account.tagLine}`,
      summonerIcon,
      puuid: account.puuid,
      hp: 100,
      maxHp: 100,
      wins,
      losses,
      rank,
      badges: []
    };
    
    console.log(`🎮 Created player with rank: ${player.rank}`);
    return player;
  }

  // For demo purposes - find famous player opponent or create random
  async findRandomOpponent(playerRegion?: string): Promise<Player> {
    console.log('🔍 Looking for opponent...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate matchmaking delay
    
    // Try to get a famous player first
    const famousOpponent = await this.tryGetFamousOpponent(playerRegion);
    if (famousOpponent) {
      console.log(`⭐ Found famous opponent: ${famousOpponent.summonerName}`);
      return famousOpponent;
    }
    
    // Fall back to mock opponent
    console.log('👤 No famous players available, creating mock opponent');
    const opponentAccount = await this.authenticateWithRiot();
    const opponent = await this.createPlayer(opponentAccount);
    opponent.summonerName = `Enemy${Math.floor(Math.random() * 999)}#LOL`;
    
    return opponent;
  }

  private async tryGetFamousOpponent(playerRegion?: string): Promise<Player | null> {
    try {
      // Get famous players, preferring same region
      let candidates = playerRegion ? getFamousPlayersByRegion(playerRegion) : [];
      
      // If no same-region players, use any famous player
      if (candidates.length === 0) {
        candidates = [getRandomFamousPlayer()];
      }
      
      // Try a few candidates in case some accounts don't exist anymore
      for (let attempt = 0; attempt < 3; attempt++) {
        const famousPlayer = candidates[Math.floor(Math.random() * candidates.length)];
        console.log(`🎯 Attempting to fetch: ${famousPlayer.name} (${famousPlayer.gameName}#${famousPlayer.tagLine})`);
        
        try {
          // Try to authenticate and get real data
          const account = await this.authenticateWithRiot(famousPlayer.gameName, famousPlayer.tagLine);
          const player = await this.createPlayer(account);
          
          // Add famous player info
          player.summonerName = `${famousPlayer.name} (${famousPlayer.gameName}#${famousPlayer.tagLine})`;
          
          console.log(`✅ Successfully loaded famous player: ${famousPlayer.name}`);
          return player;
        } catch (error) {
          console.warn(`❌ Failed to load ${famousPlayer.name}:`, error);
          continue; // Try next candidate
        }
      }
      
      console.log('⚠️ All famous player attempts failed');
      return null;
    } catch (error) {
      console.error('❌ Error in tryGetFamousOpponent:', error);
      return null;
    }
  }

}

export const riotApi = RiotApiService.getInstance();
export { generateMockMatchData };