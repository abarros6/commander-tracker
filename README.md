# Commander Tracker

A mobile-first web application for tracking 4-player Magic: The Gathering Commander games. Features chess clock-style timers combined with life total and commander damage tracking.

![Commander Tracker Screenshot](https://via.placeholder.com/800x400?text=Commander+Tracker)

## Features

- ⏱️ **Chess Clock Timer System** - 4 independent timers, only active player counts down
- ❤️ **Life Total Tracking** - Starting at 40 life with easy +/- controls
- ⚔️ **Commander Damage Tracking** - Toggle-able tracking with elimination warnings
- 📱 **Mobile-First Design** - Optimized for phones and tablets
- 🎨 **Color-Coded Players** - Easy identification with distinct player colors
- ⚡ **Fast & Responsive** - Built with Vite and Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd commander-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - For mobile testing, use your local IP (e.g., `http://192.168.1.100:5173`)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## Building for Production

### Local Build

```bash
# Create optimized build
npm run build

# Preview the build locally
npm run preview
```

The build outputs to the `dist/` directory and is ready for deployment.

### Build Verification

Before deploying, verify the build works correctly:

```bash
npm run build && npm run preview
```

Test the preview URL thoroughly on both desktop and mobile devices.

## Deployment

### Render (Recommended)

This app is optimized for deployment on [Render](https://render.com) as a static site.

#### Automatic Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create New Static Site on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Static Site"
   - Connect your GitHub repository

3. **Configure Build Settings**
   ```
   Build Command: npm run build
   Publish Directory: dist
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Render will automatically build and deploy
   - Get your live URL (e.g., `https://commander-tracker.onrender.com`)

#### Manual Deployment (render.yaml)

Create `render.yaml` in your project root:

```yaml
services:
  - type: web
    name: commander-tracker
    env: static
    buildCommand: npm run build
    staticPublishPath: dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

### Alternative Deployment Options

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
npm run build
vercel --prod
```

#### GitHub Pages
1. Build the project: `npm run build`
2. Push the `dist` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

## Development Guide

### Project Structure

```
commander-tracker/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── PlayerCard.jsx        # Individual player card
│   │   ├── TimerDisplay.jsx      # Timer component
│   │   ├── LifeCounter.jsx       # Life tracking
│   │   ├── CommanderDamage.jsx   # Commander damage
│   │   └── GameControls.jsx      # Game control buttons
│   ├── hooks/             # Custom React hooks
│   │   └── useTimer.js           # Timer management
│   ├── utils/             # Utility functions
│   │   ├── constants.js          # App constants
│   │   └── formatTime.js         # Time formatting
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS config
└── README.md
```

### Key Components

- **PlayerCard**: Main player interface with timer, life counter, and commander damage
- **GameControls**: Central controls for play/pause, reset, next player, and commander damage toggle
- **useTimer**: Custom hook managing the timer intervals and active player logic

### Mobile Optimization

The app uses several mobile-first design principles:

- **Touch Targets**: All interactive elements are minimum 44x44px
- **Responsive Grid**: Single column on mobile, 2x2 grid on tablet+
- **Large Text**: Timers (48-60px), life totals (36-48px), player names (20-24px)
- **Viewport Meta**: Prevents zooming and optimizes for mobile browsers

### Game Logic

- **Timer System**: Only the active player's timer decrements
- **Life Tracking**: Standard Commander format starting at 40 life
- **Commander Damage**: Each player tracks damage from other 3 players
- **Elimination**: Visual warnings when life ≤ 0 or commander damage ≥ 21

## Testing

### Manual Testing Checklist

Before deployment, test these features:

- [ ] All timers count down correctly
- [ ] Only active player's timer decrements
- [ ] Life totals update accurately with +/- buttons
- [ ] Commander damage tracking works for all player combinations
- [ ] Reset functionality clears all data
- [ ] Player name editing works
- [ ] Active player highlighting is visible
- [ ] Mobile layout is usable on actual devices
- [ ] Touch targets are adequately sized
- [ ] No horizontal scrolling on mobile
- [ ] Landscape orientation works
- [ ] Works on iOS Safari and Android Chrome

### Device Testing

Test on these devices/browsers:

- **Mobile**: iPhone Safari, Android Chrome
- **Tablet**: iPad Safari, Android tablet
- **Desktop**: Chrome, Firefox, Safari, Edge

## Configuration

### Environment Variables

No environment variables are required for basic functionality.

### Tailwind CSS

The project uses Tailwind CSS v4 with the default configuration. Modify `tailwind.config.js` to customize colors, spacing, or breakpoints.

### Vite Configuration

The `vite.config.js` is set up for React with standard optimizations. Modify as needed for additional build requirements.

## Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Timers Not Working**
   - Check browser console for JavaScript errors
   - Ensure `useTimer` hook is properly imported

3. **Mobile Layout Issues**
   - Verify viewport meta tag in `index.html`
   - Check Tailwind responsive classes (`md:`, `lg:`)

4. **Deployment Fails**
   - Verify Node.js version compatibility
   - Check build command and publish directory settings
   - Review deployment logs for specific errors

### Performance Issues

- **Slow Loading**: Optimize images, enable compression
- **Memory Leaks**: Check timer cleanup in `useTimer` hook
- **Large Bundle**: Analyze with `npm run build` and consider code splitting

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## Technology Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS v4
- **Icons**: lucide-react
- **Build Tool**: Vite
- **Deployment**: Render (static site)

## License

MIT License - feel free to use this project for your Magic: The Gathering games!

## Support

For issues or questions:

1. Check this README for common solutions
2. Review the requirements document (`commander-tracker-requirements.md`)
3. Create an issue in the GitHub repository

---

**Happy Gaming!** 🎲✨
