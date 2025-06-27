import { useState, useEffect } from 'react';
import type { Player, MatchData, ChampionMastery } from '../../types';
import { riotApi } from '../../services/riotApi';
import LoLIcon from '../common/LoLIcon';

interface AdminDebugPanelProps {
  player: Player;
  onReturnToMenu: () => void;
}

interface DebugData {
  account: any;
  masteries: ChampionMastery[];
  matches: MatchData[];
  summonerData: any;
  rankData: any;
  rawApiResponses: {
    account?: any;
    masteries?: any;
    matches?: any;
    summoner?: any;
    rank?: any;
  };
}

export default function AdminDebugPanel({ player, onReturnToMenu }: AdminDebugPanelProps) {
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'masteries' | 'matches' | 'raw'>('overview');

  const loadDebugData = async () => {
    setLoading(true);
    try {
      console.log('Loading complete debug data...');
      
      // Get fresh data from API
      const matches = await riotApi.getEnhancedMatchHistory(player.puuid, player.summonerName.split('#')[1]);
      const masteries = await riotApi.getChampionMasteries(player.puuid, player.summonerName.split('#')[1]);
      const summonerData = await riotApi.getSummonerData(player.puuid, player.summonerName.split('#')[1]);
      
      setDebugData({
        account: {
          puuid: player.puuid,
          gameName: player.summonerName.split('#')[0],
          tagLine: player.summonerName.split('#')[1]
        },
        masteries,
        matches,
        summonerData,
        rankData: null, // Will be populated if available
        rawApiResponses: {}
      });
    } catch (error) {
      console.error('Failed to load debug data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDebugData();
  }, [player.puuid]);

  const renderMasteryLevel = (level: number) => {
    const colors = {
      7: 'bg-purple-500 text-white',
      6: 'bg-red-500 text-white', 
      5: 'bg-orange-500 text-white',
      4: 'bg-yellow-500 text-black',
      3: 'bg-blue-500 text-white',
      2: 'bg-green-500 text-white',
      1: 'bg-gray-500 text-white'
    };
    
    return (
      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${colors[level as keyof typeof colors] || 'bg-gray-300 text-black'}`}>
        {level}
      </span>
    );
  };

  const formatNumber = (num: number) => num.toLocaleString();
  const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center">
          <div className="mb-4 animate-spin flex justify-center">
            <LoLIcon type="refresh" size="2xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Debug Data...</h2>
          <p className="text-gray-400">Fetching all API responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="bg-black/50 border-b border-lol-gold/30 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-lol-gold font-['Orbitron'] flex items-center gap-2">
              <LoLIcon type="tool" size="md" />
              Admin Debug Panel
            </h1>
            <p className="text-gray-400">Complete API data inspection for {player.summonerName}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={loadDebugData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
            >
              <LoLIcon type="refresh" size="sm" className="mr-2" />
              Refresh Data
            </button>
            <button
              onClick={onReturnToMenu}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-semibold transition-colors"
            >
              ← Back to Menu
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: 'stats' },
            { id: 'masteries', label: 'Masteries', icon: 'victory' },
            { id: 'matches', label: 'Matches', icon: 'battle' },
            { id: 'raw', label: 'Raw Data', icon: 'search' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-lol-gold text-black'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <LoLIcon type={tab.icon as any} size="sm" />
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && debugData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Account Info */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-bold text-lol-gold mb-4">Account Info</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-400">PUUID:</span> <span className="font-mono text-xs">{debugData.account.puuid}</span></div>
                  <div><span className="text-gray-400">Game Name:</span> {debugData.account.gameName}</div>
                  <div><span className="text-gray-400">Tag Line:</span> {debugData.account.tagLine}</div>
                </div>
              </div>

              {/* Summoner Data */}
              {debugData.summonerData && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-lol-gold mb-4">Summoner Data</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">Level:</span> {debugData.summonerData.level}</div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-bold text-lol-gold mb-4">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-400">Total Masteries:</span> {debugData.masteries.length}</div>
                  <div><span className="text-gray-400">Level 7 Champions:</span> {debugData.masteries.filter(m => m.championLevel >= 7).length}</div>
                  <div><span className="text-gray-400">Total Matches:</span> {debugData.matches.length}</div>
                  <div><span className="text-gray-400">Recent Wins:</span> {debugData.matches.slice(0, 10).filter(m => m.win).length}/10</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'masteries' && debugData && (
            <div className="bg-gray-800 rounded-lg">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-bold text-lol-gold">Champion Masteries ({debugData.masteries.length} total)</h3>
                <p className="text-gray-400 text-sm">All champion mastery data from Riot API</p>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-700 sticky top-0">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold">#</th>
                      <th className="text-left p-3 text-sm font-semibold">Champion</th>
                      <th className="text-left p-3 text-sm font-semibold">Level</th>
                      <th className="text-left p-3 text-sm font-semibold">Points</th>
                      <th className="text-left p-3 text-sm font-semibold">Last Played</th>
                      <th className="text-left p-3 text-sm font-semibold">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debugData.masteries.map((mastery, index) => (
                      <tr key={mastery.championId} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="p-3 text-sm text-gray-400">{index + 1}</td>
                        <td className="p-3 text-sm font-semibold">{mastery.championName}</td>
                        <td className="p-3">{renderMasteryLevel(mastery.championLevel)}</td>
                        <td className="p-3 text-sm font-mono">{formatNumber(mastery.masteryPoints)}</td>
                        <td className="p-3 text-sm text-gray-400">{formatDate(mastery.lastPlayTime)}</td>
                        <td className="p-3 text-sm text-gray-500 font-mono">{mastery.championId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'matches' && debugData && (
            <div className="bg-gray-800 rounded-lg">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-bold text-lol-gold">Match History ({debugData.matches.length} matches)</h3>
                <p className="text-gray-400 text-sm">Recent match data with complete statistics</p>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                <div className="space-y-2 p-4">
                  {debugData.matches.map((match, index) => (
                    <div key={match.gameId} className="bg-gray-700 rounded p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${match.win ? 'bg-green-500' : 'bg-red-500'}`}>
                            {match.win ? 'WIN' : 'LOSS'}
                          </span>
                          <span className="font-semibold">{match.championName}</span>
                          <span className="text-gray-400 text-sm">{match.gameMode}</span>
                        </div>
                        <span className="text-gray-400 text-sm">{Math.floor(match.gameDuration / 60)}m {match.gameDuration % 60}s</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                        <div><span className="text-gray-400">KDA:</span> {match.kills}/{match.deaths}/{match.assists}</div>
                        <div><span className="text-gray-400">CS:</span> {match.cs}</div>
                        <div><span className="text-gray-400">Gold:</span> {formatNumber(match.goldEarned)}</div>
                        <div><span className="text-gray-400">Vision:</span> {match.visionScore}</div>
                        <div><span className="text-gray-400">Damage:</span> {formatNumber(match.damageDealtToChampions || 0)}</div>
                        <div><span className="text-gray-400">Wards:</span> {match.wardsPlaced}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'raw' && debugData && (
            <div className="bg-gray-800 rounded-lg">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-bold text-lol-gold">Raw API Data</h3>
                <p className="text-gray-400 text-sm">Complete API responses for debugging</p>
              </div>
              <div className="max-h-[600px] overflow-y-auto p-4">
                <div className="space-y-4">
                  <details className="bg-gray-700 rounded">
                    <summary className="p-3 cursor-pointer font-semibold flex items-center gap-2">
                      <LoLIcon type="stats" size="xs" />
                      Account Data
                    </summary>
                    <pre className="p-3 text-xs overflow-x-auto bg-black/50 font-mono">
                      {JSON.stringify(debugData.account, null, 2)}
                    </pre>
                  </details>
                  
                  <details className="bg-gray-700 rounded">
                    <summary className="p-3 cursor-pointer font-semibold">Champion Masteries ({debugData.masteries.length})</summary>
                    <pre className="p-3 text-xs overflow-x-auto bg-black/50 font-mono max-h-96 overflow-y-auto">
                      {JSON.stringify(debugData.masteries, null, 2)}
                    </pre>
                  </details>
                  
                  <details className="bg-gray-700 rounded">
                    <summary className="p-3 cursor-pointer font-semibold">Match History ({debugData.matches.length})</summary>
                    <pre className="p-3 text-xs overflow-x-auto bg-black/50 font-mono max-h-96 overflow-y-auto">
                      {JSON.stringify(debugData.matches, null, 2)}
                    </pre>
                  </details>
                  
                  {debugData.summonerData && (
                    <details className="bg-gray-700 rounded">
                      <summary className="p-3 cursor-pointer font-semibold">Summoner Data</summary>
                      <pre className="p-3 text-xs overflow-x-auto bg-black/50 font-mono">
                        {JSON.stringify(debugData.summonerData, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}