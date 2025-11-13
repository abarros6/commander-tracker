import { Play, Pause, RotateCcw, SkipForward, Eye, EyeOff } from 'lucide-react';

export default function GameControls({ 
  isRunning, 
  onToggleTimer, 
  onResetGame, 
  onNextPlayer,
  showCommanderDamage,
  onToggleCommanderDamage
}) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-4 mb-6 border border-gray-700">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Play/Pause */}
        <button
          onClick={onToggleTimer}
          className={`
            flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold text-white
            ${isRunning 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
            }
            touch-manipulation
          `}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          <span className="hidden sm:inline">
            {isRunning ? 'Pause' : 'Play'}
          </span>
        </button>

        {/* Next Player */}
        <button
          onClick={onNextPlayer}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold touch-manipulation"
        >
          <SkipForward size={20} />
          <span className="hidden sm:inline">Next</span>
        </button>

        {/* Commander Damage Toggle */}
        <button
          onClick={onToggleCommanderDamage}
          className={`
            flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold text-white
            ${showCommanderDamage 
              ? 'bg-purple-500 hover:bg-purple-600' 
              : 'bg-gray-500 hover:bg-gray-600'
            }
            touch-manipulation
          `}
        >
          {showCommanderDamage ? <EyeOff size={20} /> : <Eye size={20} />}
          <span className="hidden sm:inline">CMD</span>
        </button>

        {/* Reset */}
        <button
          onClick={onResetGame}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold touch-manipulation"
        >
          <RotateCcw size={20} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
}