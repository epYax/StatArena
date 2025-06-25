import type { Player } from '../../types';

interface PlayerCardProps {
  player: Player;
  statValue?: number;
  isWinner?: boolean;
  showStat: boolean;
  isShaking: boolean;
}

export default function PlayerCard({ player, statValue, isWinner, showStat, isShaking }: PlayerCardProps) {
  const hpPercentage = (player.hp / player.maxHp) * 100;
  const isFamousPlayer = player.summonerName.includes('(') && 
                        (player.summonerName.includes('Tyler1') || 
                         player.summonerName.includes('Faker') || 
                         player.summonerName.includes('Caps') ||
                         player.summonerName.includes('Doublelift') ||
                         player.summonerName.includes('Rekkles') ||
                         player.summonerName.includes('Sneaky') ||
                         player.summonerName.includes('IWDominate') ||
                         player.summonerName.includes('TheShy') ||
                         player.summonerName.includes('Canyon') ||
                         player.summonerName.includes('Gumayusi') ||
                         player.summonerName.includes('Zeus') ||
                         player.summonerName.includes('Jankos') ||
                         player.summonerName.includes('imaqtpie') ||
                         player.summonerName.includes('Nightblue3') ||
                         player.summonerName.includes('Uzi'));

  const getCardClasses = () => {
    let classes = 'hextech-card rounded-xl p-8 border-2 transition-all duration-500 relative overflow-hidden ';
    
    if (isShaking) {
      classes += 'damage-shake ';
    }
    
    if (showStat && isWinner) {
      classes += 'border-green-400 bg-green-900/30 shadow-lg shadow-green-400/20 ';
    } else if (showStat && !isWinner) {
      classes += 'border-red-400 bg-red-900/30 shadow-lg shadow-red-400/20 ';
    } else if (isFamousPlayer) {
      classes += 'border-purple-400 bg-purple-900/30 shadow-lg shadow-purple-400/20 ';
    } else {
      classes += 'border-hextech-border hover:border-hextech-gold transition-all duration-300 ';
    }
    
    return classes;
  };

  const getStatDisplayClasses = () => {
    if (!showStat) return 'text-hextech-teal';
    return isWinner ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className={getCardClasses()}>
      {/* Hextech Frame Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hextech-gold to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hextech-blue to-transparent opacity-60"></div>
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-hextech-teal to-transparent opacity-40"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-hextech-teal to-transparent opacity-40"></div>
      </div>

      {/* Player Header */}
      <div className="text-center mb-6 relative z-10">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-hextech-gold rounded-full blur-sm opacity-50 animate-pulse"></div>
          <img 
            src={player.summonerIcon} 
            alt="Summoner Icon"
            className="w-20 h-20 rounded-full mx-auto mb-3 border-3 border-hextech-gold object-cover relative z-10"
            onError={(e) => {
              const img = e.currentTarget;
              // Try multiple fallbacks in sequence
              if (img.src.includes('communitydragon.org')) {
                // If Community Dragon fails, try Data Dragon
                img.src = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/29.png';
              } else if (img.src.includes('14.24.1')) {
                img.src = img.src.replace('14.24.1', '14.23.1');
              } else if (img.src.includes('14.23.1')) {
                img.src = img.src.replace('14.23.1', '14.22.1');
              } else if (img.src.includes('14.22.1')) {
                img.src = img.src.replace(/profileicon\/\d+\.png/, 'profileicon/29.png');
              } else {
                // Final fallback to a reliable icon
                img.src = 'https://ddragon.leagueoflegends.com/cdn/14.22.1/img/profileicon/29.png';
              }
            }}
          />
        </div>
        <h3 className="text-2xl font-bold text-hextech-gold font-hextech tracking-wide flex items-center justify-center gap-2">
          {isFamousPlayer && (
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          )}
          {player.summonerName}
          {isFamousPlayer && (
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          )}
        </h3>
        {isFamousPlayer && (
          <div className="text-sm text-purple-300 mt-1 font-medium">LEGENDARY CHAMPION</div>
        )}
      </div>

      {/* HP Bar */}
      <div className="mb-8 relative z-10">
        <div className="flex justify-between text-sm text-hextech-teal mb-2 font-medium">
          <span>VITALITY STATUS</span>
          <span className="text-hextech-gold font-bold">{player.hp}/{player.maxHp}</span>
        </div>
        <div className="w-full h-6 bg-hextech-dark-blue rounded-lg overflow-hidden relative border border-hextech-border">
          <div className="absolute inset-0 bg-gradient-to-r from-hextech-blue/20 to-hextech-gold/20"></div>
          <div 
            className={`h-full transition-all duration-1000 transform translateZ(0) relative z-10 shadow-lg ${
              hpPercentage > 60 ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-400' :
              hpPercentage > 30 ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400' : 
              'bg-gradient-to-r from-red-400 via-red-500 to-red-400'
            }`}
            style={{ width: `${hpPercentage}%` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
      </div>

      {/* Stat Display */}
      <div className="text-center mb-8 relative z-10">
        <div className="text-sm text-hextech-teal mb-3 font-medium">COMBAT METRIC</div>
        <div className="relative">
          <div className="absolute inset-0 bg-hextech-dark-blue rounded-lg border border-hextech-border"></div>
          <div className={`relative z-10 text-5xl font-bold font-hextech py-6 ${getStatDisplayClasses()}`}>
            {showStat ? (
              <div className="card-flip">
                {typeof statValue === 'number' ? statValue.toLocaleString() : '???'}
              </div>
            ) : (
              <div className="text-hextech-teal opacity-60">???</div>
            )}
          </div>
        </div>
        
        {showStat && isWinner !== undefined && (
          <div className="mt-4">
            {isWinner ? (
              <div className="flex items-center justify-center text-green-400 font-bold text-lg animate-pulse">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-2">
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                VICTORIOUS
              </div>
            ) : (
              <div className="flex items-center justify-center text-red-400 font-bold text-lg">
                <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center mr-2">
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                DEFEATED
              </div>
            )}
          </div>
        )}
      </div>

      {/* Player Stats */}
      <div className="pt-6 border-t border-hextech-border relative z-10">
        <div className="grid grid-cols-2 gap-6 text-base">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-4 h-4 bg-green-400 rounded-full mr-2"></div>
              <span className="text-hextech-teal font-medium">VICTORIES</span>
            </div>
            <div className="text-green-400 font-bold text-xl">{player.wins}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-4 h-4 bg-red-400 rounded-full mr-2"></div>
              <span className="text-hextech-teal font-medium">DEFEATS</span>
            </div>
            <div className="text-red-400 font-bold text-xl">{player.losses}</div>
          </div>
        </div>
      </div>
    </div>
  );
}