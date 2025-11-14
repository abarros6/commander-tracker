import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Settings, Clock, Heart, Menu, Dice1, Dice6, RotateCw, Layout, ArrowRight } from 'lucide-react';

export default function CommanderTracker() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [activePlayer, setActivePlayer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showCommanderDamage, setShowCommanderDamage] = useState(false);
  const [showGameMenu, setShowGameMenu] = useState(false);
  const [showDiceMenu, setShowDiceMenu] = useState(false);
  const [layout, setLayout] = useState('table'); // 'table', 'grid'
  const intervalRef = useRef(null);

  // Game settings
  const [gameSettings, setGameSettings] = useState({
    numberOfPlayers: 4,
    startingLife: 40,
    timerMinutes: 20
  });

  // Player state with floating mana - will be dynamically created based on numberOfPlayers
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (isRunning && activePlayer !== null) {
      intervalRef.current = setInterval(() => {
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === activePlayer && p.time > 0) {
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


  // Dice and coin functions
  const rollDice = (sides) => {
    return Math.floor(Math.random() * sides) + 1;
  };

  const flipCoin = () => {
    return Math.random() < 0.5 ? 'Heads' : 'Tails';
  };

  const nextPlayer = () => {
    // Clockwise order for 4 players: left-top → left-bottom → right-bottom → right-top
    // Clockwise order for 3 players: bottom → top-left → top-right
    let nextPlayerIndex;
    if (gameSettings.numberOfPlayers === 3) {
      // 3-player clockwise: 0 (bottom) → 1 (top-left) → 2 (top-right) → 0
      nextPlayerIndex = (activePlayer + 1) % 3;
    } else {
      // 4-player clockwise: 0 (left-top) → 1 (left-bottom) → 3 (right-bottom) → 2 (right-top) → 0
      const clockwiseOrder = [0, 1, 3, 2];
      const currentIndex = clockwiseOrder.indexOf(activePlayer);
      const nextIndex = (currentIndex + 1) % 4;
      nextPlayerIndex = clockwiseOrder[nextIndex];
    }
    setActivePlayer(nextPlayerIndex);
  };

  const createPlayers = (numberOfPlayers, startingLife, timeInSeconds) => {
    const newPlayers = [];
    for (let i = 0; i < numberOfPlayers; i++) {
      const commanderDamageArray = new Array(numberOfPlayers - 1).fill(0);
      newPlayers.push({
        id: i + 1,
        life: startingLife,
        time: timeInSeconds,
        commanderDamage: commanderDamageArray
      });
    }
    return newPlayers;
  };

  const startNewGame = (settings) => {
    const timeInSeconds = settings.timerMinutes * 60;
    setGameSettings(settings);
    const newPlayers = createPlayers(settings.numberOfPlayers, settings.startingLife, timeInSeconds);
    setPlayers(newPlayers);
    
    // Randomly choose starting player
    const randomStartingPlayer = Math.floor(Math.random() * settings.numberOfPlayers);
    setActivePlayer(randomStartingPlayer);
    
    setIsRunning(false);
    setGameStarted(true);
    setShowSetup(false);
  };

  const resetGame = () => {
    setIsRunning(false);
    const timeInSeconds = gameSettings.timerMinutes * 60;
    const newPlayers = createPlayers(gameSettings.numberOfPlayers, gameSettings.startingLife, timeInSeconds);
    setPlayers(newPlayers);
    
    // Randomly choose starting player again
    const randomStartingPlayer = Math.floor(Math.random() * gameSettings.numberOfPlayers);
    setActivePlayer(randomStartingPlayer);
  };

  const getPlayerColor = (idx) => {
    const colors = [
      'bg-red-500 border-red-600',
      'bg-blue-500 border-blue-600',
      'bg-green-500 border-green-600',
      'bg-purple-500 border-purple-600'
    ];
    return colors[idx % colors.length];
  };

  const getPlayerColorLight = (idx) => {
    const colors = [
      'bg-red-100 border-red-300',
      'bg-blue-100 border-blue-300',
      'bg-green-100 border-green-300',
      'bg-purple-100 border-purple-300'
    ];
    return colors[idx % colors.length];
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
                onClick={() => updateSetting('startingLife', Math.max(1, tempSettings.startingLife - 5))}
                className="bg-red-600 hover:bg-red-700 p-4 rounded-lg text-xl font-bold touch-manipulation transition-colors"
              >
                -5
              </button>
              <div className="text-3xl font-bold min-w-[100px] text-center">
                {tempSettings.startingLife}
              </div>
              <button
                onClick={() => updateSetting('startingLife', tempSettings.startingLife + 5)}
                className="bg-green-600 hover:bg-green-700 p-4 rounded-lg text-xl font-bold touch-manipulation transition-colors"
              >
                +5
              </button>
            </div>
            <div className="flex justify-center gap-2 mt-3">
              {[20, 30, 40].map(life => (
                <button
                  key={life}
                  onClick={() => updateSetting('startingLife', life)}
                  className={`px-4 py-3 rounded-lg font-semibold touch-manipulation transition-colors ${
                    tempSettings.startingLife === life
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {life}
                </button>
              ))}
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
                onClick={() => updateSetting('timerMinutes', Math.max(5, tempSettings.timerMinutes - 5))}
                className="bg-red-600 hover:bg-red-700 p-3 rounded-lg text-2xl font-bold touch-manipulation"
              >
                -5
              </button>
              <div className="text-3xl font-bold min-w-[80px] text-center">
                {tempSettings.timerMinutes}
              </div>
              <button
                onClick={() => updateSetting('timerMinutes', tempSettings.timerMinutes + 5)}
                className="bg-green-600 hover:bg-green-700 p-3 rounded-lg text-2xl font-bold touch-manipulation"
              >
                +5
              </button>
            </div>
            <div className="flex justify-center gap-2 mt-3">
              {[10, 15, 20, 30].map(minutes => (
                <button
                  key={minutes}
                  onClick={() => updateSetting('timerMinutes', minutes)}
                  className={`px-4 py-2 rounded-lg font-semibold touch-manipulation ${
                    tempSettings.timerMinutes === minutes
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {minutes}m
                </button>
              ))}
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
    <div 
      className="min-h-screen bg-gray-900 text-white relative overflow-hidden"
      onClick={() => {
        setShowGameMenu(false);
        setShowDiceMenu(false);
      }}
    >
      {/* Center Controls - Back to original center positioning */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 flex items-center gap-3">
        {/* Settings Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowGameMenu(!showGameMenu);
          }}
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-lg touch-manipulation"
        >
          <Menu size={18} />
        </button>
        
        {/* Reset Game Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            resetGame();
          }}
          className="bg-purple-600 hover:bg-purple-700 p-3 rounded-full shadow-lg touch-manipulation"
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
      <div className={`
        ${layout === 'grid' 
          ? `grid gap-3 p-4 min-h-screen ${
              gameSettings.numberOfPlayers === 3 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'
            } place-items-center`
          : 'relative min-h-screen overflow-hidden'
        }
      `}>
        {players.slice(0, gameSettings.numberOfPlayers).map((player, idx) => {
          // Position and rotate cards based on layout
          let positionClass = '';
          let rotationClass = '';
          
          if (layout === 'table') {
            if (gameSettings.numberOfPlayers === 3) {
              // 3-player table layout: push cards closer to horizontal edges
              const positions = [
                'absolute bottom-[max(2rem,5vh)] left-1/2 transform -translate-x-1/2',
                'absolute top-[max(4rem,16vh)] left-[max(0.25rem,1vw)]',
                'absolute top-[max(4rem,16vh)] right-[max(0.25rem,1vw)]'
              ];
              const rotations = ['', 'rotate-[135deg]', 'rotate-[-135deg]']; // bottom normal, top-left rotated, top-right rotated
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
          }

          return (
          <div
            key={player.id}
            onClick={() => {
              // Touch to pass turn
              if (activePlayer === idx) {
                nextPlayer();
              } else {
                setActivePlayer(idx);
              }
            }}
            className={`
              border-4 rounded-xl transition-all cursor-pointer touch-manipulation
              ${layout === 'grid' 
                ? 'p-4 w-full max-w-sm mx-auto' 
                : `p-4 ${positionClass} w-[clamp(300px,45vw,450px)]`
              }
              ${rotationClass}
              ${activePlayer === idx
                ? `${getPlayerColor(idx)} shadow-lg`
                : 'bg-gray-800 border-gray-700'
              }
            `}
          >
            {layout === 'grid' ? (
              // Full layout for grid view
              <>
                {/* Player Number & Active Indicator */}
                <div className="text-center mb-3">
                  <div className="text-lg font-bold text-gray-300 mb-1">
                    Player {idx + 1}
                  </div>
                  {activePlayer === idx && (
                    <div className="text-sm font-semibold bg-white bg-opacity-20 rounded px-3 py-2 inline-block">
                      ACTIVE TURN
                    </div>
                  )}
                </div>

                {/* Timer */}
                <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-center mb-3">
                  {formatTime(player.time)}
                  {player.time < 60 && player.time > 0 && (
                    <div className="text-red-400 text-xs animate-pulse mt-1">
                      TIME LOW!
                    </div>
                  )}
                </div>

                {/* Life Total */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLifeChange(idx, -1);
                    }}
                    className="bg-red-600 hover:bg-red-700 p-3 rounded-lg touch-manipulation transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="text-4xl sm:text-5xl font-bold min-w-[80px] text-center">
                    {player.life}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLifeChange(idx, 1);
                    }}
                    className="bg-green-600 hover:bg-green-700 p-3 rounded-lg touch-manipulation transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Quick Life Buttons */}
                <div className="flex justify-center gap-2 mb-3">
                  {[-5, -1, +1, +5].map(val => (
                    <button
                      key={val}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLifeChange(idx, val);
                      }}
                      className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm touch-manipulation transition-colors"
                    >
                      {val > 0 ? '+' : ''}{val}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              // Compact layout for table view - restore original MTG Companion style
              <>
                <div className="flex items-center justify-between w-full h-full">
                  <div className="flex-1">
                    {activePlayer === idx && (
                      <div className="text-xs font-semibold bg-white bg-opacity-30 rounded px-2 py-1 inline-block">
                        ACTIVE
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center">
                    {/* Large life total - main focus */}
                    <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-center mb-2">
                      {player.life}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLifeChange(idx, -1);
                        }}
                        className="bg-red-600 hover:bg-red-700 p-2 rounded text-sm touch-manipulation w-8 h-8 flex items-center justify-center"
                      >
                        -
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLifeChange(idx, 1);
                        }}
                        className="bg-green-600 hover:bg-green-700 p-2 rounded text-sm touch-manipulation w-8 h-8 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-right">
                    {/* Timer - smaller in table view */}
                    <div className="text-2xl sm:text-3xl font-mono font-bold">
                      {formatTime(player.time)}
                    </div>
                    {player.time < 60 && player.time > 0 && (
                      <div className="text-red-400 text-xs animate-pulse">
                        LOW!
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Commander Damage - only in grid layout */}
            {layout === 'grid' && showCommanderDamage && (
              <div className="border-t border-gray-600 pt-3">
                <div className="text-xs text-center mb-2 opacity-75">
                  Commander Damage Taken
                </div>
                <div className={`grid gap-2 ${gameSettings.numberOfPlayers === 3 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {players.map((_, sourceIdx) => {
                    if (sourceIdx === idx) return null;
                    const displayIdx = sourceIdx > idx ? sourceIdx - 1 : sourceIdx;
                    return (
                      <div
                        key={sourceIdx}
                        className={`${getPlayerColorLight(sourceIdx)} rounded p-2 text-center`}
                      >
                        <div className="text-xs opacity-75 text-gray-700">
                          P{sourceIdx + 1}
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCommanderDamage(idx, displayIdx, -1);
                            }}
                            className="bg-gray-700 hover:bg-gray-600 text-white rounded px-1 text-xs touch-manipulation"
                          >
                            -
                          </button>
                          <span className={`font-bold text-sm ${
                            player.commanderDamage[displayIdx] >= 21 ? 'text-red-600' : 'text-gray-800'
                          }`}>
                            {player.commanderDamage[displayIdx]}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCommanderDamage(idx, displayIdx, 1);
                            }}
                            className="bg-gray-700 hover:bg-gray-600 text-white rounded px-1 text-xs touch-manipulation"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
        })}
      </div>

      {/* Floating Game Menu */}
      {showGameMenu && (
        <div 
          className="fixed top-16 right-4 z-50 bg-gray-800 rounded-lg shadow-xl p-4 w-64"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Layout Options */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center">
              <Layout className="mr-2" size={16} />
              Layout
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'table', label: 'Table' },
                { key: 'grid', label: 'Grid' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setLayout(key)}
                  className={`px-3 py-2 rounded text-xs font-medium ${
                    layout === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Game Controls */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Game Controls</h3>
            <div className="space-y-2">
              <button
                onClick={nextPlayer}
                className="w-full bg-green-600 hover:bg-green-700 p-2 rounded text-sm flex items-center justify-center"
              >
                <ArrowRight className="mr-2" size={16} />
                Next Player (Clockwise)
              </button>
              <button
                onClick={() => setShowCommanderDamage(!showCommanderDamage)}
                className="w-full bg-gray-700 hover:bg-gray-600 p-2 rounded text-sm"
              >
                {showCommanderDamage ? 'Hide' : 'Show'} Commander Damage
              </button>
              <button
                onClick={resetGame}
                className="w-full bg-red-600 hover:bg-red-700 p-2 rounded text-sm flex items-center justify-center"
              >
                <RotateCcw className="mr-2" size={16} />
                Reset Game
              </button>
            </div>
          </div>

          {/* Dice and Coin */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center">
              <Dice6 className="mr-2" size={16} />
              Dice & Coin
            </h3>
            <button
              onClick={() => setShowDiceMenu(!showDiceMenu)}
              className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded text-sm"
            >
              Roll Dice / Flip Coin
            </button>
          </div>

          {/* Settings */}
          <button
            onClick={() => {
              setShowSetup(true);
              setShowGameMenu(false);
            }}
            className="w-full bg-gray-700 hover:bg-gray-600 p-2 rounded text-sm flex items-center justify-center"
          >
            <Settings className="mr-2" size={16} />
            Game Settings
          </button>
        </div>
      )}

      {/* Dice Menu */}
      {showDiceMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Dice & Coin</h2>
              <button
                onClick={() => setShowDiceMenu(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {/* Dice Rolling */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Roll Dice</h3>
              <div className="grid grid-cols-3 gap-2">
                {[4, 6, 8, 10, 12, 20].map(sides => (
                  <button
                    key={sides}
                    onClick={() => {
                      const result = rollDice(sides);
                      alert(`D${sides}: ${result}`);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-sm font-bold flex flex-col items-center"
                  >
                    <Dice1 size={20} />
                    <span>D{sides}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Coin Flip */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Coin Flip</h3>
              <button
                onClick={() => {
                  const result = flipCoin();
                  alert(`Coin Flip: ${result}`);
                }}
                className="w-full bg-yellow-600 hover:bg-yellow-700 p-3 rounded-lg font-bold flex items-center justify-center"
              >
                <RotateCw className="mr-2" size={20} />
                Flip Coin
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Setup Menu Overlay */}
      {showSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-lg my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Game Settings</h2>
              <button
                onClick={() => setShowSetup(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-gray-300 mb-4">
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
    </div>
  );
}
