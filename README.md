# 🚀 AstroDefenders - NASA Space Game

> **The Earth is in danger — asteroids are approaching fast!**  
> You are a NASA Cadet assigned to the AstroDefense Command Center.  
> **Your mission: Learn, Answ## 🚀 Deploy to Netlify (Easy Hosting!)

### 🌐 Option 1: Direct GitHub Deploy (Recommended)
1. **Sign up** at [netlify.com](https://netlify.com) (free)
2. **Connect GitHub** and select your `nasaspaceapps` repository
3. **Deploy settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Click Deploy** - Your game will be live in minutes!

### 📤 Option 2: Manual Deploy
```bash
# Build the project locally
npm run build

# Drag & drop the 'dist' folder to Netlify's deploy area
# Or use Netlify CLI:
npx netlify-cli deploy --prod --dir=dist
```

### ⚙️ Deploy Configuration
The `netlify.toml` file is already configured with:
- ✅ Automatic builds from GitHub
- ✅ SPA routing support
- ✅ Optimized caching for assets
- ✅ Security headers

### 🎯 Benefits of Netlify:
- **Free hosting** for personal projects
- **Automatic deployments** on every GitHub push
- **Custom domain** support
- **HTTPS** enabled by default
- **Global CDN** for fast loading worldwide

---

## 🐛 Troubleshooting

### 🚨 Common Issues & Solutions and Protect** 🌍

![AstroDefenders Game](https://img.shields.io/badge/NASA-Space%20Game-blue?style=for-the-badge&logo=rocket)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite)

## 🚀 Quick Start - Get Playing in 2 Minutes!

### ✅ Requirements
- **Node.js** (version 16+) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)

### 📥 Installation (Copy & Paste These Commands)

```bash
# 1. Clone the game
git clone https://github.com/aditya-pa/nasaspaceapps.git
cd nasaspaceapps

# 2. Install dependencies
npm install

# 3. Start the game
npm run dev
```

**🎮 That's it!** Open `http://localhost:3000` in your browser and start playing!

---

## � About the Game

**AstroDefenders** is an educational space defense game where you learn real NASA space science while defending Earth from incoming asteroids!

### 🎯 Educational Focus
- **Real NASA Data**: Learn about actual asteroids from NASA's database
- **Space Science Questions**: Answer questions about astronomy, physics, and space exploration  
- **Interactive Learning**: Learn through gameplay, not boring textbooks
- **Fact Collection**: Collect detailed cards about real space objects

### 🎮 How to Play
1. **🎬 Watch the Intro**: Experience your NASA mission briefing
2. **🎯 Click Asteroids**: Click on incoming asteroids to trigger questions
3. **🧠 Answer Questions**: Choose the correct answer to destroy the asteroid
4. **🛡️ Protect Earth**: Wrong answers let asteroids hit Earth and damage your shield
5. **🎴 Collect Cards**: Gather fact cards about real asteroids you encounter
6. **� Level Up**: Progress through waves with increasing difficulty

### ⭐ Game Features
- **🚫 Question Freeze**: Game pauses while you think - no pressure!
- **🎵 Space Audio**: Immersive music and sound effects
- **💫 Visual Effects**: Smooth animations and 3D Earth
- **🏆 Achievement System**: Unlock rewards and power-ups
- **🎴 Card Collection**: Different rarity cards (Common to Legendary!)

## 🛠️ Tech Stack
- **Animations**: Framer Motion
- **Audio**: Howler.js
- **API**: NASA NeoWs (Near Earth Object Web Service)
- **Storage**: LocalStorage for game data and progress

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/astro-defenders.git
   cd astro-defenders
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## 🌍 NASA API Integration

The game uses NASA's Near Earth Object Web Service (NeoWs) to fetch real asteroid data:

- **API Endpoint**: `https://api.nasa.gov/neo/rest/v1/feed`
- **Data Used**: Asteroid name, size, velocity, approach date
- **Educational Value**: Real space data converted to kid-friendly facts
- **Fallback**: Mock data when API is unavailable

### Example API Usage
```javascript
// Fetch today's asteroids
const response = await fetch(
  `https://api.nasa.gov/neo/rest/v1/feed?start_date=today&api_key=DEMO_KEY`
)
```

## 🎯 Educational Goals

### STEM Learning Objectives
- **Space Science**: Solar system, asteroids, planetary defense
- **Mathematics**: Distance, speed, ratios, scientific notation
- **Physics**: Gravity, motion, energy
- **Critical Thinking**: Problem-solving under pressure

### Child-Friendly Features
- **Visual Learning**: Size comparisons ("big as a football field")
- **Gamification**: Points, streaks, achievements
- **Positive Reinforcement**: Encouraging feedback for all attempts
- **Progressive Difficulty**: Adapts to player skill level

## 📂 Project Structure

```
src/
├── components/           # React components
│   ├── EarthScene.jsx    # 3D Earth with Three.js
│   ├── AsteroidManager.jsx # Asteroid spawning and physics
│   ├── QuestionPanel.jsx  # Quiz interface
│   ├── HUD.jsx           # Game interface overlay
│   ├── PowerUps.jsx      # Power-up system
│   └── CardCollection.jsx # Spacepedia collection
├── services/             # Game services
│   ├── nasaApi.js        # NASA API integration
│   ├── quizData.json     # Question database
│   ├── quizData.js       # Quiz logic
│   ├── soundManager.js   # Audio system
│   └── storage.js        # Local data persistence
├── assets/               # Game assets
│   └── sounds/           # Audio files
├── App.jsx              # Main game component
└── main.jsx             # Entry point
```

## 🎵 Sound Assets

The game includes placeholder sound effects. For production, add these files to `public/sounds/`:

- `space-ambient.mp3` - Background music
- `laser.mp3` - Laser fire sound
- `explosion.mp3` - Asteroid destruction
- `powerup.mp3` - Power-up collection
- `shield-low.mp3` - Shield warning
- `game-over.mp3` - Game end sound

## 🏆 Game Mechanics

### Scoring System
- **Base Points**: 10 points per correct answer
- **Streak Bonus**: +2 points per consecutive correct answer
- **Double Points Power-up**: 2x multiplier for 15 seconds
- **Difficulty Bonus**: Harder questions worth more points

### Shield System
- **Starting Shield**: 100%
- **Wrong Answer Penalty**: -20% shield per mistake
- **Shield Boost Power-up**: +20% shield restoration
- **Game Over**: Shield reaches 0%

### Level Progression
- **Speed Increase**: Asteroids fall faster each level
- **Spawn Rate**: More frequent asteroid spawning
- **Question Difficulty**: Harder questions at higher levels

## 🌟 Features for NASA Space Apps Challenge

### Innovation
- **Real-time NASA data integration**
- **Educational gaming approach** 
- **Child-friendly space learning**
- **Responsive cross-platform design**

### Technical Excellence
- **Modern React architecture**
- **3D graphics with Three.js**
- **Smooth 60fps animations**
- **Professional UI/UX design**

### Educational Impact
- **STEM skill development**
- **Space science education**
- **Problem-solving practice**
- **Curiosity about space exploration**

## � Troubleshooting

### 🚨 Common Issues & Solutions

**"Port 3000 already in use"**
```bash
# Kill the process and restart
npx kill-port 3000
npm run dev
# Or use a different port
npm run dev -- --port 3001
```

**"Module not found" or dependency errors**
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Game not loading or white screen**
```bash
# Clear browser cache and try again
# Or check browser console for errors (F12)
```

**Audio not playing**
- Check if browser allows autoplay (click anywhere on page first)
- Check volume settings
- Try refreshing the page

### 💻 System Requirements
- **Node.js**: 16.0.0 or higher
- **RAM**: 2GB minimum  
- **Browser**: Chrome, Firefox, Safari, Edge (latest versions)
- **Internet**: Required for NASA API data

## 🛠️ Development Commands

```bash
# Start development with hot reload
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview

# Check for code issues
npm run lint
```

## 📁 Project Structure

```
src/
├── components/          # All React components
│   ├── IntroPage.jsx   # NASA mission briefing
│   ├── AsteroidManager.jsx # Game logic
│   ├── CardCollection.jsx  # Collectible cards
│   └── ...
├── data/               # Game configuration
├── services/           # NASA API integration  
├── styles/             # CSS and animations
└── App.jsx             # Main game component

public/
├── bg.mp4              # Background space video
├── game_music.mp3      # Background music
└── index.html          # Main HTML file
```

## 🤝 Contributing

Want to improve the game? We'd love your help!

1. **Fork** this repository
2. **Clone** your fork: `git clone https://github.com/YOUR-USERNAME/nasaspaceapps.git`
3. **Create** a branch: `git checkout -b my-awesome-feature`
4. **Make** your changes
5. **Test** thoroughly: `npm run dev`
6. **Commit**: `git commit -m "Add awesome feature"`
7. **Push**: `git push origin my-awesome-feature`
8. **Create** a Pull Request

### � Ideas for Contributions
- Add new question categories
- Improve animations and effects
- Add new power-ups
- Enhance mobile experience
- Add multiplayer features
- Improve accessibility

## 📝 License

MIT License - feel free to use this project for learning and education!

## 🙏 Acknowledgments

- **NASA** for amazing space data and APIs
- **NASA Space Apps Challenge** for inspiring space education
- **React Team** for the awesome framework
- **Vite** for super-fast development
- **All contributors** who help improve this game

---

**🚀 Ready to defend Earth, NASA Cadet?**

*Made with ❤️ for space education and the NASA Space Apps Challenge*

- **Project**: AstroDefenders NASA Space Game
- **Challenge**: NASA Space Apps Challenge 2025
- **Team**: [Your Team Name]
- **Email**: [your-email@example.com]

---

**Made with 🚀 for the NASA Space Apps Challenge**

*Defending Earth, one question at a time!*