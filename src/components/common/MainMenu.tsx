import type { Player } from '../../types';
import StatsArenaLogo from './StatsArenaLogo';

interface MainMenuProps {
  player: Player;
  onFindBattle: () => void;
  onAdminPanel: () => void;
}

export default function MainMenu({ player, onFindBattle, onAdminPanel }: MainMenuProps) {
  const winRate = player.wins + player.losses > 0 
    ? Math.round((player.wins / (player.wins + player.losses)) * 100) 
    : 0;

  console.log(`MainMenu received player with rank: ${player.rank}`);

  // Function to get rank emblem URL
  const getRankEmblem = (rank?: string) => {
    if (!rank || rank === 'UNRANKED') {
      return 'https://ddragon.leagueoflegends.com/cdn/14.22.1/img/profileicon/29.png';
    }

    const rankTier = rank.split(' ')[0].toLowerCase();
    // const rankDivision = rank.split(' ')[1];

    // Map rank divisions to Roman numerals for the file names
    // const divisionMap: { [key: string]: string } = {
    //   'IV': '4',
    //   'III': '3', 
    //   'II': '2',
    //   'I': '1'
    // };

    // const division = divisionMap[rankDivision] || '1';

    console.log(`MainMenu received player with rank: ${rankTier}`);
    
    // Special cases for apex tiers
    if (['challenger', 'grandmaster', 'master', 'emerald', 'iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond'].includes(rankTier)) {
      return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-emblem/emblem-${rankTier}.png`;
    }

    return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-emblem/emblem-${rankTier}.png`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden summoners-rift-bg">
      {/* Decorative Golden Frame */}
      <div className="max-w-7xl w-full relative z-10 p-6">
        <div className="absolute inset-0 border-4 border-league-gold rounded-xl opacity-80"
             style={{
               background: `
                 linear-gradient(45deg, transparent 15px, #C89B3C 15px, #C89B3C 17px, transparent 17px),
                 linear-gradient(-45deg, transparent 15px, #C89B3C 15px, #C89B3C 17px, transparent 17px),
                 linear-gradient(135deg, transparent 15px, #C89B3C 15px, #C89B3C 17px, transparent 17px),
                 linear-gradient(-135deg, transparent 15px, #C89B3C 15px, #C89B3C 17px, transparent 17px)
               `,
               backgroundSize: '20px 20px',
               backgroundPosition: 'top left, top right, bottom left, bottom right',
               backgroundRepeat: 'no-repeat'
             }}>
        </div>
        <div className="relative z-10 h-full flex flex-col">
          
          {/* Header Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <StatsArenaLogo size="small" />
              <div className="ml-6">
                <div className="h-2 w-32 bg-gradient-to-r from-league-bronze via-league-gold to-league-bronze rounded-full opacity-80"></div>
                <p className="text-league-gold-light text-lg mt-2 font-medium font-league-display">Elite Statistics Combat Arena</p>
              </div>
            </div>
            
            {/* Player Info */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-league-gold rounded-full blur-sm opacity-60 animate-pulse"></div>
                <img 
                  src={player.summonerIcon} 
                  alt="Summoner Icon"
                  className="w-16 h-16 rounded-full border-3 border-league-gold object-cover relative z-10"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src.includes('communitydragon.org')) {
                      img.src = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/29.png';
                    } else if (img.src.includes('14.24.1')) {
                      img.src = img.src.replace('14.24.1', '14.23.1');
                    } else if (img.src.includes('14.23.1')) {
                      img.src = img.src.replace('14.23.1', '14.22.1');
                    } else if (img.src.includes('14.22.1')) {
                      img.src = img.src.replace(/profileicon\/\d+\.png/, 'profileicon/29.png');
                    } else {
                      img.src = 'https://ddragon.leagueoflegends.com/cdn/14.22.1/img/profileicon/29.png';
                    }
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-league-gold font-league-serif tracking-wide">{player.summonerName}</h2>
                <div className="flex items-center space-x-4 text-sm text-league-gold-light font-league-sans">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                    W: <span className="text-green-400 font-bold ml-1">{player.wins}</span>
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                    L: <span className="text-red-400 font-bold ml-1">{player.losses}</span>
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-league-gold rounded-full mr-1"></span>
                    WR: <span className="text-league-gold font-bold ml-1">{winRate}%</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Row */}
          <div className="flex-1 grid grid-cols-5 gap-6">
            
            {/* Find Battle - Takes 3 columns */}
            <div className="col-span-3">
              <button
                onClick={onFindBattle}
                className="w-full h-32 league-primary-button-simple font-bold text-2xl transition-all duration-300 
                           font-league-serif"
              >
                <div className="flex items-center justify-center relative z-10">
                  <div className="text-center">
                    <div className="text-2xl font-black tracking-wider">FIND MATCH</div>
                    <div className="text-sm font-normal opacity-90 mt-1 font-league-sans">Begin Your Journey</div>
                  </div>
                </div>
              </button>
            </div>
            
            {/* Stats Column 1 */}
            <div className="space-y-4">
              {/* StatsArena Rank */}
              <div className="league-card rounded-lg p-4 border border-league-bronze hover:border-league-gold transition-all duration-300">
                <div className="text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-league-gold to-league-ancient rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-league-dark" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L3.09 8.26L4 21L12 17L20 21L20.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-xs text-league-gold-light font-medium font-league-sans">STATSARENA</div>
                  <div className="text-lg font-bold text-league-gold font-league-serif">
                    {winRate >= 80 ? 'LEGENDARY' :
                     winRate >= 60 ? 'ELITE' :
                     winRate >= 40 ? 'SKILLED' :
                     winRate >= 20 ? 'NOVICE' : 'UNRANKED'}
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="league-card rounded-lg p-4 border border-league-bronze hover:border-league-gold transition-all duration-300">
                <div className="text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-league-magic to-league-rune rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-xs text-league-gold-light font-medium font-league-sans">BADGES</div>
                  <div className="text-lg font-bold text-league-gold font-league-serif">{player.badges.length}</div>
                </div>
              </div>
            </div>

            {/* Stats Column 2 */}
            <div className="space-y-4">
              {/* League SoloQ Rank */}
              <div className="league-card rounded-lg p-4 border border-league-bronze hover:border-league-gold transition-all duration-300">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 relative overflow-hidden">
                    <img 
                      src={getRankEmblem(player.rank)}
                      alt={`${player.rank || 'UNRANKED'} Rank`}
                      className="w-full h-full object-contain"
                      style={{ transform: 'scale(3)' }}
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (!img.src.includes('emblem-unranked')) {
                          img.src = 'https://ddragon.leagueoflegends.com/cdn/14.22.1/img/profileicon/29.png';
                        }
                      }}
                    />
                  </div>
                  <div className="text-xs text-league-gold-light font-medium font-league-sans">SOLOQ</div>
                  <div className="text-sm font-bold text-league-gold font-league-serif">
                    {(() => {
                      const rankToShow = player.rank || 'UNRANKED';
                      return rankToShow;
                    })()}
                  </div>
                </div>
              </div>

              {/* Battle Tips */}
              <div className="league-card rounded-lg p-4 border border-league-bronze">
                <h3 className="text-sm font-semibold text-league-gold mb-2 font-league-serif flex items-center">
                  <div className="w-4 h-4 bg-league-mana rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  TIPS
                </h3>
                <div className="text-xs text-league-gold-light space-y-1 font-league-sans">
                  <p>• Spells extract power from battles</p>
                  <p>• Mastery beats mediocrity</p>
                  <p>• Damage: 10-25% based on skill</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions Row */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <button className="h-16 league-button font-semibold text-league-gold-light text-base font-league-sans
                             transition-all duration-300 hover:text-league-gold">
              <div className="flex items-center justify-center relative z-10">
                <div className="w-6 h-6 bg-league-accent rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                </div>
                <span>LEADERBOARDS</span>
              </div>
            </button>
            
            <button 
              onClick={onAdminPanel}
              className="h-16 league-button font-semibold text-league-gold-light text-base font-league-sans
                             transition-all duration-300 hover:text-league-gold">
              <div className="flex items-center justify-center relative z-10">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>ADMIN DEBUG</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}