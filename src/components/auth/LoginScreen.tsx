import { useState, useEffect } from 'react';
import { auth } from '../../services/supabase';
import StatsArenaLogo from '../common/StatsArenaLogo';

interface LoginScreenProps {
  onLogin: (gameName?: string, tagLine?: string) => Promise<void>;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Auth mode state
  const [authMode, setAuthMode] = useState<'demo' | 'login' | 'signup'>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { user } = await auth.getUser();
      if (user) {
        // User is already logged in, proceed to game
        await onLogin();
      }
    };
    checkUser();
  }, [onLogin]);

  const handleAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (authMode === 'demo') {
        // Demo mode - no authentication required, but pass Riot ID if provided
        if (gameName.trim() && tagLine.trim()) {
          await onLogin(gameName.trim(), tagLine.trim());
        } else {
          await onLogin();
        }
      } else if (authMode === 'login') {
        // Login with existing account
        const { data, error } = await auth.signIn(email, password);
        if (error) throw error;
        if (data.user) {
          // For login, don't pass credentials (they're already authenticated)
          await onLogin();
        }
      } else if (authMode === 'signup') {
        // Create new account
        const metadata = {
          summoner_name: gameName || 'Unknown Player',
          riot_puuid: undefined // Will be filled when they connect Riot account
        };
        
        const { data, error } = await auth.signUp(email, password, metadata);
        if (error) throw error;
        
        if (data.user) {
          // Account created, now log them in (no Riot credentials needed yet)
          await onLogin();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8 relative overflow-hidden summoners-rift-bg">
      {/* Single Golden Frame around ALL elements */}
      <div className="max-w-7xl w-full relative p-8">
        <div className="absolute inset-0 border-4 border-league-gold rounded-xl opacity-80"
             style={{
               background: `
                 linear-gradient(45deg, transparent 20px, #C89B3C 20px, #C89B3C 22px, transparent 22px),
                 linear-gradient(-45deg, transparent 20px, #C89B3C 20px, #C89B3C 22px, transparent 22px),
                 linear-gradient(135deg, transparent 20px, #C89B3C 20px, #C89B3C 22px, transparent 22px),
                 linear-gradient(-135deg, transparent 20px, #C89B3C 20px, #C89B3C 22px, transparent 22px)
               `,
               backgroundSize: '25px 25px',
               backgroundPosition: 'top left, top right, bottom left, bottom right',
               backgroundRepeat: 'no-repeat'
             }}>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* Left Side - Welcome & Description */}
        <div className="flex flex-col justify-center space-y-8">
          {/* STATARENA Logo and Branding */}
          <div className="text-center lg:text-left">
            <div className="mx-auto lg:mx-0 mb-6 flex items-center justify-center lg:justify-start">
              <StatsArenaLogo size="small" />
            </div>
            <p className="text-league-gold-light text-xl font-medium font-league-display">
              Elite Statistics Combat Arena
            </p>
            <div className="h-1 w-32 bg-gradient-to-r from-league-bronze via-league-gold to-league-bronze mx-auto lg:mx-0 mt-4 rounded-full opacity-80"></div>
          </div>

          {/* Game Description */}
          <div className="league-card-simple rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-league-gold mb-6 font-league-serif flex items-center">
              <div className="w-8 h-8 bg-league-gold rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-league-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              Combat Protocols
            </h2>
            <ul className="space-y-3 text-league-gold-light text-base leading-relaxed font-league-sans">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-league-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Channel League database for statistical analysis
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-league-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Extract metrics from match archives
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-league-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Combat damage by statistical superiority
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-league-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Ascend rankings and claim achievements
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Authentication Forms */}
        <div className="flex flex-col justify-center space-y-6">
          {/* Auth Mode Selection */}
          <div className="league-card-simple rounded-lg p-6">
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setAuthMode('demo')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 font-league-serif ${
                  authMode === 'demo' 
                    ? 'league-button-active' 
                    : 'league-button-simple text-league-gold-light hover:text-league-gold'
                }`}
              >
                DEMO
              </button>
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 font-league-serif ${
                  authMode === 'login' 
                    ? 'league-button-active' 
                    : 'league-button-simple text-league-gold-light hover:text-league-gold'
                }`}
              >
                LOGIN
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 font-league-serif ${
                  authMode === 'signup' 
                    ? 'league-button-active' 
                    : 'league-button-simple text-league-gold-light hover:text-league-gold'
                }`}
              >
                REGISTER
              </button>
            </div>
            <p className="text-base text-league-gold-light font-league-display text-center">
              {authMode === 'demo' && 'Experience combat with demo data'}
              {authMode === 'login' && 'Access your summoner profile'}
              {authMode === 'signup' && 'Create new summoner profile'}
            </p>
          </div>

          {/* Email/Password Forms for Login/Signup */}
          {(authMode === 'login' || authMode === 'signup') && (
            <div className="space-y-6">
              <div>
                <label className="block text-base font-medium text-league-gold mb-3 font-league-serif">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="summoner@rift.com"
                  className="w-full px-6 py-4 league-input-simple rounded-lg text-league-gold placeholder-league-gold-light/60 focus:outline-none transition-all duration-300 font-medium font-league-sans"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-league-gold mb-3 font-league-serif">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-6 py-4 league-input-simple rounded-lg text-league-gold placeholder-league-gold-light/60 focus:outline-none transition-all duration-300 font-medium font-league-sans"
                />
              </div>
            </div>
          )}

          {/* Riot ID Input for Demo and Signup */}
          {(authMode === 'demo' || authMode === 'signup') && (
            <div className="space-y-6">
              <div>
                <label className="block text-base font-medium text-league-gold mb-3 font-league-serif">
                  {authMode === 'demo' ? 'RIOT ID (OPTIONAL)' : 'LEAGUE USERNAME (OPTIONAL)'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    placeholder="e.g., Faker"
                    className="w-full px-6 py-4 league-input-simple rounded-lg text-league-gold placeholder-league-gold-light/60 focus:outline-none transition-all duration-300 font-medium font-league-sans"
                  />
                  <input
                    type="text"
                    value={tagLine}
                    onChange={(e) => setTagLine(e.target.value)}
                    placeholder="e.g., KR1"
                    className="w-full px-6 py-4 league-input-simple rounded-lg text-league-gold placeholder-league-gold-light/60 focus:outline-none transition-all duration-300 font-medium font-league-sans"
                  />
                </div>
                <p className="text-sm text-league-gold-light/80 mt-2 font-league-display">
                  {authMode === 'demo' 
                    ? 'Connect your Riot account for authentic statistical combat' 
                    : 'Link your League profile for enhanced combat analytics'
                  }
                </p>
                {authMode === 'demo' && (
                  <div className="league-info-box-simple rounded-lg p-4 mt-4">
                    <div className="text-league-mana text-sm flex items-start font-league-display">
                      <div className="w-5 h-5 bg-league-mana rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>
                        <strong>DEMO MODE:</strong> Input authentic Riot credentials (e.g., "Faker#KR1") to engage with real statistical data. System will fallback to synthetic data if authentication fails.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border-2 border-red-400/50 rounded-lg p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-red-300 font-semibold text-lg">CONNECTION FAILURE</h4>
                  <p className="text-red-200 text-base mt-1">{error}</p>
                  <p className="text-red-300 text-base mt-2">Initiating fallback to demo protocol...</p>
                </div>
              </div>
            </div>
          )}

          {/* Auth Button */}
          <div className="space-y-6">
            <button
              onClick={handleAuth}
              disabled={isLoading || ((authMode === 'login' || authMode === 'signup') && (!email || !password))}
              className={`
                w-full py-5 px-8 rounded-lg font-bold text-xl transition-all duration-400 font-league-serif tracking-wide
                ${isLoading || ((authMode === 'login' || authMode === 'signup') && (!email || !password))
                  ? 'bg-gray-600 cursor-not-allowed border-2 border-gray-500 text-gray-400' 
                  : 'league-primary-button-simple hover:scale-105'
                }
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-black mr-4"></div>
                  {authMode === 'demo' ? 'INITIALIZING DEMO...' : 
                   authMode === 'login' ? 'AUTHENTICATING...' : 'CREATING PROFILE...'}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-4">
                    {authMode === 'demo' ? (
                      <svg className="w-5 h-5 text-league-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
                        <path d="M8 10a2 2 0 11-4 0 2 2 0 014 0zm8-2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    ) : authMode === 'login' ? (
                      <svg className="w-5 h-5 text-league-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-league-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                    )}
                  </div>
                  {authMode === 'demo' ? 'INITIATE DEMO COMBAT' : 
                   authMode === 'login' ? 'ACCESS COMBAT ARENA' : 'CREATE & DEPLOY'}
                </div>
              )}
            </button>
            
            <p className="text-center text-base text-league-gold-light font-league-display">
              {authMode === 'demo' ? 'No registration required - immediate combat access' : 
               authMode === 'login' ? 'Access your preserved combat statistics' :
               'Join the elite summoner combat league'}
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}