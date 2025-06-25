# 🎮 LoL Stat Battle

A League of Legends stat comparison battle game built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **🔐 Secure Authentication**: Supabase-powered user system with secure API calls
- **🛡️ Protected API**: Riot API keys stored server-side via Supabase Edge Functions
- **⚔️ Stat Battle System**: Compare random stats from match history
- **💔 HP-based Combat**: Damage based on stat differences
- **🎨 Animated UI**: Smooth transitions and battle effects
- **🏆 Leaderboards**: Track wins and progression  
- **🎖️ Badge System**: Earn achievements for various stats

## 🎯 How to Play

1. **Login**: Connect your Riot Games account (or use demo mode)
2. **Find Battle**: Get matched with a random opponent
3. **Stat Comparison**: Random stats from your match history are compared
4. **Battle**: Winner determined by stat values, loser takes damage
5. **Victory**: First player to reach 0 HP loses the match

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎨 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Orbitron** font for that gaming aesthetic
- **Mock Riot API** for development (easily replaceable with real API)

## 🎪 Stat Categories

### Serious Stats
- Average CS/Min across ranked games
- Vision score in recent matches
- KDA ratio calculations

### Meme Stats
- Most deaths in a single game
- Deaths in your 3rd most recent game
- Longest game duration

### Fun Stats
- Total gold earned
- Deathless games count
- Current win streak

## 🏆 Battle System

- **Best of 5** format (or until HP runs out)
- **Damage scaling**: 10-25% based on stat difference
- **Random selection**: Weighted stat category selection
- **Visual feedback**: Animations for wins/losses
- **Round history**: Track all battle rounds

## 🎯 Future Enhancements

- Real Riot API integration
- Multiplayer matchmaking
- Advanced badge system
- Tournament mode
- Mobile responsive design
- Sound effects and music
- Spectator mode
- Custom stat categories

## 📝 Development Notes

This is a demo application using mock data. To integrate with the real Riot API:

1. Get Riot Developer API key
2. Replace `riotApi.ts` mock service with real API calls
3. Implement proper OAuth flow
4. Add rate limiting and error handling

## 🎮 Screenshots

The app features:
- Dark gaming-themed UI with LoL-inspired colors
- Smooth animations and transitions
- Split-screen battle view
- Slot machine stat selection
- Dramatic win/loss reveals

## 🚀 Deployment

```bash
# Build the app
npm run build

# Deploy to your preferred platform
# (Vercel, Netlify, etc.)
```

---

**Note**: This is a demo application for educational purposes. League of Legends is a trademark of Riot Games, Inc.
