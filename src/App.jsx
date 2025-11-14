import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Clock, Heart, Menu, ArrowRight, ArrowLeft } from 'lucide-react';
import { PLAYER_COLORS_DEFAULT, PLAYER_COLORS_ACTIVE, PLAYER_COLORS_COMMANDER_DAMAGE } from './utils/constants';

export default function CommanderTracker() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [activePlayer, setActivePlayer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [settingsButtonState, setSettingsButtonState] = useState('normal'); // 'normal', 'yellow', 'red'
  const settingsTimeoutRef = useRef(null);
  const [resetButtonState, setResetButtonState] = useState('normal'); // 'normal', 'orange', 'red'
  const resetTimeoutRef = useRef(null);
  const [isSelectingStartingPlayer, setIsSelectingStartingPlayer] = useState(false);
  const [animatedActivePlayer, setAnimatedActivePlayer] = useState(0);
  const [showCommanderDamageModal, setShowCommanderDamageModal] = useState(false);
  const [commanderDamagePlayerIndex, setCommanderDamagePlayerIndex] = useState(null);
  const [deathButtonStates, setDeathButtonStates] = useState({});
  const deathTimeoutRefs = useRef({});
  const intervalRef = useRef(null);
  const animationRef = useRef(null);
  const holdIntervalRef = useRef(null);
  const holdTimeoutRef = useRef(null);

  // Game settings
  const [gameSettings, setGameSettings] = useState({
    numberOfPlayers: 4,
    startingLife: 40,
    timerMinutes: 15
  });

  // Player state with floating mana - will be dynamically created based on numberOfPlayers
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (isRunning && activePlayer !== null) {
      intervalRef.current = setInterval(() => {
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === activePlayer && p.time > 0 && !p.isDead) {
            return { ...p, time: p.time - 1 };
          }
          return p;
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      if (settingsTimeoutRef.current) {
        clearTimeout(settingsTimeoutRef.current);
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
      // Clear all death timeouts
      Object.values(deathTimeoutRefs.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [isRunning, activePlayer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLifeChange = (playerIdx, change) => {
    setPlayers(prev => prev.map((p, idx) => 
      idx === playerIdx ? { ...p, life: Math.max(0, p.life + change) } : p
    ));
  };

  const startHoldRepeat = (playerIdx, change) => {
    // Clear any existing intervals
    clearInterval(holdIntervalRef.current);
    clearTimeout(holdTimeoutRef.current);
    
    // Initial delay before starting rapid repeat
    holdTimeoutRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => {
        handleLifeChange(playerIdx, change);
      }, 150); // Repeat every 150ms for fast incrementing
    }, 500); // Wait 500ms before starting rapid repeat
  };

  const stopHoldRepeat = () => {
    clearInterval(holdIntervalRef.current);
    clearTimeout(holdTimeoutRef.current);
  };

  const handleCommanderDamage = (playerIdx, sourceIdx, change) => {
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === playerIdx) {
        const newDamage = [...p.commanderDamage];
        const oldDamage = newDamage[sourceIdx];
        newDamage[sourceIdx] = Math.max(0, oldDamage + change);
        
        // Calculate the actual change in commander damage
        const actualChange = newDamage[sourceIdx] - oldDamage;
        
        // Deduct the commander damage change from life total
        const newLife = Math.max(0, p.life - actualChange);
        
        return { ...p, commanderDamage: newDamage, life: newLife };
      }
      return p;
    }));
  };





  const handleSettingsButtonClick = () => {
    // Clear existing timeout
    if (settingsTimeoutRef.current) {
      clearTimeout(settingsTimeoutRef.current);
    }

    if (settingsButtonState === 'normal') {
      setSettingsButtonState('yellow');
    } else if (settingsButtonState === 'yellow') {
      setSettingsButtonState('red');
    } else if (settingsButtonState === 'red') {
      // Go to game settings
      setShowSetup(true);
      setSettingsButtonState('normal');
      return; // Don't set timeout if going to settings
    }

    // Set timeout to reset to normal after 5 seconds
    settingsTimeoutRef.current = setTimeout(() => {
      setSettingsButtonState('normal');
    }, 5000);
  };

  const handleResetButtonClick = () => {
    // Clear existing timeout
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    if (resetButtonState === 'normal') {
      setResetButtonState('orange');
    } else if (resetButtonState === 'orange') {
      setResetButtonState('red');
    } else if (resetButtonState === 'red') {
      // Actually reset the game
      resetGame();
      setResetButtonState('normal');
      return; // Don't set timeout if resetting
    }

    // Set timeout to reset to normal after 5 seconds
    resetTimeoutRef.current = setTimeout(() => {
      setResetButtonState('normal');
    }, 5000);
  };

  const handleDeathButtonClick = (playerIdx) => {
    // Clear existing timeout for this player
    if (deathTimeoutRefs.current[playerIdx]) {
      clearTimeout(deathTimeoutRefs.current[playerIdx]);
    }

    const currentState = deathButtonStates[playerIdx] || 'normal';
    const player = players[playerIdx];

    if (!player.isDead) {
      // Death sequence (alive -> dead)
      if (currentState === 'normal') {
        setDeathButtonStates(prev => ({ ...prev, [playerIdx]: 'first' }));
      } else if (currentState === 'first') {
        setDeathButtonStates(prev => ({ ...prev, [playerIdx]: 'second' }));
      } else if (currentState === 'second') {
        // Mark player as dead
        setPlayers(prev => prev.map((p, idx) => 
          idx === playerIdx ? { ...p, isDead: true } : p
        ));
        setDeathButtonStates(prev => ({ ...prev, [playerIdx]: 'normal' }));
        return; // Don't set timeout if marking as dead
      }
    } else {
      // Revival sequence (dead -> alive)
      if (currentState === 'normal') {
        setDeathButtonStates(prev => ({ ...prev, [playerIdx]: 'revive_first' }));
      } else if (currentState === 'revive_first') {
        setDeathButtonStates(prev => ({ ...prev, [playerIdx]: 'revive_second' }));
      } else if (currentState === 'revive_second') {
        // Revive player
        setPlayers(prev => prev.map((p, idx) => 
          idx === playerIdx ? { ...p, isDead: false } : p
        ));
        setDeathButtonStates(prev => ({ ...prev, [playerIdx]: 'normal' }));
        return; // Don't set timeout if reviving
      }
    }

    // Set timeout to reset to normal after 5 seconds
    deathTimeoutRefs.current[playerIdx] = setTimeout(() => {
      setDeathButtonStates(prev => ({ ...prev, [playerIdx]: 'normal' }));
    }, 5000);
  };

  const nextPlayer = () => {
    // Clockwise order for 4 players: left-top → right-top → right-bottom → left-bottom
    // Clockwise order for 3 players: left-top → right-top → left-bottom
    let nextPlayerIndex;
    if (gameSettings.numberOfPlayers === 3) {
      // 3-player clockwise: 0 (left-top) → 2 (right-top) → 1 (left-bottom) → 0
      const clockwiseOrder = [0, 2, 1];
      const alivePlayers = clockwiseOrder.filter(idx => !players[idx]?.isDead);
      if (alivePlayers.length === 0) return; // All players dead
      
      const currentIndex = alivePlayers.indexOf(activePlayer);
      const nextIndex = (currentIndex + 1) % alivePlayers.length;
      nextPlayerIndex = alivePlayers[nextIndex];
    } else {
      // 4-player clockwise: 0 (left-top) → 2 (right-top) → 3 (right-bottom) → 1 (left-bottom) → 0
      const clockwiseOrder = [0, 2, 3, 1];
      const alivePlayers = clockwiseOrder.filter(idx => !players[idx]?.isDead);
      if (alivePlayers.length === 0) return; // All players dead
      
      const currentIndex = alivePlayers.indexOf(activePlayer);
      const nextIndex = (currentIndex + 1) % alivePlayers.length;
      nextPlayerIndex = alivePlayers[nextIndex];
    }
    setActivePlayer(nextPlayerIndex);
  };

  const previousPlayer = () => {
    // Counter-clockwise order (reverse of clockwise)
    let previousPlayerIndex;
    if (gameSettings.numberOfPlayers === 3) {
      // 3-player counter-clockwise: 0 (left-top) ← 2 (right-top) ← 1 (left-bottom) ← 0
      const clockwiseOrder = [0, 2, 1];
      const alivePlayers = clockwiseOrder.filter(idx => !players[idx]?.isDead);
      if (alivePlayers.length === 0) return; // All players dead
      
      const currentIndex = alivePlayers.indexOf(activePlayer);
      const previousIndex = (currentIndex - 1 + alivePlayers.length) % alivePlayers.length;
      previousPlayerIndex = alivePlayers[previousIndex];
    } else {
      // 4-player counter-clockwise: 0 (left-top) ← 2 (right-top) ← 3 (right-bottom) ← 1 (left-bottom) ← 0
      const clockwiseOrder = [0, 2, 3, 1];
      const alivePlayers = clockwiseOrder.filter(idx => !players[idx]?.isDead);
      if (alivePlayers.length === 0) return; // All players dead
      
      const currentIndex = alivePlayers.indexOf(activePlayer);
      const previousIndex = (currentIndex - 1 + alivePlayers.length) % alivePlayers.length;
      previousPlayerIndex = alivePlayers[previousIndex];
    }
    setActivePlayer(previousPlayerIndex);
  };

  const createPlayers = (numberOfPlayers, startingLife, timeInSeconds) => {
    const newPlayers = [];
    for (let i = 0; i < numberOfPlayers; i++) {
      const commanderDamageArray = new Array(numberOfPlayers - 1).fill(0);
      newPlayers.push({
        id: i + 1,
        life: startingLife,
        time: timeInSeconds,
        commanderDamage: commanderDamageArray,
        isDead: false
      });
    }
    return newPlayers;
  };

  const startNewGame = (settings) => {
    const timeInSeconds = settings.timerMinutes * 60;
    setGameSettings(settings);
    const newPlayers = createPlayers(settings.numberOfPlayers, settings.startingLife, timeInSeconds);
    setPlayers(newPlayers);
    
    setIsRunning(false);
    setGameStarted(true);
    setShowSetup(false);
    
    // Start the starting player selection animation
    setIsSelectingStartingPlayer(true);
    
    let animationSpeed = 100; // Start fast
    let currentPlayer = 0;
    let iterations = 0;
    const totalIterations = 20; // Total animation cycles
    
    const animateSelection = () => {
      setAnimatedActivePlayer(currentPlayer);
      currentPlayer = (currentPlayer + 1) % settings.numberOfPlayers;
      iterations++;
      
      // Gradually slow down the animation
      if (iterations > totalIterations * 0.6) {
        animationSpeed += 50;
      }
      
      if (iterations < totalIterations) {
        animationRef.current = setTimeout(animateSelection, animationSpeed);
      } else {
        // Animation finished, pick final starting player
        const finalStartingPlayer = Math.floor(Math.random() * settings.numberOfPlayers);
        setAnimatedActivePlayer(finalStartingPlayer);
        setActivePlayer(finalStartingPlayer);
        
        // End animation after a brief pause
        setTimeout(() => {
          setIsSelectingStartingPlayer(false);
        }, 1000);
      }
    };
    
    animateSelection();
  };

  const resetGame = () => {
    setIsRunning(false);
    
    // Clear any existing animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    // Clear death button states and timeouts
    setDeathButtonStates({});
    Object.values(deathTimeoutRefs.current).forEach(timeout => {
      if (timeout) clearTimeout(timeout);
    });
    deathTimeoutRefs.current = {};
    
    const timeInSeconds = gameSettings.timerMinutes * 60;
    const newPlayers = createPlayers(gameSettings.numberOfPlayers, gameSettings.startingLife, timeInSeconds);
    setPlayers(newPlayers);
    
    // Start the starting player selection animation
    setIsSelectingStartingPlayer(true);
    
    let animationSpeed = 100;
    let currentPlayer = 0;
    let iterations = 0;
    const totalIterations = 20;
    
    const animateSelection = () => {
      setAnimatedActivePlayer(currentPlayer);
      currentPlayer = (currentPlayer + 1) % gameSettings.numberOfPlayers;
      iterations++;
      
      if (iterations > totalIterations * 0.6) {
        animationSpeed += 50;
      }
      
      if (iterations < totalIterations) {
        animationRef.current = setTimeout(animateSelection, animationSpeed);
      } else {
        const finalStartingPlayer = Math.floor(Math.random() * gameSettings.numberOfPlayers);
        setAnimatedActivePlayer(finalStartingPlayer);
        setActivePlayer(finalStartingPlayer);
        
        setTimeout(() => {
          setIsSelectingStartingPlayer(false);
        }, 1000);
      }
    };
    
    animateSelection();
  };

  const getPlayerColor = (idx) => {
    return PLAYER_COLORS_ACTIVE[idx % PLAYER_COLORS_ACTIVE.length];
  };

  const getPlayerColorDefault = (idx) => {
    return PLAYER_COLORS_DEFAULT[idx % PLAYER_COLORS_DEFAULT.length];
  };
  const getPlayerColorCommanderDamage = (idx) => {
    return PLAYER_COLORS_COMMANDER_DAMAGE[idx % PLAYER_COLORS_COMMANDER_DAMAGE.length];
  };


  // Setup Menu Component
  const SetupMenu = () => {
    const [tempSettings, setTempSettings] = useState(gameSettings);

    const updateSetting = (key, value) => {
      setTempSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleStartGame = () => {
      startNewGame(tempSettings);
    };

    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-lg mx-auto pt-8">
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Game Setup</h1>
            <p className="text-gray-300">Configure your Commander game</p>
          </header>

          {/* Number of Players */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Settings className="mr-2" size={20} />
              Number of Players
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              {[3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => updateSetting('numberOfPlayers', num)}
                  className={`px-6 py-4 rounded-lg font-semibold text-lg sm:text-xl touch-manipulation transition-colors ${
                    tempSettings.numberOfPlayers === num
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {num} Players
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-400 text-center mt-2">
              Starting player will be chosen randomly
            </p>
          </div>

          {/* Game Settings */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Heart className="mr-2" size={20} />
              Starting Life
            </h2>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => updateSetting('startingLife', Math.max(1, tempSettings.startingLife - 1))}
                className="bg-gray-800 hover:bg-gray-700 border-2 border-red-600 p-3 rounded-lg text-2xl font-bold touch-manipulation"
              >
                -1
              </button>
              <button
                onClick={() => updateSetting('startingLife', Math.max(1, tempSettings.startingLife - 5))}
                className="bg-red-600 hover:bg-red-700 border-2 border-red-600 p-3 rounded-lg text-2xl font-bold touch-manipulation"
              >
                -5
              </button>
              <div className="text-3xl font-bold min-w-[80px] text-center">
                {tempSettings.startingLife}
              </div>
              <button
                onClick={() => updateSetting('startingLife', tempSettings.startingLife + 5)}
                className="bg-green-600 hover:bg-green-700 border-2 border-green-600 p-3 rounded-lg text-2xl font-bold touch-manipulation"
              >
                +5
              </button>
              <button
                onClick={() => updateSetting('startingLife', tempSettings.startingLife + 1)}
                className="bg-gray-800 hover:bg-gray-700 border-2 border-green-600 p-3 rounded-lg text-2xl font-bold touch-manipulation"
              >
                +1
              </button>
            </div>
          </div>

          {/* Timer Settings */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Clock className="mr-2" size={20} />
              Timer (Minutes per Player)
            </h2>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => updateSetting('timerMinutes', Math.max(1, tempSettings.timerMinutes - 1))}
                className="bg-gray-800 hover:bg-gray-700 border-2 border-red-600 p-3 rounded-lg text-2xl font-bold touch-manipulation"
              >
                -1
              </button>
              <button
                onClick={() => updateSetting('timerMinutes', Math.max(5, tempSettings.timerMinutes - 5))}
                className="bg-red-600 hover:bg-red-700 border-2 border-red-600 p-3 rounded-lg text-2xl font-bold touch-manipulation"
              >
                -5
              </button>
              <div className="text-3xl font-bold min-w-[80px] text-center">
                {tempSettings.timerMinutes}
              </div>
              <button
                onClick={() => updateSetting('timerMinutes', tempSettings.timerMinutes + 5)}
                className="bg-green-600 hover:bg-green-700 border-2 border-green-600 p-3 rounded-lg text-2xl font-bold touch-manipulation"
              >
                +5
              </button>
              <button
                onClick={() => updateSetting('timerMinutes', tempSettings.timerMinutes + 1)}
                className="bg-gray-800 hover:bg-gray-700 border-2 border-green-600 p-3 rounded-lg text-2xl font-bold touch-manipulation"
              >
                +1
              </button>
            </div>
          </div>


          {/* Start Game Button */}
          <button
            onClick={handleStartGame}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-xl touch-manipulation transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  };

  // Show setup menu if game hasn't started yet
  if (!gameStarted) {
    return <SetupMenu />;
  }

  return (
    <>
    <div 
      className={`h-screen w-screen bg-gray-900 text-white relative overflow-hidden transition-opacity ${
        showCommanderDamageModal ? 'opacity-30' : 'opacity-100'
      }`}
      onClick={() => {}}
    >
      {/* Center Controls - Back to original center positioning */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 flex items-center gap-3">
        {/* Settings Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSettingsButtonClick();
          }}
          className={`p-3 rounded-full shadow-lg touch-manipulation transition-colors ${
            settingsButtonState === 'normal' ? 'bg-gray-800 hover:bg-gray-700' :
            settingsButtonState === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-700' :
            'bg-red-600 hover:bg-red-700'
          }`}
        >
          <Menu size={18} />
        </button>
        
        {/* Reset Game Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleResetButtonClick();
          }}
          className={`p-3 rounded-full shadow-lg touch-manipulation transition-colors ${
            resetButtonState === 'normal' ? 'bg-purple-600 hover:bg-purple-700' :
            resetButtonState === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
            'bg-red-600 hover:bg-red-700'
          }`}
        >
          <RotateCcw size={18} />
        </button>
        
        {/* Play/Pause Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsRunning(!isRunning);
          }}
          className={`p-4 rounded-full shadow-lg touch-manipulation ${
            isRunning 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        {/* Previous Player Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            previousPlayer();
          }}
          className="bg-orange-600 hover:bg-orange-700 p-3 rounded-full shadow-lg touch-manipulation"
        >
          <ArrowLeft size={18} />
        </button>
        
        {/* Next Player Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextPlayer();
          }}
          className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full shadow-lg touch-manipulation"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Players Layout */}
      <div className="relative h-screen w-screen overflow-hidden">
        {players.slice(0, gameSettings.numberOfPlayers).map((player, idx) => {
          // Position and rotate cards for table layout
          let positionClass = '';
          let rotationClass = '';
          
          if (gameSettings.numberOfPlayers === 3) {
            // 3-player table layout: use 4-player pattern (first 3 positions)
            const positions = [
              'absolute left-[max(0.25rem,-4vw)] top-[max(4rem,16vh)]', // Player 0: left-top
              'absolute left-[max(0.25rem,-4vw)] bottom-[max(4rem,16vh)]', // Player 1: left-bottom  
              'absolute right-[max(0.25rem,-4vw)] top-[max(4rem,16vh)]' // Player 2: right-top
            ];
            const rotations = ['rotate-90', 'rotate-90', 'rotate-[-90deg]']; // left side clockwise, right side counter-clockwise
            positionClass = positions[idx];
            rotationClass = rotations[idx];
          } else {
            // 4-player table layout: push cards closer to horizontal edges
            const positions = [
              'absolute left-[max(0.25rem,-4vw)] top-[max(4rem,16vh)]', // top-left - push further left
              'absolute left-[max(0.25rem,-4vw)] bottom-[max(4rem,16vh)]', // bottom-left - push further left
              'absolute right-[max(0.25rem,-4vw)] top-[max(4rem,16vh)]', // top-right - push further right
              'absolute right-[max(0.25rem,-4vw)] bottom-[max(4rem,16vh)]' // bottom-right - push further right
            ];
            const rotations = ['rotate-90', 'rotate-90', 'rotate-[-90deg]', 'rotate-[-90deg]']; // left side clockwise, right side counter-clockwise
            positionClass = positions[idx];
            rotationClass = rotations[idx];
          }

          return (
          <div
            key={player.id}
            id={`card-${idx + 1}`}
            className={`
              border-4 rounded-xl transition-all touch-manipulation 
              p-3 ${positionClass} w-[clamp(260px,35vw,350px)] h-36 ${rotationClass}
              ${player.isDead
                ? 'bg-gray-800 border-red-600 opacity-60'
                : (isSelectingStartingPlayer ? animatedActivePlayer === idx : activePlayer === idx)
                ? `${getPlayerColor(idx)} shadow-lg`
                : getPlayerColorDefault(idx)
              }
            `}
          >
            {/* Table layout content */}
            <div className="flex items-center justify-between w-full h-full">
              <div className="flex-1">
                {/* Death Button - positioned in top left */}
                <div className="absolute top-1 left-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeathButtonClick(idx);
                    }}
                    className={`w-8 h-8 rounded-full text-lg transition-colors ${
                      player.isDead 
                        ? deathButtonStates[idx] === 'normal' || !deathButtonStates[idx]
                          ? 'bg-red-800 border-2 border-red-600 hover:bg-red-700'
                          : deathButtonStates[idx] === 'revive_first'
                          ? 'bg-orange-600 hover:bg-orange-700 border-2 border-orange-400'
                          : 'bg-green-600 hover:bg-green-700 border-2 border-green-400'
                        : deathButtonStates[idx] === 'normal' || !deathButtonStates[idx]
                        ? 'bg-gray-700 hover:bg-gray-600 border-2 border-gray-500'
                        : deathButtonStates[idx] === 'first'
                        ? 'bg-orange-600 hover:bg-orange-700 border-2 border-orange-400'
                        : 'bg-red-600 hover:bg-red-700 border-2 border-red-400'
                    }`}
                    title={player.isDead ? "Revive player (tap 3 times)" : "Mark player as dead (tap 3 times)"}
                  >
                    💀
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                {/* Life total */}
                <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-center mb-2">
                  {player.life}
                </div>
                {/* Timer positioned below life total */}
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLifeChange(idx, -1);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      startHoldRepeat(idx, -1);
                    }}
                    onMouseUp={stopHoldRepeat}
                    onMouseLeave={stopHoldRepeat}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      startHoldRepeat(idx, -1);
                    }}
                    onTouchEnd={stopHoldRepeat}
                    className="bg-red-600 hover:bg-red-700 p-3 rounded text-lg touch-manipulation w-10 h-10 flex items-center justify-center"
                  >
                    -
                  </button>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-center min-w-[120px]">
                    {formatTime(player.time)}
                    {player.time < 60 && player.time > 0 && (
                      <div className="text-red-400 text-xs animate-pulse mt-1">
                        LOW!
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLifeChange(idx, 1);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      startHoldRepeat(idx, 1);
                    }}
                    onMouseUp={stopHoldRepeat}
                    onMouseLeave={stopHoldRepeat}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      startHoldRepeat(idx, 1);
                    }}
                    onTouchEnd={stopHoldRepeat}
                    className="bg-green-600 hover:bg-green-700 p-3 rounded text-lg touch-manipulation w-10 h-10 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex-1 text-right">
              </div>
            </div>
            
            {/* Commander Damage Button */}
            <div className="absolute top-1 right-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCommanderDamagePlayerIndex(idx);
                  setShowCommanderDamageModal(true);
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors"
                title="Commander Damage"
              >
                dmg
              </button>
            </div>

          </div>
        );
        })}
      </div>

    </div>


      {/* Dead Players Warning */}
      {players.some(p => p.life <= 0) && (
        <div className="mt-4 bg-red-900 border-2 border-red-600 rounded-lg p-4 text-center">
          <div className="font-bold text-lg mb-2">Players Eliminated:</div>
          <div className="text-sm">
            {players
              .map((p, index) => (p.life <= 0 ? `Player ${index + 1}` : null))
              .filter(Boolean)
              .join(', ')}
          </div>
        </div>
      )}

      {/* Commander Damage Modal Overlay */}
      {showCommanderDamageModal && commanderDamagePlayerIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          onClick={() => {
            setShowCommanderDamageModal(false);
            setCommanderDamagePlayerIndex(null);
          }}
        >
          {/* Container that handles rotation and sizing */}
          <div className={`pointer-events-auto ${
            gameSettings.numberOfPlayers === 3 ? (
              commanderDamagePlayerIndex === 0 ? 'rotate-90' : // top-left
              commanderDamagePlayerIndex === 1 ? 'rotate-90' : // bottom-left  
              'rotate-[-90deg]' // top-right
            ) : (
              commanderDamagePlayerIndex === 0 ? 'rotate-90' : // left-top
              commanderDamagePlayerIndex === 1 ? 'rotate-90' : // left-bottom  
              commanderDamagePlayerIndex === 2 ? 'rotate-[-90deg]' : // right-top
              'rotate-[-90deg]' // right-bottom
            )
          }`}>
            {/* Modal content - responsive sizing */}
            <div 
              className="bg-gray-800 rounded-lg shadow-2xl border-4 border-gray-600 flex flex-col"
              style={{
                width: 'min(125vw, 1000px)',
                height: 'min(50vh, 40vh)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
            
            {/* Header with Life Display */}
            <div className="flex items-center p-3 border-b border-gray-600 flex-shrink-0">
              <h2 className="text-base font-bold text-white flex-1">
                P{commanderDamagePlayerIndex + 1} Commander Damage
              </h2>
              <div className="text-center flex-1">
                <span className="text-sm text-gray-300 mr-2">Life:</span>
                <span className="text-2xl font-bold text-white">
                  {players[commanderDamagePlayerIndex]?.life || 0}
                </span>
              </div>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => {
                    setShowCommanderDamageModal(false);
                    setCommanderDamagePlayerIndex(null);
                  }}
                  className="text-gray-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Commander Damage Options - Fill remaining space */}
            <div className="flex-1 p-2 sm:p-4 md:p-6 flex items-center justify-center overflow-hidden">
              <div className="flex gap-2 sm:gap-4 md:gap-6 justify-center items-center">
                {players.map((_, sourceIdx) => {
                  if (sourceIdx === commanderDamagePlayerIndex) return null;
                  const displayIdx = sourceIdx > commanderDamagePlayerIndex ? sourceIdx - 1 : sourceIdx;
                  const currentDamage = players[commanderDamagePlayerIndex]?.commanderDamage[displayIdx] || 0;
                  
                  return (
                    <div
                      key={sourceIdx}
                      className={`${getPlayerColorCommanderDamage(sourceIdx)} rounded-lg p-3 sm:p-4 md:p-5 text-center border-4 flex-1 min-w-[120px] sm:min-w-[140px] md:min-w-[160px] max-w-[140px] sm:max-w-[160px] md:max-w-[180px] ${
                        currentDamage >= 21 ? 'border-red-500' : ''
                      }`}
                    >
                      <div className="text-base font-bold text-white mb-2">
                        P{sourceIdx + 1}
                      </div>
                      <div className="text-3xl font-bold mb-3 text-white">
                        {currentDamage}
                      </div>
                      {currentDamage >= 21 && (
                        <div className="text-red-600 font-bold text-sm mb-2 animate-pulse">
                          LETHAL!
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCommanderDamage(commanderDamagePlayerIndex, displayIdx, -1);
                          }}
                          className="bg-gray-800 hover:bg-gray-700 border-2 border-red-600 text-white text-base sm:text-lg md:text-xl font-bold w-9 h-12 sm:w-10 sm:h-14 md:w-11 md:h-16 rounded touch-manipulation transition-colors"
                        >
                          -1
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCommanderDamage(commanderDamagePlayerIndex, displayIdx, 1);
                          }}
                          className="bg-gray-800 hover:bg-gray-700 border-2 border-green-600 text-white text-base sm:text-lg md:text-xl font-bold w-9 h-12 sm:w-10 sm:h-14 md:w-11 md:h-16 rounded touch-manipulation transition-colors"
                        >
                          +1
                        </button>
                      </div>
                      <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCommanderDamage(commanderDamagePlayerIndex, displayIdx, -5);
                          }}
                          className="bg-red-600 hover:bg-red-700 border-2 border-red-600 text-white px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 rounded text-base sm:text-lg md:text-xl font-bold touch-manipulation transition-colors"
                        >
                          -5
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCommanderDamage(commanderDamagePlayerIndex, displayIdx, 5);
                          }}
                          className="bg-green-600 hover:bg-green-700 border-2 border-green-600 text-white px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 rounded text-base sm:text-lg md:text-xl font-bold touch-manipulation transition-colors"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Setup Menu Overlay */}
      {showSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-lg my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Game Settings</h2>
              <button
                onClick={() => setShowSetup(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-white mb-4">
              Note: Changing settings will reset the current game.
            </div>
            <button
              onClick={() => {
                setGameStarted(false);
                setShowSetup(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Return to Setup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
