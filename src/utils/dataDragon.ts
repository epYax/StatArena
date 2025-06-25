/**
 * League of Legends Data Dragon CDN Integration
 * Official Riot Games asset delivery network for League assets
 */

// Latest patch version - this should be updated periodically
const CURRENT_PATCH = '14.24.1';
const DATA_DRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn';
const COMMUNITY_DRAGON_BASE = 'https://raw.communitydragon.org/latest';

export interface ChampionData {
  id: string;
  name: string;
  title: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface RankData {
  tier: string;
  division: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

/**
 * Get champion splash art URL
 */
export const getChampionSplash = (championKey: string, skinNum: number = 0): string => {
  return `${DATA_DRAGON_BASE}/img/champion/splash/${championKey}_${skinNum}.jpg`;
};

/**
 * Get champion square icon URL
 */
export const getChampionIcon = (championKey: string): string => {
  return `${DATA_DRAGON_BASE}/${CURRENT_PATCH}/img/champion/${championKey}.png`;
};

/**
 * Get summoner icon URL with fallback chain
 */
export const getSummonerIcon = (iconId: number): string => {
  return `${DATA_DRAGON_BASE}/${CURRENT_PATCH}/img/profileicon/${iconId}.png`;
};

/**
 * Get item icon URL
 */
export const getItemIcon = (itemId: number): string => {
  return `${DATA_DRAGON_BASE}/${CURRENT_PATCH}/img/item/${itemId}.png`;
};

/**
 * Get spell icon URL
 */
export const getSpellIcon = (spellKey: string): string => {
  return `${DATA_DRAGON_BASE}/${CURRENT_PATCH}/img/spell/${spellKey}.png`;
};

/**
 * Get ranked emblem URL
 */
export const getRankedEmblem = (tier: string, _division?: string): string => {
  const tierLower = tier.toLowerCase();
  if (['master', 'grandmaster', 'challenger'].includes(tierLower)) {
    return `${COMMUNITY_DRAGON_BASE}/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblems/${tierLower}.png`;
  }
  return `${COMMUNITY_DRAGON_BASE}/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblems/${tierLower}.png`;
};

/**
 * Get hextech frame background
 */
export const getHextechFrame = (type: 'blue' | 'gold' | 'teal' = 'blue'): string => {
  const frames = {
    blue: `${COMMUNITY_DRAGON_BASE}/plugins/rcp-fe-lol-static-assets/global/default/images/hextech-blue-frame.png`,
    gold: `${COMMUNITY_DRAGON_BASE}/plugins/rcp-fe-lol-static-assets/global/default/images/hextech-gold-frame.png`,
    teal: `${COMMUNITY_DRAGON_BASE}/plugins/rcp-fe-lol-static-assets/global/default/images/hextech-teal-frame.png`
  };
  return frames[type];
};

/**
 * Get League background images
 */
export const getLeagueBackground = (type: 'summoners-rift' | 'hextech' | 'blue-essence' = 'summoners-rift'): string => {
  const backgrounds = {
    'summoners-rift': `${COMMUNITY_DRAGON_BASE}/plugins/rcp-fe-lol-static-assets/global/default/images/summoners-rift-blue-side.jpg`,
    'hextech': `${COMMUNITY_DRAGON_BASE}/plugins/rcp-fe-lol-static-assets/global/default/images/hextech-pattern.jpg`,
    'blue-essence': `${COMMUNITY_DRAGON_BASE}/plugins/rcp-fe-lol-static-assets/global/default/images/blue-essence-bg.jpg`
  };
  return backgrounds[type];
};

/**
 * Preload critical assets for better performance
 */
export const preloadCriticalAssets = () => {
  const criticalAssets = [
    getSummonerIcon(29), // Default icon
    getRankedEmblem('unranked'),
    getLeagueBackground('hextech')
  ];

  criticalAssets.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'image';
    document.head.appendChild(link);
  });
};

/**
 * Create fallback chain for summoner icons
 */
export const createIconFallbackChain = (primaryIconId: number): string[] => {
  return [
    getSummonerIcon(primaryIconId),
    getSummonerIcon(29), // Default Riot icon
    getSummonerIcon(1),  // Original default
    // Base64 fallback could be added here for offline use
  ];
};

/**
 * Get rank tier color mapping for UI
 */
export const getRankColors = (tier: string) => {
  const colors: Record<string, { primary: string; secondary: string; glow: string }> = {
    'IRON': {
      primary: '#71623C',
      secondary: '#463E2A',
      glow: 'rgba(113, 98, 60, 0.5)'
    },
    'BRONZE': {
      primary: '#A0673B',
      secondary: '#65411F',
      glow: 'rgba(160, 103, 59, 0.5)'
    },
    'SILVER': {
      primary: '#95A1A1',
      secondary: '#5E6B6B',
      glow: 'rgba(149, 161, 161, 0.5)'
    },
    'GOLD': {
      primary: '#F1C40F',
      secondary: '#B7950B',
      glow: 'rgba(241, 196, 15, 0.5)'
    },
    'PLATINUM': {
      primary: '#2ECC71',
      secondary: '#239B56',
      glow: 'rgba(46, 204, 113, 0.5)'
    },
    'DIAMOND': {
      primary: '#3498DB',
      secondary: '#2874A6',
      glow: 'rgba(52, 152, 219, 0.5)'
    },
    'MASTER': {
      primary: '#9B59B6',
      secondary: '#7D3C98',
      glow: 'rgba(155, 89, 182, 0.5)'
    },
    'GRANDMASTER': {
      primary: '#E74C3C',
      secondary: '#CB4335',
      glow: 'rgba(231, 76, 60, 0.5)'
    },
    'CHALLENGER': {
      primary: '#F39C12',
      secondary: '#E67E22',
      glow: 'rgba(243, 156, 18, 0.5)'
    }
  };

  return colors[tier.toUpperCase()] || colors['IRON'];
};

/**
 * Utility to check if Data Dragon asset exists
 */
export const checkAssetExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get the most recent patch version from Data Dragon
 */
export const getLatestPatch = async (): Promise<string> => {
  try {
    const response = await fetch(`${DATA_DRAGON_BASE}/api/versions.json`);
    const versions = await response.json();
    return versions[0] || CURRENT_PATCH;
  } catch {
    return CURRENT_PATCH;
  }
};

/**
 * Initialize Data Dragon utilities
 */
export const initializeDataDragon = async () => {
  try {
    // Preload critical assets
    preloadCriticalAssets();
    
    // Could fetch latest patch version here for dynamic updates
    // const latestPatch = await getLatestPatch();
    
    console.log('Data Dragon utilities initialized');
  } catch (error) {
    console.warn('Failed to initialize Data Dragon utilities:', error);
  }
};