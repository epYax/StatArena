export interface FamousPlayer {
  name: string;
  gameName: string;
  tagLine: string;
  region: string;
  role: string;
  team?: string;
  description: string;
  isStreamer?: boolean;
  isProPlayer?: boolean;
}

export const FAMOUS_PLAYERS: FamousPlayer[] = [
  // T1 (Korean Legends)
  {
    name: "Faker",
    gameName: "Hide on bush",
    tagLine: "KR1", 
    region: "kr",
    role: "Mid",
    team: "T1",
    description: "GOAT of League - 4x World Champion",
    isProPlayer: true
  },
  {
    name: "Gumayusi", 
    gameName: "Gumayusi",
    tagLine: "KR1",
    region: "kr", 
    role: "ADC",
    team: "T1",
    description: "T1 ADC - World Champion 2023",
    isProPlayer: true
  },
  {
    name: "Zeus",
    gameName: "Zeus",
    tagLine: "KR1",
    region: "kr",
    role: "Top", 
    team: "T1",
    description: "T1 Top Laner - Rising Star",
    isProPlayer: true
  },

  // EU Streamers & Pros
  {
    name: "Caps",
    gameName: "Caps",
    tagLine: "EUW",
    region: "euw1",
    role: "Mid",
    team: "G2 Esports", 
    description: "G2 Mid - EU GOAT",
    isProPlayer: true
  },
  {
    name: "Rekkles",
    gameName: "Rekkles",
    tagLine: "EUW",
    region: "euw1",
    role: "ADC",
    team: "KCorp",
    description: "Legendary EU ADC",
    isProPlayer: true
  },

  // NA Streamers & Content Creators
  {
    name: "Tyler1",
    gameName: "TYLER1",
    tagLine: "NA1",
    region: "na1", 
    role: "ADC",
    description: "The Alpha - Most Famous LoL Streamer",
    isStreamer: true
  },
  {
    name: "Doublelift",
    gameName: "Doublelift",
    tagLine: "NA1", 
    region: "na1",
    role: "ADC",
    description: "Retired Legend - 8x LCS Champion",
    isStreamer: true,
    isProPlayer: true
  },
  {
    name: "Sneaky",
    gameName: "Sneaky",
    tagLine: "NA1",
    region: "na1",
    role: "ADC", 
    description: "Former C9 ADC - Popular Streamer",
    isStreamer: true,
    isProPlayer: true
  },
  {
    name: "IWillDominate",
    gameName: "IWDominate",
    tagLine: "NA1",
    region: "na1",
    role: "Jungle",
    description: "Former Pro - LoL Content Creator",
    isStreamer: true,
    isProPlayer: true
  },

  // More EU Players
  {
    name: "Jankos",
    gameName: "Jankos",
    tagLine: "EUW",
    region: "euw1",
    role: "Jungle",
    description: "First Blood King - G2 Legend",
    isStreamer: true,
    isProPlayer: true
  },

  // KR Streamers & Pros
  {
    name: "TheShy",
    gameName: "TheShy",
    tagLine: "KR1",
    region: "kr",
    role: "Top",
    description: "World Champion 2018 - Mechanical God",
    isProPlayer: true
  },
  {
    name: "Canyon",
    gameName: "Canyon",
    tagLine: "KR1", 
    region: "kr",
    role: "Jungle",
    team: "DAMWON KIA",
    description: "World Champion Jungler - 2020",
    isProPlayer: true
  },

  // Backup/Alternative names (some pros have multiple accounts)
  {
    name: "Faker Alt",
    gameName: "SKT T1 Faker",
    tagLine: "KR1",
    region: "kr",
    role: "Mid", 
    team: "T1",
    description: "Faker's Secondary Account",
    isProPlayer: true
  },
  {
    name: "Tyler1 Alt",
    gameName: "loltyler1",
    tagLine: "NA1", 
    region: "na1",
    role: "ADC",
    description: "Tyler1's Main Account",
    isStreamer: true
  },

  // More Content Creators
  {
    name: "Qtpie",
    gameName: "imaqtpie",
    tagLine: "NA1",
    region: "na1", 
    role: "ADC",
    description: "Former Dignitas ADC - Big Dick Club",
    isStreamer: true,
    isProPlayer: true
  },
  {
    name: "Nightblue3",
    gameName: "Nightblue3",
    tagLine: "NA1",
    region: "na1",
    role: "Jungle", 
    description: "Educational Jungle Streamer",
    isStreamer: true
  },

  // International Players
  {
    name: "Uzi",
    gameName: "Uzi",
    tagLine: "KR1",
    region: "kr",
    role: "ADC",
    description: "Chinese Legend - Multiple Worlds Finals",
    isProPlayer: true
  }
];

export function getRandomFamousPlayer(): FamousPlayer {
  const randomIndex = Math.floor(Math.random() * FAMOUS_PLAYERS.length);
  return FAMOUS_PLAYERS[randomIndex];
}

export function getFamousPlayersByRegion(region: string): FamousPlayer[] {
  return FAMOUS_PLAYERS.filter(player => player.region === region);
}

export function getFamousPlayersByRole(role: string): FamousPlayer[] {
  return FAMOUS_PLAYERS.filter(player => player.role.toLowerCase() === role.toLowerCase());
}