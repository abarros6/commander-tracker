import { Minus, Plus } from 'lucide-react';
import { COMMANDER_DAMAGE_THRESHOLD, PLAYER_COLORS_TEXT, PLAYER_COLORS_LIGHT } from '../utils/constants';

export default function CommanderDamage({ 
  playerIndex, 
  commanderDamage, 
  onCommanderDamageChange, 
  players 
}) {
  const adjustCommanderDamage = (sourcePlayerIndex, amount) => {
    const newDamage = Math.max(0, commanderDamage[sourcePlayerIndex] + amount);
    const updatedDamage = [...commanderDamage];
    updatedDamage[sourcePlayerIndex] = newDamage;
    onCommanderDamageChange(updatedDamage);
  };

  const totalLethalDamage = commanderDamage.filter(damage => damage >= COMMANDER_DAMAGE_THRESHOLD).length;

  return (
    <div className="mt-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
      <div className="text-sm font-semibold mb-2 text-center text-gray-100">
        Commander Damage
        {totalLethalDamage > 0 && (
          <span className="ml-2 text-red-400 font-bold">
            ⚠️ LETHAL
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        {players.map((player, sourceIndex) => {
          if (sourceIndex === playerIndex) return null;
          
          const damage = commanderDamage[sourceIndex];
          const isLethal = damage >= COMMANDER_DAMAGE_THRESHOLD;
          
          return (
            <div 
              key={sourceIndex} 
              className={`${PLAYER_COLORS_LIGHT[sourceIndex]} rounded p-2 text-center`}
            >
              <div className={`text-xs font-medium ${PLAYER_COLORS_TEXT[sourceIndex]} text-gray-700`}>
                P{sourceIndex + 1}
              </div>
              <div className="flex items-center justify-center space-x-1">
                <button
                  onClick={() => adjustCommanderDamage(sourceIndex, -1)}
                  className="w-6 h-6 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center justify-center touch-manipulation"
                  disabled={damage === 0}
                >
                  <Minus size={12} />
                </button>
                <div className={`w-8 text-center font-bold text-lg ${
                  isLethal ? 'text-red-600' : 'text-gray-800'
                }`}>
                  {damage}
                </div>
                <button
                  onClick={() => adjustCommanderDamage(sourceIndex, 1)}
                  className="w-6 h-6 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center justify-center touch-manipulation"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}