// League of Legends Data Dragon Icon Mappings
// Replaces generic emojis with authentic LoL assets

export const DATA_DRAGON_VERSION = '15.13.1';
export const BASE_URLS = {
  // Data Dragon CDN for official assets
  dataDragon: `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/img`,
  // Community Dragon for additional UI assets
  communityDragon: 'https://raw.communitydragon.org/latest/game/assets'
} as const;

// Icon type definitions
export type IconType = 
  | 'battle' | 'victory' | 'defeat' | 'coin' | 'damage' | 'shield'
  | 'stats' | 'lightning' | 'target' | 'magic' | 'sparkle'
  | 'check' | 'close' | 'loading' | 'refresh' | 'crown'
  | 'robot' | 'slot-machine' | 'dice' | 'calculate' | 'crystal'
  | 'fire' | 'heart' | 'search' | 'hourglass' | 'flag'
  | 'loop' | 'higher' | 'lower' | 'vs';

// Mapping emojis to League of Legends assets
export const ICON_MAPPINGS: Record<IconType, {
  url: string;
  alt: string;
  fallback?: string;
}> = {
  // Battle Icons
  'battle': {
    url: `${BASE_URLS.dataDragon}/item/3031.png`, // Infinity Edge (crossed swords) - actually good
    alt: 'Battle',
    fallback: '⚔️'
  },
  'victory': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/tft/icons/indicator_1st.png`, // 1st place victory
    alt: 'Victory',
    fallback: '🏆'
  },
  'defeat': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/tft/icons/indicator_8th.png`, // Last place defeat
    alt: 'Defeat',
    fallback: '💔'
  },
  'coin': {
    url: `${BASE_URLS.dataDragon}/item/3400.png`, // Your Cut (gold coin) - actually good
    alt: 'Coin',
    fallback: '🪙'
  },
  'damage': {
    url: `${BASE_URLS.dataDragon}/spell/SummonerSmite.png`, // Smite - aggressive damage
    alt: 'Damage',
    fallback: '💥'
  },
  'shield': {
    url: `${BASE_URLS.dataDragon}/spell/SummonerBarrier.png`, // Barrier - perfect shield
    alt: 'Shield',
    fallback: '🛡️'
  },

  // UI Icons
  'stats': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/summoner-icon/tft-regalia-banner-accent.png`, // Stats display
    alt: 'Statistics',
    fallback: '📊'
  },
  'lightning': {
    url: `${BASE_URLS.dataDragon}/spell/SummonerFlash.png`, // Flash (lightning) - PERFECT match!
    alt: 'Lightning',
    fallback: '⚡'
  },
  'target': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/tft/icons/trait-origin.png`, // Target/precision
    alt: 'Target',
    fallback: '🎯'
  },
  'magic': {
    url: `${BASE_URLS.dataDragon}/item/3135.png`, // Void Staff (magic) - keep this one, it's good
    alt: 'Magic',
    fallback: '✨'
  },
  'sparkle': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/tft/effects/magic-sparkle.png`, // Actual sparkles
    alt: 'Sparkle',
    fallback: '✨'
  },

  // Status Icons
  'check': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/tft/icons/checkmark-green.png`, // Actual checkmark
    alt: 'Success',
    fallback: '✅'
  },
  'close': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/tft/icons/close-red.png`, // Actual X/close
    alt: 'Close',
    fallback: '❌'
  },
  'loading': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/shared/spinner-loading.png`, // Actual loading spinner
    alt: 'Loading',
    fallback: '⏳'
  },
  'refresh': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/shared/arrow-refresh.png`, // Refresh arrows
    alt: 'Refresh',
    fallback: '🔄'
  },

  // Special Icons
  'crown': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/tft/icons/achievement-crown.png`, // Actual crown/achievement
    alt: 'Crown',
    fallback: '👑'
  },
  'robot': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/tft/icons/tech-bot.png`, // Robot/AI icon
    alt: 'AI',
    fallback: '🤖'
  },
  'slot-machine': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/tft/icons/random-dice.png`, // Random/slot machine
    alt: 'Slot Machine',
    fallback: '🎰'
  },
  'dice': {
    url: `${BASE_URLS.dataDragon}/item/3041.png`, // Mejai's Soulstealer (dice/chance) - keep this one
    alt: 'Dice',
    fallback: '🎲'
  },
  'calculate': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/tft/icons/calculator-stats.png`, // Calculator/stats
    alt: 'Calculate',
    fallback: '🧮'
  },
  'crystal': {
    url: `${BASE_URLS.dataDragon}/item/3060.png`, // Banner of Command (crystal) - keep this one
    alt: 'Crystal',
    fallback: '🔮'
  },
  'fire': {
    url: `${BASE_URLS.dataDragon}/spell/SummonerDot.png`, // Ignite - perfect for fire!
    alt: 'Fire',
    fallback: '🔥'
  },
  'heart': {
    url: `${BASE_URLS.dataDragon}/spell/SummonerHeal.png`, // Heal - perfect for heart!
    alt: 'Heart',
    fallback: '💖'
  },
  'search': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/tft/icons/magnifying-glass.png`, // Actual search icon
    alt: 'Search',
    fallback: '🔍'
  },
  'hourglass': {
    url: `${BASE_URLS.dataDragon}/item/3157.png`, // Zhonya's Hourglass - perfect match!
    alt: 'Hourglass',
    fallback: '⏳'
  },
  'flag': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/tft/icons/finish-flag.png`, // Actual flag
    alt: 'Flag',
    fallback: '🏁'
  },
  'loop': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/shared/arrow-refresh.png`, // Same as refresh
    alt: 'Loop',
    fallback: '🔄'
  },
  'higher': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/tft/icons/arrow-up-green.png`, // Up arrow
    alt: 'Higher',
    fallback: '📈'
  },
  'lower': {
    url: `${BASE_URLS.communityDragon}/ux/components/lobby/regalia/tft/icons/arrow-down-red.png`, // Down arrow
    alt: 'Lower',
    fallback: '📉'
  },
  'vs': {
    url: `${BASE_URLS.dataDragon}/item/3031.png`, // Infinity Edge (vs/battle) - keep this one
    alt: 'Versus',
    fallback: '⚔️'
  }
};

// Utility function to get icon URL
export const getIconUrl = (type: IconType): string => {
  return ICON_MAPPINGS[type]?.url || '';
};

// Utility function to get fallback emoji
export const getIconFallback = (type: IconType): string => {
  return ICON_MAPPINGS[type]?.fallback || '❓';
};

// Utility function to get alt text
export const getIconAlt = (type: IconType): string => {
  return ICON_MAPPINGS[type]?.alt || type;
};