# Commander Tracker

A comprehensive Magic: The Gathering Commander life and timer tracking application built with React and Tailwind CSS.

## Features

### Game Management
- **3-4 Player Support**: Configurable games for 3 or 4 players
- **Customizable Starting Life**: Adjustable starting life totals with -5/-1/+1/+5 increment buttons (default 40 life)
- **Per-Player Timers**: Individual turn timers with customizable duration (default 15 minutes)
- **Random Starting Player**: Animated selection of the starting player
- **Turn Management**: Clockwise turn progression with visual active player indication

### Life Tracking
- **Large, Clear Life Totals**: Easy-to-read life counters with touch-friendly +/- buttons
- **Quick Life Adjustments**: Convenient increment/decrement controls positioned around timer
- **Player Elimination Detection**: Visual indicators for eliminated players

### Commander Damage
- **Full Commander Damage Tracking**: Track damage from each commander to each player
- **Lethal Damage Warnings**: Clear indicators when commander damage reaches 21+
- **Intuitive Modal Interface**: Easy-to-use commander damage adjustment modal with improved spacing

### Layout System
- **CSS Grid-Based Layout**: Modern 2x2 grid system replacing absolute positioning for better reliability
- **Responsive Card Sizing**: Cards scale from `w-[clamp(250px,35vw,350px)]` to work on all screen sizes
- **Smart Grid Spacing**: Uses `gap-[clamp(1rem,4vw,2rem)]` for responsive margins that prevent overlap
- **Rotated Player Cards**: Table-style layout with 90° and -90° rotations for immersive gameplay
- **No Overlap Design**: Grid system prevents layout issues across all device sizes
- **Cross-Device Consistency**: Works from iPhone SE (375px) to desktop screens

### Display Features
- **Progressive Web App (PWA)**: Install as a native app on mobile and desktop
- **Improved Fullscreen**: Enhanced fullscreen support with cross-browser compatibility
- **Visual Player States**: Color-coded borders and highlighting for active players
- **Touch-Optimized**: Large buttons and intuitive gestures for mobile gameplay
- **Clean Interface**: Streamlined UI without unnecessary elements
- **Offline Support**: Works without internet connection after initial load

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/commander-tracker.git
   cd commander-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## PWA Installation

Once the app is running or deployed, you can install it as a native app:

### Mobile (iOS/Android)
1. Open the app in your mobile browser (Safari/Chrome)
2. Tap the browser menu (share button on iOS, three dots on Android)
3. Select "Add to Home Screen" or "Install"
4. The app will appear on your home screen like a native app

### Desktop (Chrome/Edge)
1. Look for the install icon in the address bar
2. Click "Install Commander Tracker"
3. The app will be installed and can be launched from your applications

### Features After Installation
- Works offline after initial load
- Full-screen experience without browser UI
- Faster launch times
- Native app-like behavior

## Usage

1. **Setup**: Configure number of players (3-4), starting life total, and timer duration using the increment/decrement buttons
2. **Start Game**: Begin with animated starting player selection
3. **Track Life**: Use the large +/- buttons positioned around the timer to adjust life totals
4. **Manage Turns**: Use the blue center button to pass turns clockwise
5. **Commander Damage**: Click "dmg" button on player cards to track commander damage in the modal
6. **Install as App**: Use browser's "Add to Home Screen" or "Install" option for native app experience
7. **Fullscreen**: Enable fullscreen mode for immersive mobile play

## Game Controls

### Setup Menu
- **Player Count**: Choose between 3 or 4 players
- **Starting Life**: Adjust with -5, -1, +1, +5 buttons (all with consistent border styling)
- **Timer Duration**: Set minutes per player with matching control buttons

### In-Game Controls
- **Center Controls**: Play/pause, reset, next player, and settings access
- **Player Cards**: Life adjustment buttons positioned around timer display
- **Commander Damage**: Dedicated "dmg" button for easy access to damage tracking modal

### Settings Menu
- **Fullscreen Mode**: Toggle fullscreen for mobile devices
- **Game Settings**: Return to setup menu

## Technologies Used

- **React**: Frontend framework with hooks for state management
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Modern icon library for UI elements
- **Vite**: Fast development build tool

## Project Structure

- `src/App.jsx`: Main application component containing all game logic and UI
- `src/utils/constants.js`: Player color schemes and game constants
- `src/index.css`: Global styles, Tailwind imports, and fullscreen optimization

## Technical Implementation Details

### Layout Architecture
The app uses a modern CSS Grid-based layout system that replaced the original absolute positioning approach:

#### Grid Structure
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: clamp(1rem, 4vw, 2rem);
  padding: clamp(0.5rem, 2vw, 1rem);
}
```

#### Player Card Positioning
- **3-Player**: Uses grid cells [1,1], [1,2], [2,1] (top-left, bottom-left, top-right)
- **4-Player**: Uses all four grid cells [1,1], [1,2], [2,1], [2,2]
- **Alignment**: Center-justified within each grid cell for consistent positioning
- **Rotation**: 90° for left side cards, -90° for right side cards

#### Responsive Sizing
- **Card Width**: `clamp(250px, 35vw, 350px)` - scales from mobile to desktop
- **Card Height**: `clamp(140px, 18vh, 200px)` - maintains aspect ratio
- **Grid Gaps**: Responsive spacing prevents overlap on all screen sizes
- **Content Scaling**: All text and buttons use clamp() for proportional sizing

### Known Issues Fixed
- ✅ **Overlap Prevention**: Grid system eliminates card overlap issues
- ✅ **iPhone SE Compatibility**: Verified on 375px width screens
- ✅ **Cascading Layout Problems**: No more sizing changes affecting positioning
- ✅ **Center Control Sizing**: Consistent button sizes across all devices

## Key Features Implemented

### Recent Layout System Overhaul
- **Complete CSS Grid Migration**: Replaced problematic absolute positioning with robust 2x2 CSS Grid
- **Responsive Design Fix**: Eliminated cascading layout issues that occurred when resizing elements
- **Cross-Screen Compatibility**: Cards now properly scale on all devices without overlap
- **Improved Center Controls**: Larger, more touch-friendly buttons (`p-4` with `w-6 h-6` icons)
- **Smart Spacing System**: Responsive gaps that adapt from mobile to desktop (`clamp(1rem,4vw,2rem)`)
- **iPhone SE Support**: Verified compatibility with smallest common screen size (375px width)

### Previous Improvements
- **PWA Support**: Installable as native app with offline functionality
- **Enhanced Fullscreen**: Cross-browser fullscreen compatibility
- **Commander Damage Modal**: Improved spacing and user experience
- **Touch Optimization**: Better button sizing and interaction areas

### Mobile Optimization
- **Touch-Friendly Interface**: Minimum 44px touch targets on all interactive elements
- **Fullscreen Experience**: Native fullscreen mode with disabled scrolling
- **Responsive Grid Layout**: CSS Grid system that scales perfectly on all screen sizes
- **iPhone SE Tested**: Verified compatibility with smallest common mobile resolution (375px)
- **Smart Spacing**: Responsive margins that adapt to available screen space
- **Optimized Card Rotation**: Intuitive table view with properly sized rotated player cards

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT License

---

**Happy Gaming!** 🎲✨