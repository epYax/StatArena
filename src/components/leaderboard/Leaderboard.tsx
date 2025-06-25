import { useState, useEffect } from 'react';
import { db } from '../../services/supabase';
import type { Database } from '../../types/supabase';

interface LeaderboardProps {
  onClose: () => void;
}

type LeaderboardEntry = Database['public']['Views']['leaderboard']['Row'];

export default function Leaderboard({ onClose }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await db.getLeaderboard(50);
      
      if (error) {
        setError(error.message);
        console.error('Failed to load leaderboard:', error);
      } else {
        setEntries(data || []);
      }
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 font-['Orbitron']">
            🏆 Leaderboards
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-lol-gold to-lol-light-blue mx-auto"></div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-black/40 rounded-xl border border-lol-gold/30 overflow-hidden">
          <div className="bg-lol-gold/20 p-4 border-b border-lol-gold/30">
            <h2 className="text-xl font-bold text-lol-gold">Global Rankings</h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lol-gold mx-auto mb-4"></div>
                <div className="text-lg text-gray-400">Loading leaderboard...</div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <div className="text-xl text-red-400">Failed to load leaderboard</div>
                <div className="text-gray-500">{error}</div>
                <button 
                  onClick={loadLeaderboard}
                  className="mt-4 px-4 py-2 bg-lol-gold text-black rounded hover:bg-yellow-500"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.length > 0 ? entries.map((entry) => (
                  <div 
                    key={entry.id}
                    className="flex items-center justify-between bg-black/30 rounded-lg p-4 border border-gray-600"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-black' :
                        entry.rank === 2 ? 'bg-gray-400 text-black' :
                        entry.rank === 3 ? 'bg-orange-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {entry.rank}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-lol-gold/20 border border-lol-gold/50 flex items-center justify-center">
                        <span className="text-lol-gold font-bold text-lg">
                          {entry.summoner_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">{entry.summoner_name}</div>
                        <div className="text-gray-400 text-sm">
                          {entry.current_win_streak > 0 ? `🔥 ${entry.current_win_streak} win streak` : 'No active streak'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-bold">{entry.wins}W - {entry.losses}L</div>
                      <div className="text-lol-gold">{entry.win_rate}% Win Rate</div>
                      <div className="text-gray-400 text-sm">{entry.total_battles} battles</div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎮</div>
                    <div className="text-xl text-gray-400">No players ranked yet</div>
                    <div className="text-gray-500">Be the first to climb the leaderboard!</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center mt-8">
          <button
            onClick={onClose}
            className="px-8 py-4 bg-gradient-to-r from-lol-gold to-yellow-600 hover:from-yellow-500 hover:to-lol-gold 
                     rounded-lg font-bold text-lg text-black transition-all duration-300 glow-effect"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}