import { useState } from 'react';
import TimerDisplay from './TimerDisplay';
import LifeCounter from './LifeCounter';
import CommanderDamage from './CommanderDamage';
import { PLAYER_COLORS, PLAYER_COLORS_ACTIVE } from '../utils/constants';

export default function PlayerCard({ 
  player, 
  playerIndex, 
  isActive, 
  onSetActivePlayer, 
  onUpdatePlayer,
  players,
  showCommanderDamage 
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(player.name);

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    onUpdatePlayer(playerIndex, { ...player, name: tempName });
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(player.name);
    setIsEditingName(false);
  };

  const handleLifeChange = (newLife) => {
    onUpdatePlayer(playerIndex, { ...player, life: newLife });
  };

  const handleCommanderDamageChange = (newCommanderDamage) => {
    onUpdatePlayer(playerIndex, { ...player, commanderDamage: newCommanderDamage });
  };

  const isLowTime = player.time < 60;
  const cardColorClass = isActive ? PLAYER_COLORS_ACTIVE[playerIndex] : PLAYER_COLORS[playerIndex];

  return (
    <div 
      className={`
        border-4 rounded-xl p-4 transition-all duration-200 cursor-pointer
        ${cardColorClass}
        ${isActive ? 'transform' : ''}
        min-h-[300px] flex flex-col justify-between
        touch-manipulation
      `}
      onClick={onSetActivePlayer}
    >
      {/* Player Name */}
      <div className="text-center mb-3">
        {isEditingName ? (
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="text-lg font-semibold text-center bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') handleNameSave();
                if (e.key === 'Escape') handleNameCancel();
              }}
              autoFocus
            />
            <div className="flex space-x-2 justify-center">
              <button
                onClick={(e) => { e.stopPropagation(); handleNameSave(); }}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm"
              >
                Save
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNameCancel(); }}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <h3 
            className="text-lg md:text-xl font-semibold cursor-pointer hover:bg-black hover:bg-opacity-20 rounded px-2 py-1 text-white"
            onClick={(e) => { e.stopPropagation(); handleNameEdit(); }}
          >
            {player.name}
          </h3>
        )}
      </div>

      {/* Timer */}
      <div className="mb-4">
        <TimerDisplay 
          time={player.time} 
          isActive={isActive} 
          isLowTime={isLowTime}
        />
      </div>

      {/* Life Counter */}
      <div className="mb-4" onClick={(e) => e.stopPropagation()}>
        <LifeCounter 
          life={player.life}
          onLifeChange={handleLifeChange}
          playerColor={playerIndex}
        />
      </div>

      {/* Commander Damage */}
      {showCommanderDamage && (
        <div onClick={(e) => e.stopPropagation()}>
          <CommanderDamage 
            playerIndex={playerIndex}
            commanderDamage={player.commanderDamage}
            onCommanderDamageChange={handleCommanderDamageChange}
            players={players}
          />
        </div>
      )}
    </div>
  );
}