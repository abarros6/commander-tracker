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

### Layout Options
- **Table View**: Simulated table layout with rotated player cards positioned around a virtual table
- **Grid View**: Traditional grid layout for simpler viewing
- **Responsive Design**: Optimized for both desktop and mobile devices

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
6. **Layout**: Switch between Table and Grid views in the settings menu
7. **Install as App**: Use browser's "Add to Home Screen" or "Install" option for native app experience
8. **Fullscreen**: Enable fullscreen mode for immersive mobile play

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
- **Layout Toggle**: Switch between Table and Grid views
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

## Key Features Implemented

### Recent Improvements
- **PWA Support**: Now installable as a native app with offline functionality
- **Enhanced Fullscreen**: Improved fullscreen compatibility across browsers and mobile devices
- Removed dice rolling and coin flipping functionality for streamlined experience
- Enhanced commander damage modal with better spacing and centered life display
- Improved button sizing and spacing for better touch interaction
- Cleaned up settings menu to focus on layout and display controls
- Unified button styling with consistent border treatments

### Mobile Optimization
- Touch-friendly button sizes and spacing
- Fullscreen mode with disabled scrolling
- Responsive layout that adapts to different screen sizes
- Optimized table view with rotated cards for intuitive gameplay

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