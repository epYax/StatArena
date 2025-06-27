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
    url: `${BASE_URLS.dataDragon}/item/3031.png`, // Infinity Edge (crossed swords)
    alt: 'Battle',
    fallback: '⚔️'
  },
  'victory': {
    url: `${BASE_URLS.dataDragon}/item/3504.png`, // Ardent Censer (trophy-like)
    alt: 'Victory',
    fallback: '🏆'
  },
  'defeat': {
    url: `${BASE_URLS.dataDragon}/item/3139.png`, // Mercurial Scimitar (broken sword)
    alt: 'Defeat',
    fallback: '💔'
  },
  'coin': {
    url: `${BASE_URLS.dataDragon}/item/3400.png`, // Your Cut (gold coin)
    alt: 'Coin',
    fallback: '🪙'
  },
  'damage': {
    url: `${BASE_URLS.dataDragon}/item/3124.png`, // Guinsoo's Rageblade (explosion-like)
    alt: 'Damage',
    fallback: '💥'
  },
  'shield': {
    url: `${BASE_URLS.dataDragon}/item/3065.png`, // Spirit Visage (shield)
    alt: 'Shield',
    fallback: '🛡️'
  },

  // UI Icons
  'stats': {
    url: `${BASE_URLS.dataDragon}/item/3089.png`, // Rabadon's Deathcap (stats/power)
    alt: 'Statistics',
    fallback: '📊'
  },
  'lightning': {
    url: `${BASE_URLS.dataDragon}/spell/SummonerFlash.png`, // Flash (lightning)
    alt: 'Lightning',
    fallback: '⚡'
  },
  'target': {
    url: `${BASE_URLS.dataDragon}/item/3142.png`, // Youmuu's Ghostblade (precision)
    alt: 'Target',
    fallback: '🎯'
  },
  'magic': {
    url: `${BASE_URLS.dataDragon}/item/3135.png`, // Void Staff (magic)
    alt: 'Magic',
    fallback: '✨'
  },
  'sparkle': {
    url: `${BASE_URLS.dataDragon}/item/3157.png`, // Zhonya's Hourglass (sparkle effect)
    alt: 'Sparkle',
    fallback: '✨'
  },

  // Status Icons
  'check': {
    url: `${BASE_URLS.dataDragon}/item/2055.png`, // Control Ward (checkmark-like)
    alt: 'Success',
    fallback: '✅'
  },
  'close': {
    url: `${BASE_URLS.dataDragon}/item/3211.png`, // Spectre's Cowl (X-like)
    alt: 'Close',
    fallback: '❌'
  },
  'loading': {
    url: `${BASE_URLS.dataDragon}/item/3157.png`, // Zhonya's Hourglass
    alt: 'Loading',
    fallback: '⏳'
  },
  'refresh': {
    url: `${BASE_URLS.dataDragon}/item/3053.png`, // Sterak's Gage (refresh/reload)
    alt: 'Refresh',
    fallback: '🔄'
  },

  // Special Icons
  'crown': {
    url: `${BASE_URLS.dataDragon}/item/3504.png`, // Ardent Censer (crown-like)
    alt: 'Crown',
    fallback: '👑'
  },
  'robot': {
    url: `${BASE_URLS.dataDragon}/item/3174.png`, // Athene's Unholy Grail (AI/tech)
    alt: 'AI',
    fallback: '🤖'
  },
  'slot-machine': {
    url: `${BASE_URLS.dataDragon}/item/3040.png`, // Seraph's Embrace (slot machine)
    alt: 'Slot Machine',
    fallback: '🎰'
  },
  'dice': {
    url: `${BASE_URLS.dataDragon}/item/3041.png`, // Mejai's Soulstealer (dice/chance)
    alt: 'Dice',
    fallback: '🎲'
  },
  'calculate': {
    url: `${BASE_URLS.dataDragon}/item/3003.png`, // Archangel's Staff (calculation)
    alt: 'Calculate',
    fallback: '🧮'
  },
  'crystal': {
    url: `${BASE_URLS.dataDragon}/item/3060.png`, // Banner of Command (crystal)
    alt: 'Crystal',
    fallback: '🔮'
  },
  'fire': {
    url: `${BASE_URLS.dataDragon}/spell/SummonerDot.png`, // Ignite
    alt: 'Fire',
    fallback: '🔥'
  },
  'heart': {
    url: `${BASE_URLS.dataDragon}/spell/SummonerHeal.png`, // Heal
    alt: 'Heart',
    fallback: '💖'
  },
  'search': {
    url: `${BASE_URLS.dataDragon}/item/3363.png`, // Farsight Alteration (search)
    alt: 'Search',
    fallback: '🔍'
  },
  'hourglass': {
    url: `${BASE_URLS.dataDragon}/item/3157.png`, // Zhonya's Hourglass
    alt: 'Hourglass',
    fallback: '⏳'
  },
  'flag': {
    url: `${BASE_URLS.dataDragon}/item/3056.png`, // Ohmwrecker (flag)
    alt: 'Flag',
    fallback: '🏁'
  },
  'loop': {
    url: `${BASE_URLS.dataDragon}/item/3070.png`, // Tear of the Goddess (loop/cycle)
    alt: 'Loop',
    fallback: '🔄'
  },
  'higher': {
    url: `${BASE_URLS.dataDragon}/item/3078.png`, // Trinity Force (up arrow)
    alt: 'Higher',
    fallback: '📈'
  },
  'lower': {
    url: `${BASE_URLS.dataDragon}/item/3153.png`, // Blade of the Ruined King (down arrow)
    alt: 'Lower',
    fallback: '📉'
  },
  'vs': {
    url: `${BASE_URLS.dataDragon}/item/3031.png`, // Infinity Edge (vs/battle)
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