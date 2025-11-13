import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

export default function CommanderTracker() {
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', life: 40, time: 1200, commanderDamage: [0, 0, 0] },
    { id: 2, name: 'Player 2', life: 40, time: 1200, commanderDamage: [0, 0, 0] },
    { id: 3, name: 'Player 3', life: 40, time: 1200, commanderDamage: [0, 0, 0] },
    { id: 4, name: 'Player 4', life: 40, time: 1200, commanderDamage: [0, 0, 0] }
  ]);
  
  const [activePlayer, setActivePlayer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showCommanderDamage, setShowCommanderDamage] = useState(false);
  const intervalRef = useRef(null);

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
        newDamage[sourceIdx] = Math.max(0, newDamage[sourceIdx] + change);
        return { ...p, commanderDamage: newDamage };
      }
      return p;
    }));
  };

  const nextPlayer = () => {
    setActivePlayer((activePlayer + 1) % 4);
  };

  const resetGame = () => {
    setIsRunning(false);
    setActivePlayer(0);
    setPlayers(prev => prev.map(p => ({
      ...p,
      life: 40,
      time: 1200,
      commanderDamage: [0, 0, 0]
    })));
  };

  const getPlayerColor = (idx) => {
    const colors = [
      'bg-red-500 border-red-600',
      'bg-blue-500 border-blue-600',
      'bg-green-500 border-green-600',
      'bg-purple-500 border-purple-600'
    ];
    return colors[idx];
  };

  const getPlayerColorLight = (idx) => {
    const colors = [
      'bg-red-100 border-red-300',
      'bg-blue-100 border-blue-300',
      'bg-green-100 border-green-300',
      'bg-purple-100 border-purple-300'
    ];
    return colors[idx];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Commander Tracker</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={resetGame}
            className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Global Controls */}
      <div className="flex justify-between mb-4">
        <button
          onClick={nextPlayer}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
        >
          Next Player's Turn
        </button>
        <button
          onClick={() => setShowCommanderDamage(!showCommanderDamage)}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
        >
          {showCommanderDamage ? 'Hide' : 'Show'} Cmdr Dmg
        </button>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {players.map((player, idx) => (
          <div
            key={player.id}
            className={`border-4 rounded-xl p-4 transition-all ${
              activePlayer === idx
                ? `${getPlayerColor(idx)} shadow-lg scale-105`
                : 'bg-gray-800 border-gray-700'
            }`}
          >
            {/* Player Name */}
            <div className="text-center mb-2">
              <input
                type="text"
                value={player.name}
                onChange={(e) => {
                  setPlayers(prev => prev.map((p, i) => 
                    i === idx ? { ...p, name: e.target.value } : p
                  ));
                }}
                className="bg-transparent text-xl font-bold text-center w-full outline-none"
                onClick={() => setActivePlayer(idx)}
              />
              {activePlayer === idx && (
                <div className="text-sm font-semibold mt-1">ACTIVE TURN</div>
              )}
            </div>

            {/* Timer */}
            <div 
              className="text-5xl font-mono font-bold text-center mb-4 cursor-pointer"
              onClick={() => setActivePlayer(idx)}
            >
              {formatTime(player.time)}
            </div>

            {/* Life Total */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => handleLifeChange(idx, -1)}
                className="bg-red-600 hover:bg-red-700 p-3 rounded-lg"
              >
                <Minus size={20} />
              </button>
              <div className="text-4xl font-bold min-w-[80px] text-center">
                {player.life}
              </div>
              <button
                onClick={() => handleLifeChange(idx, 1)}
                className="bg-green-600 hover:bg-green-700 p-3 rounded-lg"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Quick Life Buttons */}
            <div className="flex justify-center gap-2 mb-3">
              {[-5, -1, +1, +5].map(val => (
                <button
                  key={val}
                  onClick={() => handleLifeChange(idx, val)}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
                >
                  {val > 0 ? '+' : ''}{val}
                </button>
              ))}
            </div>

            {/* Commander Damage */}
            {showCommanderDamage && (
              <div className="border-t border-gray-600 pt-3">
                <div className="text-xs text-center mb-2 opacity-75">
                  Commander Damage Taken
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {players.map((source, sourceIdx) => {
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
                            onClick={() => handleCommanderDamage(idx, displayIdx, -1)}
                            className="bg-gray-700 hover:bg-gray-600 text-white rounded px-1 text-xs"
                          >
                            -
                          </button>
                          <span className={`font-bold text-lg ${
                            player.commanderDamage[displayIdx] >= 21 ? 'text-red-600' : 'text-gray-800'
                          }`}>
                            {player.commanderDamage[displayIdx]}
                          </span>
                          <button
                            onClick={() => handleCommanderDamage(idx, displayIdx, 1)}
                            className="bg-gray-700 hover:bg-gray-600 text-white rounded px-1 text-xs"
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
        ))}
      </div>

      {/* Dead Players Warning */}
      {players.some(p => p.life <= 0) && (
        <div className="mt-4 bg-red-900 border-2 border-red-600 rounded-lg p-4 text-center">
          <div className="font-bold text-lg mb-2">Players Eliminated:</div>
          <div className="text-sm">
            {players
              .map((p, idx) => (p.life <= 0 ? p.name : null))
              .filter(Boolean)
              .join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}
