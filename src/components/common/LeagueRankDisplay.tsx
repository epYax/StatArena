import { useState } from 'react';
import type { Player } from '../../types';

interface LeagueRankDisplayProps {
  player: Player;
}

interface RankInfo {
  tier: string;
  division: string;
  lp: number;
  wins: number;
  losses: number;
  winRate: number;
}

// Mock League rank data - this would come from Riot API in real implementation
const getMockLeagueRank = (playerRank?: string): RankInfo => ({
  tier: playerRank || 'Diamond',
  division: 'III',
  lp: 1247,
  wins: 87,
  losses: 61,
  winRate: 59
});

const mockStatArenaRank = {
  rank: 147,
  rating: 2834,
  percentile: 85.2
};

export default function LeagueRankDisplay({ player }: LeagueRankDisplayProps) {
  const [activeTab, setActiveTab] = useState<'league' | 'arena'>('league');
  const mockLeagueRank = getMockLeagueRank(player.rank);

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      'Iron': '#9CA3AF',
      'Bronze': '#FB923C',
      'Silver': '#D1D5DB',
      'Gold': '#FBBF24',
      'Platinum': '#22D3EE',
      'Emerald': '#34D399',
      'Diamond': '#60A5FA',
      'Master': '#A78BFA',
      'Grandmaster': '#F87171',
      'Challenger': '#FDE047'
    };
    return colors[tier] || '#C89B3C';
  };

  const getTierIcon = (tier: string) => {
    const tierName = tier.toLowerCase();
    const imageUrl = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-emblem/emblem-${tierName}.png`;
    
    return (
      <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
        <img 
          src={imageUrl}
          alt={`${tier} rank emblem`}
          className="w-16 h-16 object-contain"
          style={{ transform: 'scale(3)' }}
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling!.style.display = 'block';
          }}
        />
        <div 
          className="w-16 h-16 bg-gradient-to-br from-league-gold to-league-bronze rounded-full flex items-center justify-center border-2 border-league-gold"
          style={{ display: 'none' }}
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="relative p-8">
      {/* Decorative Golden Frame */}
      <div className="absolute inset-0 border-4 border-league-gold rounded-xl opacity-80"
           style={{
             background: `
               linear-gradient(45deg, transparent 15px, #C89B3C 15px, #C89B3C 17px, transparent 15px),
               linear-gradient(-45deg, transparent 15px, #C89B3C 15px, #C89B3C 17px, transparent 15px),
               linear-gradient(135deg, transparent 15px, #C89B3C 15px, #C89B3C 17px, transparent 15px),
               linear-gradient(-135deg, transparent 15px, #C89B3C 15px, #C89B3C 17px, transparent 15px)
             `,
             backgroundSize: '20px 20px',
             backgroundPosition: 'top left, top right, bottom left, bottom right',
             backgroundRepeat: 'no-repeat'
           }}>
      </div>
      <div className="league-card rounded-xl p-8 relative z-10">
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('league')}
          className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 font-league-serif relative overflow-hidden ${
            activeTab === 'league'
              ? 'bg-league-gold text-black border-2 border-league-gold shadow-lg'
              : 'bg-league-blue text-league-gold-light border-2 border-league-bronze hover:border-league-accent'
          }`}
        >
          <div className="flex items-center justify-center relative z-10">
            <div className="w-6 h-6 bg-current rounded-full flex items-center justify-center mr-3 opacity-80">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            LEAGUE RANK
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('arena')}
          className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 font-league-serif relative overflow-hidden ${
            activeTab === 'arena'
              ? 'bg-league-gold text-black border-2 border-league-gold shadow-lg'
              : 'bg-league-blue text-league-gold-light border-2 border-league-bronze hover:border-league-accent'
          }`}
        >
          <div className="flex items-center justify-center relative z-10">
            <div className="w-6 h-6 bg-current rounded-full flex items-center justify-center mr-3 opacity-80">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            STAT ARENA
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'league' ? (
        <div className="space-y-8">
          {/* League Rank Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {getTierIcon(mockLeagueRank.tier)}
              <div>
                <h3 
                  className="text-3xl font-bold font-league-serif tracking-wide"
                  style={{ color: getTierColor(mockLeagueRank.tier) }}
                >
                  {mockLeagueRank.tier} {mockLeagueRank.division}
                </h3>
                <p className="text-league-gold-light text-lg mt-1">League Points: <span className="text-league-gold font-bold">{mockLeagueRank.lp} LP</span></p>
              </div>
            </div>
            
            {/* Progress to Next Tier */}
            <div className="text-right">
              <div className="text-sm text-league-gold-light mb-2 font-medium">PROMOTION PROGRESS</div>
              <div className="w-48 h-3 bg-league-dark rounded-full overflow-hidden border border-league-bronze">
                <div 
                  className="h-full bg-gradient-to-r from-league-accent to-league-gold transition-all duration-500"
                  style={{ width: `${(mockLeagueRank.lp % 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-league-gold mt-1">{100 - (mockLeagueRank.lp % 100)} LP to promotion</div>
            </div>
          </div>

          {/* League Statistics */}
          <div className="grid grid-cols-3 gap-6">
            <div className="league-card-simple rounded-lg p-6 border border-league-bronze hover:border-green-400 transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-league-gold-light font-medium mb-1">VICTORIES</div>
                <div className="text-3xl font-bold text-green-400">{mockLeagueRank.wins}</div>
              </div>
            </div>

            <div className="league-card-simple rounded-lg p-6 border border-league-bronze hover:border-red-400 transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-league-gold-light font-medium mb-1">DEFEATS</div>
                <div className="text-3xl font-bold text-red-400">{mockLeagueRank.losses}</div>
              </div>
            </div>

            <div className="league-card-simple rounded-lg p-6 border border-league-bronze hover:border-league-gold transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-league-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                </div>
                <div className="text-sm text-league-gold-light font-medium mb-1">WIN RATE</div>
                <div className="text-3xl font-bold text-league-gold">{mockLeagueRank.winRate}%</div>
              </div>
            </div>
          </div>

          {/* Recent Performance */}
          <div>
            <h4 className="text-xl font-semibold text-league-gold mb-4 font-league-serif">RECENT PERFORMANCE</h4>
            <div className="flex space-x-2">
              {['W', 'W', 'L', 'W', 'W', 'L', 'W', 'W', 'W', 'L'].map((result, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    result === 'W' ? 'bg-green-400 text-black' : 'bg-red-400 text-black'
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stat Arena Rank Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-league-accent to-league-mana rounded-full flex items-center justify-center border-2 border-league-gold">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-league-accent font-league-serif tracking-wide">
                  RANK #{mockStatArenaRank.rank}
                </h3>
                <p className="text-league-gold-light text-lg mt-1">
                  Rating: <span className="text-league-gold font-bold">{mockStatArenaRank.rating}</span>
                </p>
              </div>
            </div>
            
            {/* Percentile */}
            <div className="text-right">
              <div className="text-sm text-league-gold-light mb-2 font-medium">PERCENTILE</div>
              <div className="text-4xl font-bold text-league-gold font-league-serif">{mockStatArenaRank.percentile}%</div>
              <div className="text-sm text-league-gold-light mt-1">Top performers</div>
            </div>
          </div>

          {/* Stat Arena Statistics */}
          <div className="grid grid-cols-3 gap-6">
            <div className="league-card-simple rounded-lg p-6 border border-league-bronze hover:border-green-400 transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-league-gold-light font-medium mb-1">COMBAT WINS</div>
                <div className="text-3xl font-bold text-green-400">{player.wins}</div>
              </div>
            </div>

            <div className="league-card-simple rounded-lg p-6 border border-league-bronze hover:border-red-400 transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-league-gold-light font-medium mb-1">COMBAT LOSSES</div>
                <div className="text-3xl font-bold text-red-400">{player.losses}</div>
              </div>
            </div>

            <div className="league-card-simple rounded-lg p-6 border border-league-bronze hover:border-league-gold transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-league-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-league-gold-light font-medium mb-1">ACHIEVEMENTS</div>
                <div className="text-3xl font-bold text-league-gold">{player.badges.length}</div>
              </div>
            </div>
          </div>

          {/* Battle History */}
          <div>
            <h4 className="text-xl font-semibold text-league-gold mb-4 font-league-serif">RECENT BATTLES</h4>
            <div className="space-y-3">
              {['Victory vs. TheShy (KR)', 'Victory vs. Faker (KR)', 'Defeat vs. Canyon (KR)', 'Victory vs. Caps (EUW)', 'Victory vs. Doublelift (NA)'].map((battle, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-league-dark rounded-lg border border-league-bronze">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${battle.startsWith('Victory') ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-league-gold-light">{battle}</span>
                  </div>
                  <div className="text-sm text-league-gold">2 hours ago</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}